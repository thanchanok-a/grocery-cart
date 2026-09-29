// The shop assistant. Two modes:
//  1. AI mode (ANTHROPIC_API_KEY set): Claude answers, using "tools" that read your real
//     catalog, delivery slots and orders, so it never invents prices or stock.
//  2. Offline mode (no key): simple keyword rules, so the chat still works while you develop.
import Anthropic from "@anthropic-ai/sdk";
import { searchProducts, getProduct, CATEGORIES, formatPrice } from "@/lib/catalog";
import { getOrder, getDeliverySlots, FREE_DELIVERY_OVER, DELIVERY_FEE } from "@/lib/orders";

const STORE_NAME = "FreshCart";

// ---------- Tools the AI can call ----------
const TOOLS = [
  {
    name: "search_products",
    description:
      "Search the store catalog. Use for any question about what we sell, prices, stock, or ingredients for a recipe (search each ingredient separately).",
    input_schema: {
      type: "object",
      properties: {
        query: { type: "string", description: "Keywords, e.g. 'oat milk' or 'pasta'" },
        category: { type: "string", enum: CATEGORIES, description: "Optional category filter" },
      },
      required: ["query"],
    },
  },
  {
    name: "add_to_cart",
    description:
      "Add a product to the customer's cart. Only call when the customer clearly asks to add/buy something. Use a product_id returned by search_products.",
    input_schema: {
      type: "object",
      properties: {
        product_id: { type: "string" },
        quantity: { type: "integer", minimum: 1, maximum: 20 },
      },
      required: ["product_id"],
    },
  },
  {
    name: "get_order_status",
    description: "Look up an order by its order number (looks like FC1A2B3C).",
    input_schema: {
      type: "object",
      properties: { order_id: { type: "string" } },
      required: ["order_id"],
    },
  },
  {
    name: "get_delivery_slots",
    description: "List the next available delivery time slots.",
    input_schema: { type: "object", properties: {} },
  },
];

function publicProduct(p) {
  return { id: p.id, name: p.name, price: p.price, unit: p.unit, category: p.category, in_stock: p.stock > 0, stock: p.stock };
}

// Runs a tool and records side effects (cards to show, cart actions) in `ctx`.
function runTool(name, input, ctx) {
  switch (name) {
    case "search_products": {
      const results = searchProducts(input.query, { category: input.category, limit: 8 });
      results.forEach((p) => ctx.products.set(p.id, p));
      return results.length ? results.map(publicProduct) : { message: "No matching products." };
    }
    case "add_to_cart": {
      const p = getProduct(input.product_id);
      const qty = Math.max(1, Math.min(20, Number(input.quantity) || 1));
      if (!p) return { ok: false, error: "Unknown product id" };
      if (p.stock < qty) return { ok: false, error: `Only ${p.stock} in stock` };
      ctx.actions.push({ type: "add_to_cart", id: p.id, qty });
      ctx.products.set(p.id, p);
      return { ok: true, added: p.name, quantity: qty };
    }
    case "get_order_status": {
      const o = getOrder(input.order_id);
      if (!o) return { found: false };
      return {
        found: true,
        id: o.id,
        status: o.status,
        delivery_slot: o.slot,
        total: o.total,
        items: o.items.map((i) => `${i.qty} x ${i.name}`),
      };
    }
    case "get_delivery_slots":
      return { slots: getDeliverySlots(), delivery_fee: DELIVERY_FEE, free_delivery_over: FREE_DELIVERY_OVER };
    default:
      return { error: "Unknown tool" };
  }
}

function systemPrompt(cart) {
  const cartText = cart.length
    ? cart
        .map((c) => {
          const p = getProduct(c.id);
          return p ? `- ${c.qty} x ${p.name} (${formatPrice(p.price)} each)` : null;
        })
        .filter(Boolean)
        .join("\n")
    : "(empty)";

  return `You are the friendly shopping assistant for ${STORE_NAME}, an online grocery store.

Rules:
- Only state prices, stock and product names that come from tool results. Never invent products.
- If something is out of stock or not sold, say so and suggest the closest alternative from search results.
- For recipe or meal ideas, search for each ingredient and tell the customer which ones we carry.
- Only add items to the cart when the customer asks you to.
- Delivery costs ${formatPrice(DELIVERY_FEE)}, free on orders over ${formatPrice(FREE_DELIVERY_OVER)}.
- For refunds, complaints or anything you can't handle, ask them to email support@freshcart.example.
- Keep replies short (1–4 sentences or a short list). Plain text, no markdown headings.

The customer's current cart:
${cartText}`;
}

// Keep only well-formed turns, starting with a user message.
function cleanMessages(messages) {
  const list = (Array.isArray(messages) ? messages : [])
    .filter((m) => (m.role === "user" || m.role === "assistant") && typeof m.content === "string" && m.content.trim())
    .map((m) => ({ role: m.role, content: m.content.slice(0, 2000) }))
    .slice(-20);
  while (list.length && list[0].role !== "user") list.shift();
  return list;
}

async function aiReply(messages, cart) {
  const client = new Anthropic(); // reads ANTHROPIC_API_KEY from the environment
  const model = process.env.ANTHROPIC_MODEL || "claude-haiku-4-5-20251001";
  const ctx = { products: new Map(), actions: [] };
  const convo = [...messages];

  for (let step = 0; step < 6; step++) {
    const res = await client.messages.create({
      model,
      max_tokens: 800,
      system: systemPrompt(cart),
      tools: TOOLS,
      messages: convo,
    });

    if (res.stop_reason !== "tool_use") {
      const reply = res.content.filter((b) => b.type === "text").map((b) => b.text).join("\n").trim();
      return finish(reply || "Sorry, I didn't catch that. Could you rephrase?", ctx);
    }

    convo.push({ role: "assistant", content: res.content });
    const results = res.content
      .filter((b) => b.type === "tool_use")
      .map((b) => ({
        type: "tool_result",
        tool_use_id: b.id,
        content: JSON.stringify(runTool(b.name, b.input || {}, ctx)),
      }));
    convo.push({ role: "user", content: results });
  }
  return finish("Sorry, that took too many steps. Could you ask in a simpler way?", ctx);
}

function finish(reply, ctx) {
  return { reply, products: [...ctx.products.values()].slice(0, 6), actions: ctx.actions };
}

// ---------- Offline fallback (no API key) ----------
export function offlineReply(messages) {
  const last = [...messages].reverse().find((m) => m.role === "user");
  const text = (last?.content || "").trim();
  const lower = text.toLowerCase();
  const ctx = { products: new Map(), actions: [] };

  const orderMatch = text.match(/\bFC[A-Z0-9]{4,}\b/i);
  if (orderMatch) {
    const o = getOrder(orderMatch[0]);
    return finish(
      o
        ? `Order ${o.id} is "${o.status}". Delivery slot: ${o.slot}. Total ${formatPrice(o.total)}.`
        : `I couldn't find order ${orderMatch[0].toUpperCase()}. Please check the number on your confirmation page.`,
      ctx
    );
  }
  if (/\b(order|track|where)\b/.test(lower) && /\b(my|order)\b/.test(lower)) {
    return finish("Sure! What's your order number? It starts with FC and is on your confirmation page.", ctx);
  }
  if (/\b(deliver|delivery|slot|when)\b/.test(lower)) {
    const slots = getDeliverySlots().slice(0, 4).join("; ");
    return finish(
      `Next delivery slots: ${slots}. Delivery is ${formatPrice(DELIVERY_FEE)}, free over ${formatPrice(FREE_DELIVERY_OVER)}.`,
      ctx
    );
  }
  if (/^(hi|hello|hey|help)\b/.test(lower) || !text) {
    return finish(
      "Hi! I can find products, check prices and stock, add items to your cart, show delivery slots, or track an order. Try \"add 2 bananas\" or \"do you have oat milk?\"",
      ctx
    );
  }

  const addMatch = lower.match(/^(?:please\s+)?(?:add|buy|get me)\s+(\d+)?\s*(?:x\s*)?(.+)$/);
  if (addMatch) {
    const qty = Math.max(1, Math.min(20, Number(addMatch[1]) || 1));
    const [p] = searchProducts(addMatch[2], { limit: 1 });
    if (!p) return finish(`Sorry, I couldn't find "${addMatch[2]}".`, ctx);
    runTool("add_to_cart", { product_id: p.id, quantity: qty }, ctx);
    return finish(
      p.stock >= qty
        ? `Added ${qty} x ${p.name} to your cart (${formatPrice(p.price)} each).`
        : p.stock === 0
          ? `Sorry, ${p.name} is out of stock right now.`
          : `Sorry, we only have ${p.stock} of ${p.name} right now.`,
      ctx
    );
  }

  const results = searchProducts(text, { limit: 6 });
  results.forEach((p) => ctx.products.set(p.id, p));
  if (!results.length) {
    return finish("I couldn't find a match. Try a simpler word like \"milk\", \"pasta\" or \"snacks\".", ctx);
  }
  const inStock = results.filter((p) => p.stock > 0);
  const out = results.filter((p) => p.stock === 0);
  let reply = `Here's what I found: ${inStock.map((p) => `${p.name} ${formatPrice(p.price)}`).join(", ") || "nothing in stock"}.`;
  if (out.length) reply += ` Currently out of stock: ${out.map((p) => p.name).join(", ")}.`;
  return finish(reply, ctx);
}

// ---------- Entry point used by the API route ----------
export async function chat({ messages, cart }) {
  const clean = cleanMessages(messages);
  const safeCart = (Array.isArray(cart) ? cart : []).slice(0, 50);
  if (!clean.length) return offlineReply([]);

  if (!process.env.ANTHROPIC_API_KEY) {
    const r = offlineReply(clean);
    return { ...r, mode: "offline" };
  }
  try {
    const r = await aiReply(clean, safeCart);
    return { ...r, mode: "ai" };
  } catch (err) {
    console.error("Chatbot AI error:", err?.message || err);
    const r = offlineReply(clean);
    return { ...r, mode: "offline" };
  }
}

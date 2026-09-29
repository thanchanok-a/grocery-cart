// The Thai Grocery shop assistant. Two modes:
//  1. AI mode (ANTHROPIC_API_KEY set): Claude answers, using "tools" that read your real
//     catalog, recipes, delivery slots and orders, so it never invents prices or stock.
//  2. Basic mode (no key): keyword rules in English and Thai, so the chat still works.
import Anthropic from "@anthropic-ai/sdk";
import { searchProducts, getProduct, getAllProducts, CATEGORIES, formatPrice } from "@/lib/catalog";
import { getOrder, getDeliverySlots, FREE_DELIVERY_OVER, DELIVERY_FEE } from "@/lib/orders";

// ---------- Change these to match your shop ----------
const STORE_NAME = "Thai Grocery";
const SUPPORT_EMAIL = "support@thaigrocery.example";

// ---------- Thai dishes the assistant can shop for ----------
// "ids" are product ids from data/products.js. Add your own dishes here.
const RECIPES = [
  { name: "Pad Thai", thai: "ผัดไทย", keys: ["pad thai", "padthai", "ผัดไทย"], ids: ["t26", "t21", "t20", "t13", "t33", "t34", "t35", "t12", "t9", "t6"] },
  { name: "Green Curry", thai: "แกงเขียวหวาน", keys: ["green curry", "gaeng keow wan", "แกงเขียวหวาน", "แกงเขียว"], ids: ["t15", "t19", "t30", "t8", "t1", "t5", "t13", "t20", "t24"] },
  { name: "Red Curry", thai: "แกงเผ็ด", keys: ["red curry", "แกงเผ็ด"], ids: ["t16", "t19", "t30", "t8", "t1", "t5", "t13", "t20", "t24"] },
  { name: "Massaman Curry", thai: "แกงมัสมั่น", keys: ["massaman", "มัสมั่น"], ids: ["t17", "t19", "t30", "t7", "t20", "t21", "t13", "t24"] },
  { name: "Tom Yum Goong", thai: "ต้มยำกุ้ง", keys: ["tom yum", "tom yam", "ต้มยำ"], ids: ["t33", "t18", "t3", "t4", "t5", "t6", "t9", "t13"] },
  { name: "Tom Kha Gai", thai: "ต้มข่าไก่", keys: ["tom kha", "ต้มข่า"], ids: ["t30", "t19", "t4", "t3", "t5", "t6", "t9", "t13"] },
  { name: "Pad Kra Pao", thai: "ผัดกะเพรา", keys: ["kra pao", "krapow", "kaprao", "gaprao", "basil stir fry", "กะเพรา", "กระเพรา"], ids: ["t32", "t2", "t6", "t14", "t13", "t35", "t24"] },
  { name: "Som Tam", thai: "ส้มตำ", keys: ["som tam", "papaya salad", "ส้มตำ"], ids: ["t10", "t6", "t9", "t13", "t20", "t25"] },
  { name: "Mango Sticky Rice", thai: "ข้าวเหนียวมะม่วง", keys: ["mango sticky rice", "ข้าวเหนียวมะม่วง"], ids: ["t11", "t25", "t19", "t20"] },
  { name: "Thai Iced Tea", thai: "ชาเย็น", keys: ["thai tea", "iced tea", "cha yen", "ชาเย็น", "ชาไทย"], ids: ["t40", "t41"] },
];

function findRecipe(text) {
  const t = String(text || "").toLowerCase();
  return RECIPES.find((r) => r.keys.some((k) => t.includes(k))) || null;
}

function recipeProducts(recipe) {
  return recipe.ids.map(getProduct).filter(Boolean);
}

// Thai text has no spaces, so match product Thai names directly.
const THAI = /[฀-๿]/;
function searchThai(text) {
  const t = String(text || "");
  return getAllProducts().filter((p) => {
    const m = p.name.match(/\(([^)]*[฀-๿][^)]*)\)/); // Thai name inside ( )
    if (!m) return false;
    const thaiName = m[1].trim();
    return t.includes(thaiName) || (thaiName.length >= 2 && t.length >= 2 && thaiName.includes(t.replace(/[^฀-๿]/g, "")));
  });
}

// ---------- Tools the AI can call ----------
const TOOLS = [
  {
    name: "search_products",
    description:
      "Search the store catalog. Use for any question about what we sell, prices, stock, or ingredients (search each ingredient separately, in English, e.g. 'fish sauce', 'galangal').",
    input_schema: {
      type: "object",
      properties: {
        query: { type: "string", description: "English keywords, e.g. 'coconut milk' or 'green curry paste'" },
        category: { type: "string", enum: CATEGORIES, description: "Optional category filter" },
      },
      required: ["query"],
    },
  },
  {
    name: "get_recipe_ingredients",
    description:
      "Get the ingredients we sell for a Thai dish (e.g. Pad Thai, Green Curry, Tom Yum, Som Tam, Pad Kra Pao, Massaman, Mango Sticky Rice, Thai Iced Tea). Use this first for recipe questions.",
    input_schema: {
      type: "object",
      properties: { dish: { type: "string", description: "Dish name in English or Thai" } },
      required: ["dish"],
    },
  },
  {
    name: "add_to_cart",
    description:
      "Add a product to the customer's cart. Only call when the customer clearly asks to add/buy something. Use a product_id from a previous tool result.",
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
    case "get_recipe_ingredients": {
      const r = findRecipe(input.dish);
      if (!r) return { found: false, message: "No saved recipe. Use search_products for each ingredient instead." };
      const items = recipeProducts(r);
      items.forEach((p) => ctx.products.set(p.id, p));
      return { found: true, dish: `${r.name} (${r.thai})`, ingredients_we_sell: items.map(publicProduct) };
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

  return `You are "Nong" (น้อง), the warm and helpful shopping assistant for ${STORE_NAME}, an online Thai grocery store.

Personality:
- Friendly Thai hospitality: polite, cheerful, a little playful. Greet with "สวัสดีค่ะ 🙏" and thank with "ขอบคุณค่ะ".
- You love Thai food and give practical home-cooking tips (spice level, substitutions, how to store fresh herbs).
- Reply in the customer's language: if they write in Thai, answer in Thai; otherwise answer in English with a touch of Thai.

Rules:
- Only state prices, stock and product names that come from tool results. Never invent products.
- For a Thai dish, call get_recipe_ingredients first, then list what we carry with prices and mention anything we don't stock.
- If something is out of stock, say so kindly and suggest the closest alternative from search results.
- Only add items to the cart when the customer asks you to.
- Delivery costs ${formatPrice(DELIVERY_FEE)}, free on orders over ${formatPrice(FREE_DELIVERY_OVER)}.
- For refunds, complaints or anything you can't handle, ask them to email ${SUPPORT_EMAIL}.
- Keep replies short (1–5 sentences or a short list). Plain text, a few emoji are fine, no markdown headings.

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
      max_tokens: 900,
      system: systemPrompt(cart),
      tools: TOOLS,
      messages: convo,
    });

    if (res.stop_reason !== "tool_use") {
      const reply = res.content.filter((b) => b.type === "text").map((b) => b.text).join("\n").trim();
      return finish(reply || "ขอโทษค่ะ, I didn't catch that. Could you say it another way? 🙏", ctx);
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
  return finish("ขอโทษค่ะ, that was a bit too much for me. Could you ask in a simpler way? 🙏", ctx);
}

function finish(reply, ctx, limit = 6) {
  return { reply, products: [...ctx.products.values()].slice(0, limit), actions: ctx.actions };
}

// ---------- Basic mode (no API key): English + Thai keywords ----------
export function offlineReply(messages) {
  const last = [...messages].reverse().find((m) => m.role === "user");
  const text = (last?.content || "").trim();
  const lower = text.toLowerCase();
  const isThai = THAI.test(text);
  const ctx = { products: new Map(), actions: [] };

  // Order lookup
  const orderMatch = text.match(/\bFC[A-Z0-9]{4,}\b/i);
  if (orderMatch) {
    const o = getOrder(orderMatch[0]);
    return finish(
      o
        ? isThai
          ? `ออเดอร์ ${o.id} สถานะ: "${o.status}" 📦 รอบส่ง: ${o.slot} ยอดรวม ${formatPrice(o.total)} ค่ะ`
          : `Order ${o.id} is "${o.status}" 📦 Delivery slot: ${o.slot}. Total ${formatPrice(o.total)}.`
        : isThai
          ? `ขอโทษค่ะ ไม่พบออเดอร์ ${orderMatch[0].toUpperCase()} กรุณาตรวจสอบเลขที่หน้ายืนยันคำสั่งซื้อนะคะ`
          : `Sorry, I couldn't find order ${orderMatch[0].toUpperCase()}. Please check the number on your confirmation page 🙏`,
      ctx
    );
  }
  if ((/\b(order|track)\b/.test(lower) && /\b(my|where|status)\b/.test(lower)) || /ออเดอร์|คำสั่งซื้อ|ของถึง/.test(text)) {
    return finish(
      isThai
        ? "ได้เลยค่ะ ขอเลขออเดอร์หน่อยนะคะ (ขึ้นต้นด้วย FC อยู่ที่หน้ายืนยันคำสั่งซื้อ) 🙏"
        : "Of course! What's your order number? It starts with FC and is on your confirmation page 🙏",
      ctx
    );
  }

  // Delivery
  if (/\b(deliver|delivery|slot|shipping)\b/.test(lower) || /ส่ง|จัดส่ง/.test(text)) {
    const slots = getDeliverySlots().slice(0, 4).join("; ");
    return finish(
      isThai
        ? `รอบส่งถัดไป 🛵 ${slots} ค่าส่ง ${formatPrice(DELIVERY_FEE)} ส่งฟรีเมื่อซื้อครบ ${formatPrice(FREE_DELIVERY_OVER)} ค่ะ`
        : `Next delivery slots 🛵 ${slots}. Delivery is ${formatPrice(DELIVERY_FEE)}, free over ${formatPrice(FREE_DELIVERY_OVER)}.`,
      ctx
    );
  }

  // Greeting / help
  if (!text || /^(hi|hello|hey|help|sawasdee)\b/.test(lower) || /^สวัสดี/.test(text)) {
    return finish(
      isThai
        ? "สวัสดีค่ะ 🙏 น้องช่วยหาสินค้า เช็คราคา ใส่ตะกร้า ดูรอบส่ง หรือแนะนำวัตถุดิบทำอาหารไทยได้นะคะ ลองพิมพ์ \"ผัดไทย\" หรือ \"มีน้ำปลาไหม\" ค่ะ"
        : "สวัสดีค่ะ 🙏 I can find Thai ingredients, check prices, add items to your cart, show delivery times, or tell you what you need for a dish. Try \"what do I need for green curry?\" or \"add 2 coconut milk\".",
      ctx
    );
  }

  // Add to cart: "add 2 coconut milk"
  const addMatch = lower.match(/^(?:please\s+)?(?:add|buy|get me)\s+(\d+)?\s*(?:x\s*)?(.+)$/);
  if (addMatch) {
    const qty = Math.max(1, Math.min(20, Number(addMatch[1]) || 1));
    const [p] = THAI.test(addMatch[2]) ? searchThai(addMatch[2]) : searchProducts(addMatch[2], { limit: 1 });
    if (!p) return finish(`Sorry, I couldn't find "${addMatch[2]}" 🙏 Try another name, like "fish sauce" or "jasmine rice".`, ctx);
    runTool("add_to_cart", { product_id: p.id, quantity: qty }, ctx);
    return finish(
      p.stock >= qty
        ? `Added ${qty} x ${p.name} to your cart 🛒 (${formatPrice(p.price)} each). ขอบคุณค่ะ!`
        : p.stock === 0
          ? `Sorry, ${p.name} is out of stock right now 😢`
          : `Sorry, we only have ${p.stock} of ${p.name} right now.`,
      ctx
    );
  }

  // Thai dishes: "what do I need for pad thai?" / "ผัดไทย"
  const recipe = findRecipe(text);
  if (recipe) {
    const items = recipeProducts(recipe);
    items.forEach((p) => ctx.products.set(p.id, p));
    if (!items.length) return finish(`${recipe.name} (${recipe.thai}) sounds delicious! 😋 Search for each ingredient and I'll help you find them.`, ctx);
    const inStock = items.filter((p) => p.stock > 0);
    const out = items.filter((p) => p.stock === 0);
    const total = inStock.reduce((s, p) => s + p.price, 0);
    let reply = isThai
      ? `ทำ${recipe.thai}ใช้วัตถุดิบเหล่านี้ค่ะ 😋 ${inStock.map((p) => p.name).join(", ")} รวมประมาณ ${formatPrice(total)} กด Add เพื่อใส่ตะกร้าได้เลยค่ะ`
      : `For ${recipe.name} (${recipe.thai}) 😋 you'll need: ${inStock.map((p) => `${p.name} ${formatPrice(p.price)}`).join(", ")}. About ${formatPrice(total)} in total. Tap "Add" below to put them in your cart!`;
    if (out.length) reply += isThai ? ` (หมดชั่วคราว: ${out.map((p) => p.name).join(", ")})` : ` Currently out of stock: ${out.map((p) => p.name).join(", ")}.`;
    return finish(reply, ctx, 10);
  }

  // Product search (Thai or English)
  const results = isThai ? searchThai(text).slice(0, 6) : searchProducts(text, { limit: 6 });
  results.forEach((p) => ctx.products.set(p.id, p));
  if (!results.length) {
    return finish(
      isThai
        ? "ขอโทษค่ะ ไม่เจอสินค้านี้ ลองพิมพ์ชื่ออื่น เช่น \"น้ำปลา\" \"กะทิ\" หรือ \"ข้าวหอมมะลิ\" นะคะ 🙏"
        : "Sorry, I couldn't find that 🙏 Try a simpler word like \"curry paste\", \"rice noodles\" or \"coconut milk\".",
      ctx
    );
  }
  const inStock = results.filter((p) => p.stock > 0);
  const out = results.filter((p) => p.stock === 0);
  let reply = isThai
    ? `มีค่ะ 😊 ${inStock.map((p) => `${p.name} ${formatPrice(p.price)}`).join(", ") || "แต่ตอนนี้หมดชั่วคราวค่ะ"}`
    : `Here's what we have 😊 ${inStock.map((p) => `${p.name} ${formatPrice(p.price)}`).join(", ") || "nothing in stock right now"}.`;
  if (out.length) reply += isThai ? ` (หมดชั่วคราว: ${out.map((p) => p.name).join(", ")})` : ` Out of stock: ${out.map((p) => p.name).join(", ")}.`;
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

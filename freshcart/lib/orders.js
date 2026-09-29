// Server-side order storage. Uses a JSON file so you can see orders without a database.
// For production, replace these functions with calls to a real database (e.g. Supabase / Postgres).
import fs from "fs";
import path from "path";
import { getProduct } from "@/lib/catalog";
import { DELIVERY_FEE, FREE_DELIVERY_OVER, deliveryFor, getDeliverySlots } from "@/lib/delivery";

export { DELIVERY_FEE, FREE_DELIVERY_OVER, getDeliverySlots };

const FILE = path.join(process.cwd(), "data", "orders.json");

export const ORDER_STATUSES = ["Received", "Packing", "Out for delivery", "Delivered", "Cancelled"];

function readAll() {
  try {
    return JSON.parse(fs.readFileSync(FILE, "utf8"));
  } catch {
    return [];
  }
}

function writeAll(orders) {
  fs.mkdirSync(path.dirname(FILE), { recursive: true });
  fs.writeFileSync(FILE, JSON.stringify(orders, null, 2));
}

export function listOrders() {
  return readAll().sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

export function getOrder(id) {
  if (!id) return null;
  const clean = String(id).trim().toUpperCase().replace(/^#/, "");
  return readAll().find((o) => o.id === clean) || null;
}

export function calcTotals(subtotal) {
  const delivery = deliveryFor(subtotal);
  return {
    subtotal: round(subtotal),
    delivery: round(delivery),
    total: round(subtotal + delivery),
  };
}

function round(n) {
  return Math.round(n * 100) / 100;
}

/**
 * Create an order. Prices and stock always come from the server catalog,
 * never from the browser, so customers can't change prices.
 */
export function createOrder({ items, customer, slot }) {
  if (!Array.isArray(items) || items.length === 0) throw new Error("Your cart is empty.");
  if (!customer?.name || !customer?.email || !customer?.address) {
    throw new Error("Name, email and address are required.");
  }
  if (!slot) throw new Error("Please choose a delivery slot.");

  const lines = [];
  for (const { id, qty } of items) {
    const product = getProduct(id);
    const quantity = Math.floor(Number(qty));
    if (!product) throw new Error(`Unknown product: ${id}`);
    if (!(quantity > 0)) throw new Error(`Invalid quantity for ${product.name}`);
    if (product.stock < quantity) {
      throw new Error(`Only ${product.stock} left of ${product.name}.`);
    }
    lines.push({ id: product.id, name: product.name, price: product.price, qty: quantity });
  }

  // Reserve stock (in memory for this demo; a database would do this in a transaction)
  for (const line of lines) getProduct(line.id).stock -= line.qty;

  const subtotal = lines.reduce((s, l) => s + l.price * l.qty, 0);
  const order = {
    id: "FC" + Date.now().toString(36).toUpperCase().slice(-6),
    createdAt: new Date().toISOString(),
    status: "Received",
    customer: {
      name: String(customer.name).slice(0, 100),
      email: String(customer.email).slice(0, 200),
      address: String(customer.address).slice(0, 300),
      phone: String(customer.phone || "").slice(0, 40),
    },
    slot,
    items: lines,
    ...calcTotals(subtotal),
  };

  const orders = readAll();
  orders.push(order);
  writeAll(orders);
  return order;
}

export function updateOrderStatus(id, status) {
  if (!ORDER_STATUSES.includes(status)) throw new Error("Invalid status");
  const orders = readAll();
  const order = orders.find((o) => o.id === id);
  if (!order) throw new Error("Order not found");
  order.status = status;
  writeAll(orders);
  return order;
}

import { NextResponse } from "next/server";
import { createOrder, getOrder, listOrders, updateOrderStatus } from "@/lib/orders";

export const dynamic = "force-dynamic";

// GET /api/orders?id=FC123ABC  -> one order
// GET /api/orders?admin=KEY     -> all orders (admin)
export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");
  if (id) {
    const order = getOrder(id);
    return order
      ? NextResponse.json({ order })
      : NextResponse.json({ error: "Order not found" }, { status: 404 });
  }
  if (!isAdmin(searchParams.get("admin"))) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  return NextResponse.json({ orders: listOrders() });
}

// POST /api/orders  { items: [{id, qty}], customer: {...}, slot }
export async function POST(request) {
  try {
    const body = await request.json();
    const order = createOrder(body);
    return NextResponse.json({ order }, { status: 201 });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 400 });
  }
}

// PATCH /api/orders  { id, status, admin }
export async function PATCH(request) {
  try {
    const { id, status, admin } = await request.json();
    if (!isAdmin(admin)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    return NextResponse.json({ order: updateOrderStatus(id, status) });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 400 });
  }
}

function isAdmin(key) {
  // Simple shared password for the demo admin page. Replace with real auth before launch.
  return key && key === (process.env.ADMIN_PASSWORD || "admin123");
}

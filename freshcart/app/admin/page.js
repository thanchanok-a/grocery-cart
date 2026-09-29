"use client";
import { useState } from "react";
import { formatPrice } from "@/lib/catalog";

const STATUSES = ["Received", "Packing", "Out for delivery", "Delivered", "Cancelled"];

export default function AdminPage() {
  const [password, setPassword] = useState("");
  const [orders, setOrders] = useState(null);
  const [error, setError] = useState("");

  async function load(e) {
    e?.preventDefault();
    setError("");
    const res = await fetch(`/api/orders?admin=${encodeURIComponent(password)}`);
    const data = await res.json();
    if (!res.ok) return setError(data.error || "Failed to load");
    setOrders(data.orders);
  }

  async function changeStatus(id, status) {
    const res = await fetch("/api/orders", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, status, admin: password }),
    });
    const data = await res.json();
    if (!res.ok) return setError(data.error);
    setOrders((list) => list.map((o) => (o.id === id ? data.order : o)));
  }

  if (!orders) {
    return (
      <form className="panel narrow" onSubmit={load}>
        <h1>Admin</h1>
        <p className="muted small">Default password is <code>admin123</code>. Change ADMIN_PASSWORD in .env.local.</p>
        <label>Password<input type="password" value={password} onChange={(e) => setPassword(e.target.value)} /></label>
        {error && <div className="error">{error}</div>}
        <button className="btn">Log in</button>
      </form>
    );
  }

  const revenue = orders.filter((o) => o.status !== "Cancelled").reduce((s, o) => s + o.total, 0);

  return (
    <div>
      <div className="admin-head">
        <h1>Orders</h1>
        <button className="btn btn-small" onClick={load}>Refresh</button>
      </div>
      <div className="stats">
        <div className="stat"><div className="stat-num">{orders.length}</div><div className="muted small">Orders</div></div>
        <div className="stat"><div className="stat-num">{formatPrice(revenue)}</div><div className="muted small">Revenue</div></div>
        <div className="stat">
          <div className="stat-num">{orders.filter((o) => o.status === "Received" || o.status === "Packing").length}</div>
          <div className="muted small">To pack</div>
        </div>
      </div>
      {error && <div className="error">{error}</div>}
      {orders.length === 0 ? (
        <p className="muted">No orders yet. Place a test order from the shop.</p>
      ) : (
        <div className="table-wrap">
          <table className="table">
            <thead>
              <tr><th>Order</th><th>Customer</th><th>Slot</th><th>Items</th><th>Total</th><th>Status</th></tr>
            </thead>
            <tbody>
              {orders.map((o) => (
                <tr key={o.id}>
                  <td><a href={`/orders/${o.id}`}>{o.id}</a><div className="muted small">{new Date(o.createdAt).toLocaleString()}</div></td>
                  <td>{o.customer.name}<div className="muted small">{o.customer.email}</div></td>
                  <td className="small">{o.slot}</td>
                  <td className="small">{o.items.map((i) => `${i.qty}× ${i.name}`).join(", ")}</td>
                  <td>{formatPrice(o.total)}</td>
                  <td>
                    <select value={o.status} onChange={(e) => changeStatus(o.id, e.target.value)}>
                      {STATUSES.map((s) => <option key={s}>{s}</option>)}
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

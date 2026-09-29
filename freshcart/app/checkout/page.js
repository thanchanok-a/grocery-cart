"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCart } from "@/components/CartContext";
import { formatPrice } from "@/lib/catalog";
import { deliveryFor, getDeliverySlots } from "@/lib/delivery";

export default function CheckoutPage() {
  const router = useRouter();
  const { items, lines, subtotal, clear } = useCart();
  const [slots, setSlots] = useState([]);
  const [form, setForm] = useState({ name: "", email: "", phone: "", address: "", slot: "" });
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const delivery = deliveryFor(subtotal);

  // Compute slots in the browser so they match the customer's timezone
  useEffect(() => setSlots(getDeliverySlots()), []);

  function update(field) {
    return (e) => setForm((f) => ({ ...f, [field]: e.target.value }));
  }

  async function placeOrder(e) {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items,
          slot: form.slot,
          customer: { name: form.name, email: form.email, phone: form.phone, address: form.address },
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Could not place order");
      clear();
      router.push(`/orders/${data.order.id}`);
    } catch (err) {
      setError(err.message);
      setSubmitting(false);
    }
  }

  if (lines.length === 0 && !submitting) {
    return (
      <div className="empty">
        <h1>Nothing to check out</h1>
        <Link href="/" className="btn">Back to shop</Link>
      </div>
    );
  }

  return (
    <form className="two-col" onSubmit={placeOrder}>
      <section>
        <h1>Checkout</h1>

        <fieldset className="panel">
          <legend>Delivery details</legend>
          <label>Full name<input required value={form.name} onChange={update("name")} autoComplete="name" /></label>
          <label>Email<input required type="email" value={form.email} onChange={update("email")} autoComplete="email" /></label>
          <label>Phone<input value={form.phone} onChange={update("phone")} autoComplete="tel" /></label>
          <label>Address<textarea required rows={3} value={form.address} onChange={update("address")} autoComplete="street-address" /></label>
        </fieldset>

        <fieldset className="panel">
          <legend>Delivery time</legend>
          <div className="slots">
            {slots.map((s) => (
              <label key={s} className={`slot ${form.slot === s ? "slot-active" : ""}`}>
                <input type="radio" name="slot" value={s} checked={form.slot === s} onChange={update("slot")} required />
                {s}
              </label>
            ))}
          </div>
        </fieldset>

        <fieldset className="panel">
          <legend>Payment</legend>
          <p className="muted">
            Pay on delivery (cash or card). Online card payments with Stripe are the next step. See README.
          </p>
        </fieldset>
      </section>

      <aside className="summary">
        <h2>Order summary</h2>
        {lines.map(({ id, qty, product }) => (
          <div key={id} className="sum-row small">
            <span>{qty} × {product.name}</span>
            <span>{formatPrice(product.price * qty)}</span>
          </div>
        ))}
        <hr />
        <div className="sum-row"><span>Subtotal</span><span>{formatPrice(subtotal)}</span></div>
        <div className="sum-row"><span>Delivery</span><span>{delivery === 0 ? "Free" : formatPrice(delivery)}</span></div>
        <div className="sum-row sum-total"><span>Total</span><span>{formatPrice(subtotal + delivery)}</span></div>
        {error && <div className="error">{error}</div>}
        <button className="btn btn-block" disabled={submitting}>
          {submitting ? "Placing order…" : "Place order"}
        </button>
      </aside>
    </form>
  );
}

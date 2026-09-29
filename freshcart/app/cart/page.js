"use client";
import Link from "next/link";
import { useCart } from "@/components/CartContext";
import { formatPrice } from "@/lib/catalog";
import { deliveryFor, FREE_DELIVERY_OVER as FREE_OVER } from "@/lib/delivery";

export default function CartPage() {
  const { lines, subtotal, setQty, remove } = useCart();
  const delivery = deliveryFor(subtotal);

  if (lines.length === 0) {
    return (
      <div className="empty">
        <h1>Your cart is empty</h1>
        <p className="muted">Browse the shop or ask the assistant for ideas.</p>
        <Link href="/" className="btn">Start shopping</Link>
      </div>
    );
  }

  return (
    <div className="two-col">
      <section>
        <h1>Your cart</h1>
        <div className="cart-list">
          {lines.map(({ id, qty, product }) => (
            <div key={id} className="cart-line">
              <span className="line-emoji">{product.emoji}</span>
              <div className="line-info">
                <div className="card-name">{product.name}</div>
                <div className="muted small">{product.unit} · {formatPrice(product.price)} each</div>
              </div>
              <div className="qty">
                <button onClick={() => setQty(id, qty - 1)} aria-label="Decrease">−</button>
                <span>{qty}</span>
                <button onClick={() => setQty(id, qty + 1)} aria-label="Increase">+</button>
              </div>
              <div className="line-total">{formatPrice(product.price * qty)}</div>
              <button className="icon-btn" onClick={() => remove(id)} aria-label="Remove">✕</button>
            </div>
          ))}
        </div>
      </section>

      <aside className="summary">
        <h2>Summary</h2>
        <div className="sum-row"><span>Subtotal</span><span>{formatPrice(subtotal)}</span></div>
        <div className="sum-row"><span>Delivery</span><span>{delivery === 0 ? "Free" : formatPrice(delivery)}</span></div>
        {delivery > 0 && (
          <div className="muted small">Add {formatPrice(FREE_OVER - subtotal)} more for free delivery.</div>
        )}
        <div className="sum-row sum-total"><span>Total</span><span>{formatPrice(subtotal + delivery)}</span></div>
        <Link href="/checkout" className="btn btn-block">Checkout</Link>
      </aside>
    </div>
  );
}

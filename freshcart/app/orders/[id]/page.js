import Link from "next/link";
import { getOrder, ORDER_STATUSES } from "@/lib/orders";
import { formatPrice } from "@/lib/catalog";

export const dynamic = "force-dynamic";

export default async function OrderPage({ params }) {
  const { id } = await params;
  const order = getOrder(id);

  if (!order) {
    return (
      <div className="empty">
        <h1>Order not found</h1>
        <Link href="/" className="btn">Back to shop</Link>
      </div>
    );
  }

  const steps = ORDER_STATUSES.filter((s) => s !== "Cancelled");
  const current = steps.indexOf(order.status);

  return (
    <div className="order">
      <h1>Thanks, {order.customer.name.split(" ")[0]}! 🎉</h1>
      <p>
        Your order number is <strong className="order-id">{order.id}</strong>. You can ask the chat assistant
        about it any time.
      </p>

      {order.status === "Cancelled" ? (
        <div className="error">This order was cancelled.</div>
      ) : (
        <ol className="progress">
          {steps.map((s, i) => (
            <li key={s} className={i <= current ? "done" : ""}>{s}</li>
          ))}
        </ol>
      )}

      <div className="panel">
        <div className="sum-row"><span>Delivery slot</span><span>{order.slot}</span></div>
        <div className="sum-row"><span>Address</span><span>{order.customer.address}</span></div>
        <hr />
        {order.items.map((i) => (
          <div key={i.id} className="sum-row small">
            <span>{i.qty} × {i.name}</span>
            <span>{formatPrice(i.price * i.qty)}</span>
          </div>
        ))}
        <hr />
        <div className="sum-row"><span>Delivery</span><span>{order.delivery === 0 ? "Free" : formatPrice(order.delivery)}</span></div>
        <div className="sum-row sum-total"><span>Total (pay on delivery)</span><span>{formatPrice(order.total)}</span></div>
      </div>
      <Link href="/" className="btn">Continue shopping</Link>
    </div>
  );
}

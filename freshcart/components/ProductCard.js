"use client";
import { useState } from "react";
import { useCart } from "@/components/CartContext";
import { formatPrice } from "@/lib/catalog";

export default function ProductCard({ product, compact = false }) {
  const { add } = useCart();
  const [added, setAdded] = useState(false);
  const outOfStock = product.stock <= 0;

  function handleAdd() {
    add(product.id, 1);
    setAdded(true);
    setTimeout(() => setAdded(false), 1200);
  }

  return (
    <div className={`card ${compact ? "card-compact" : ""}`}>
      <div className="card-emoji" aria-hidden="true">{product.emoji}</div>
      <div className="card-body">
        <div className="card-name">{product.name}</div>
        <div className="card-unit">{product.unit}</div>
        <div className="card-row">
          <span className="price">{formatPrice(product.price)}</span>
          <button className="btn btn-small" onClick={handleAdd} disabled={outOfStock}>
            {outOfStock ? "Out of stock" : added ? "Added ✓" : "Add"}
          </button>
        </div>
        {!outOfStock && product.stock <= 5 && <div className="low-stock">Only {product.stock} left</div>}
      </div>
    </div>
  );
}

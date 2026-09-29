"use client";
import Link from "next/link";
import { useCart } from "@/components/CartContext";
import { formatPrice } from "@/lib/catalog";

export default function Header() {
  const { count, subtotal } = useCart();
  return (
    <header className="header">
      <div className="container header-inner">
        <Link href="/" className="logo">
          🛒 <span>FreshCart</span>
        </Link>
        <nav className="nav">
          <Link href="/">Shop</Link>
          <Link href="/admin">Admin</Link>
          <Link href="/cart" className="cart-link">
            Cart <span className="badge">{count}</span>
            {count > 0 && <span className="cart-total">{formatPrice(subtotal)}</span>}
          </Link>
        </nav>
      </div>
    </header>
  );
}

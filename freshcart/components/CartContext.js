"use client";
import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { getProduct } from "@/lib/catalog";

const CartContext = createContext(null);
const KEY = "freshcart-cart";

export function CartProvider({ children }) {
  const [items, setItems] = useState([]); // [{ id, qty }]
  const [loaded, setLoaded] = useState(false);

  // Load the saved cart once in the browser
  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem(KEY) || "[]");
      if (Array.isArray(saved)) setItems(saved.filter((i) => getProduct(i.id)));
    } catch {}
    setLoaded(true);
  }, []);

  // Save whenever it changes
  useEffect(() => {
    if (!loaded) return;
    try {
      localStorage.setItem(KEY, JSON.stringify(items));
    } catch {}
  }, [items, loaded]);

  const value = useMemo(() => {
    const lines = items
      .map((i) => ({ ...i, product: getProduct(i.id) }))
      .filter((l) => l.product);
    const subtotal = lines.reduce((s, l) => s + l.product.price * l.qty, 0);
    const count = lines.reduce((s, l) => s + l.qty, 0);

    return {
      items,
      lines,
      subtotal,
      count,
      add(id, qty = 1) {
        setItems((prev) => {
          const found = prev.find((i) => i.id === id);
          if (found) return prev.map((i) => (i.id === id ? { ...i, qty: Math.min(99, i.qty + qty) } : i));
          return [...prev, { id, qty }];
        });
      },
      setQty(id, qty) {
        setItems((prev) =>
          qty <= 0 ? prev.filter((i) => i.id !== id) : prev.map((i) => (i.id === id ? { ...i, qty: Math.min(99, qty) } : i))
        );
      },
      remove(id) {
        setItems((prev) => prev.filter((i) => i.id !== id));
      },
      clear() {
        setItems([]);
      },
    };
  }, [items]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used inside <CartProvider>");
  return ctx;
}

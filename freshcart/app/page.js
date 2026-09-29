"use client";
import { useEffect, useState } from "react";
import ProductCard from "@/components/ProductCard";
import { CATEGORIES, getAllProducts } from "@/lib/catalog";

export default function ShopPage() {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("");
  const [products, setProducts] = useState(getAllProducts());
  const [loading, setLoading] = useState(false);

  // Ask the server for live results (stock changes as orders come in)
  useEffect(() => {
    const t = setTimeout(async () => {
      setLoading(true);
      try {
        const params = new URLSearchParams();
        if (query) params.set("q", query);
        if (category) params.set("category", category);
        const res = await fetch(`/api/products?${params}`);
        const data = await res.json();
        setProducts(data.products || []);
      } finally {
        setLoading(false);
      }
    }, 250);
    return () => clearTimeout(t);
  }, [query, category]);

  return (
    <>
      <section className="hero">
        <h1>Fresh groceries, delivered tomorrow</h1>
        <p>Free delivery on orders over $50. Need ideas? Ask our assistant in the corner 💬</p>
        <input
          className="search"
          type="search"
          placeholder="Search milk, pasta, apples…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
      </section>

      <div className="chips">
        <button className={`chip ${category === "" ? "chip-active" : ""}`} onClick={() => setCategory("")}>
          All
        </button>
        {CATEGORIES.map((c) => (
          <button key={c} className={`chip ${category === c ? "chip-active" : ""}`} onClick={() => setCategory(c)}>
            {c}
          </button>
        ))}
      </div>

      {products.length === 0 && !loading ? (
        <p className="muted">No products match “{query}”. Try another word or ask the assistant.</p>
      ) : (
        <div className="grid">
          {products.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      )}
    </>
  );
}

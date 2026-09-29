import { NextResponse } from "next/server";
import { searchProducts, getAllProducts } from "@/lib/catalog";

export const dynamic = "force-dynamic";

// GET /api/products?q=milk&category=Pantry
export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const q = searchParams.get("q") || "";
  const category = searchParams.get("category") || undefined;
  const list = q
    ? searchProducts(q, { category, limit: 100 })
    : getAllProducts().filter((p) => !category || p.category === category);
  return NextResponse.json({ products: list });
}

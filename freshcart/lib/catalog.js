import { products, CATEGORIES } from "@/data/products";

export { CATEGORIES };

export function getAllProducts() {
  return products;
}

export function getProduct(id) {
  return products.find((p) => p.id === id) || null;
}

// Turn "Apples, eggs & oat-milk!" into ["apple", "egg", "oat", "milk"]
function tokenize(text) {
  return String(text || "")
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, " ")
    .split(/[\s-]+/)
    .filter((w) => w.length > 1)
    .map((w) => (w.length > 3 && w.endsWith("s") && !w.endsWith("ss") ? w.slice(0, -1) : w));
}

const STOP_WORDS = new Set([
  "do", "you", "have", "any", "the", "a", "an", "some", "for", "and", "or", "of", "to", "me",
  "i", "need", "want", "is", "are", "there", "what", "can", "get", "in", "on", "with", "my",
  "please", "show", "find", "buy", "looking", "stock", "your", "it", "we", "how", "much",
]);

/**
 * Simple keyword search with scoring. Good enough for a small store;
 * swap for Postgres full-text search or embeddings when the catalog grows.
 */
export function searchProducts(query, { category, limit = 12 } = {}) {
  const words = tokenize(query).filter((w) => !STOP_WORDS.has(w));
  let list = category ? products.filter((p) => p.category === category) : products;

  if (words.length === 0) return list.slice(0, limit);

  const scored = list
    .map((p) => {
      const nameWords = tokenize(p.name);
      const tagWords = p.tags.flatMap(tokenize);
      const catWords = tokenize(p.category);
      let score = 0;
      for (const w of words) {
        if (nameWords.includes(w)) score += 3;
        else if (nameWords.some((n) => n.startsWith(w) || w.startsWith(n))) score += 2;
        if (tagWords.includes(w)) score += 2;
        if (catWords.includes(w)) score += 1;
      }
      return { p, score };
    })
    .filter((x) => x.score > 0)
    .sort((a, b) => b.score - a.score);

  return scored.slice(0, limit).map((x) => x.p);
}

export function formatPrice(n) {
  return `$${Number(n).toFixed(2)}`;
}

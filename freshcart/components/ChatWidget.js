"use client";
import { useEffect, useRef, useState } from "react";
import { useCart } from "@/components/CartContext";
import ProductCard from "@/components/ProductCard";

const GREETING = {
  role: "assistant",
  content: "Hi! I'm the FreshCart assistant 👋 Ask me about products, prices, delivery, or your order.",
};

const SUGGESTIONS = ["Do you have oat milk?", "Ingredients for spaghetti bolognese", "Add 2 bananas", "When can you deliver?"];

export default function ChatWidget() {
  const { items, add } = useCart();
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([GREETING]); // {role, content, products?}
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [mode, setMode] = useState(null);
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading, open]);

  async function send(text) {
    const content = text.trim();
    if (!content || loading) return;
    const next = [...messages, { role: "user", content }];
    setMessages(next);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: next.map(({ role, content }) => ({ role, content })),
          cart: items,
        }),
      });
      const data = await res.json();
      (data.actions || []).forEach((a) => a.type === "add_to_cart" && add(a.id, a.qty));
      if (data.mode) setMode(data.mode);
      setMessages((m) => [...m, { role: "assistant", content: data.reply, products: data.products || [] }]);
    } catch {
      setMessages((m) => [...m, { role: "assistant", content: "Sorry, I couldn't connect. Please try again." }]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <button className="chat-fab" onClick={() => setOpen((o) => !o)} aria-label="Open chat">
        {open ? "✕" : "💬"}
      </button>

      {open && (
        <div className="chat-panel" role="dialog" aria-label="Shopping assistant">
          <div className="chat-head">
            <div>
              <strong>FreshCart Assistant</strong>
              {mode === "offline" && <div className="chat-mode">Basic mode · add an API key for full AI</div>}
            </div>
            <button className="icon-btn" onClick={() => setOpen(false)} aria-label="Close chat">✕</button>
          </div>

          <div className="chat-body">
            {messages.map((m, i) => (
              <div key={i} className={`msg msg-${m.role}`}>
                <div className="bubble">{m.content}</div>
                {m.products?.length > 0 && (
                  <div className="chat-products">
                    {m.products.map((p) => (
                      <ProductCard key={p.id} product={p} compact />
                    ))}
                  </div>
                )}
              </div>
            ))}
            {loading && (
              <div className="msg msg-assistant">
                <div className="bubble typing">
                  <span />
                  <span />
                  <span />
                </div>
              </div>
            )}
            {messages.length === 1 && (
              <div className="suggestions">
                {SUGGESTIONS.map((s) => (
                  <button key={s} className="chip" onClick={() => send(s)}>
                    {s}
                  </button>
                ))}
              </div>
            )}
            <div ref={bottomRef} />
          </div>

          <form
            className="chat-input"
            onSubmit={(e) => {
              e.preventDefault();
              send(input);
            }}
          >
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask about products, delivery…"
              maxLength={500}
            />
            <button className="btn" disabled={loading || !input.trim()}>
              Send
            </button>
          </form>
        </div>
      )}
    </>
  );
}

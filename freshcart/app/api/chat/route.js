import { NextResponse } from "next/server";
import { chat } from "@/lib/chatbot";

export const dynamic = "force-dynamic";

// POST /api/chat  { messages: [{role, content}], cart: [{id, qty}] }
export async function POST(request) {
  try {
    const { messages, cart } = await request.json();
    const result = await chat({ messages, cart });
    return NextResponse.json(result);
  } catch (err) {
    console.error(err);
    return NextResponse.json({ reply: "Sorry, something went wrong. Please try again." }, { status: 500 });
  }
}

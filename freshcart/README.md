# FreshCart: online grocery store with an AI chatbot

A starter online grocery shop built with **Next.js**. It includes:

- **Shop:** product catalog with search and categories, stock levels, and "only X left" warnings
- **Cart:** saved in the browser, with quantity controls and a free-delivery threshold
- **Checkout:** delivery details, delivery time slots, and order confirmation with a progress tracker
- **Admin page:** see all orders and revenue, and change order status
- **AI chatbot:** answers questions using your *real* product data, adds items to the cart, suggests ingredients for recipes, lists delivery slots, and tracks orders

---

## 1. Run it on your computer

You need **Node.js 20 or newer** (download from https://nodejs.org).

```bash
cd freshcart
npm install
npm run dev
```

Open **http://localhost:3000**. That's it: the shop and a basic chatbot work straight away.

### Turn on the full AI chatbot

Without an API key the chatbot runs in **basic mode**, using simple keyword rules. To make it a real AI assistant:

1. Get an API key at https://console.anthropic.com
2. Copy `.env.example` to a new file called `.env.local`
3. Paste your key: `ANTHROPIC_API_KEY=sk-ant-...`
4. Restart `npm run dev`

Now it understands requests like *"I'm making tacos for 4, what do I need?"* or *"swap the whole milk for something dairy-free"*.

### Admin page

Go to **http://localhost:3000/admin**. The default password is `admin123`. Change it by setting `ADMIN_PASSWORD` in `.env.local`.

---

## 2. How the project is organized

```
data/products.js          ← YOUR PRODUCTS: edit names, prices, stock, emoji, tags here
lib/catalog.js            ← product search
lib/orders.js             ← creating and storing orders (saved to data/orders.json)
lib/delivery.js           ← delivery fee, free-delivery amount, time slots
lib/chatbot.js            ← the AI assistant (tools + instructions + offline fallback)

app/page.js               ← shop home page
app/cart/page.js          ← cart
app/checkout/page.js      ← checkout form
app/orders/[id]/page.js   ← order confirmation + tracking
app/admin/page.js         ← admin dashboard
app/api/...               ← backend endpoints (products, orders, chat)

components/ChatWidget.js  ← the chat bubble in the corner
components/CartContext.js ← cart state (saved in the browser)
app/globals.css           ← all the styling (colors are at the top)
```

## 3. How the chatbot works

The AI never guesses about your store. It uses **tools** that read your real data:

| Tool | What it does |
|---|---|
| `search_products` | Searches your catalog for names, prices, and stock |
| `add_to_cart` | Adds an item to the customer's cart (it checks stock first) |
| `get_order_status` | Looks up an order by its number, e.g. `FC1A2B3C` |
| `get_delivery_slots` | Lists upcoming delivery times and fees |

The flow is: customer message → Claude decides which tools to call → your server runs them against real data → Claude writes the answer. The product cards and "added to cart" actions show up directly in the chat.

To change the assistant's personality or rules, edit `systemPrompt()` in `lib/chatbot.js`.

---

## 4. Make it your own

- **Store name and colors:** search for "FreshCart" and edit the `:root` colors in `app/globals.css`
- **Products:** edit `data/products.js`. Good `tags` make both search and the chatbot smarter.
- **Delivery rules:** edit `lib/delivery.js`
- **Product photos:** add an `image` field to each product and use `<img>` in `components/ProductCard.js` instead of the emoji

---

## 5. Before launching for real customers

This is a working starter, but a real business needs these upgrades:

1. **A real database.** Orders are saved to `data/orders.json`, and stock changes live only in memory. Hosts like Vercel don't keep files, so move products and orders to **Supabase** (free Postgres). Only `lib/catalog.js` and `lib/orders.js` need to change.
2. **Online payments.** Checkout currently uses "pay on delivery". Add **Stripe Checkout** by creating a Stripe session in `app/api/orders/route.js` and redirecting to it.
3. **Real login.** Replace the admin password with proper accounts, for example Supabase Auth or Clerk. You can also let customers see their order history.
4. **Email confirmations.** Send order emails with Resend or SendGrid.
5. **Deploy.** Push to GitHub, import the project at https://vercel.com, and add your environment variables there.
6. **Legal basics.** Add privacy and terms pages, and check your local rules on food sales and delivery.

## Tech used

Next.js 15 (App Router) · React 19 · Anthropic Claude API (`@anthropic-ai/sdk`) · plain CSS with no UI framework, so it's easy to read and change.

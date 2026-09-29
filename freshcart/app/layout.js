import "./globals.css";
import { CartProvider } from "@/components/CartContext";
import Header from "@/components/Header";
import ChatWidget from "@/components/ChatWidget";

export const metadata = {
  title: "FreshCart – Online Grocery",
  description: "Fresh groceries delivered, with an AI shopping assistant.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <CartProvider>
          <Header />
          <main className="container main">{children}</main>
          <footer className="footer container">© {new Date().getFullYear()} FreshCart · Demo store</footer>
          <ChatWidget />
        </CartProvider>
      </body>
    </html>
  );
}

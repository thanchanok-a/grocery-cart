import "./globals.css";
import { CartProvider } from "@/components/CartContext";
import Header from "@/components/Header";
import ChatWidget from "@/components/ChatWidget";

export const metadata = {
  title: "DMV Thai Grocery",
  description: "Authentic Thai ingredients delivered to your door: curry pastes, fresh herbs, jasmine rice and Thai snacks.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <CartProvider>
          <Header />
          <main className="container main">{children}</main>
          <footer className="footer container">© {new Date().getFullYear()} Thai Grocery · DMV · Authentic Thai ingredients</footer>
          <ChatWidget />
        </CartProvider>
      </body>
    </html>
  );
}

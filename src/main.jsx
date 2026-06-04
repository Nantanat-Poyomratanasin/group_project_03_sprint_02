import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { CartProvider } from "./context/CartContext.jsx";
import { AuthProvider } from "./context/AuthContext.jsx";
import { BookProvider } from "./context/BookContext.jsx";
import { FavoriteProvider } from "./context/FavoriteContext.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <AuthProvider>
      <BookProvider>
        <FavoriteProvider>
          <CartProvider>
            <App />
          </CartProvider>
        </FavoriteProvider>
      </BookProvider>
    </AuthProvider>
  </StrictMode>,
);


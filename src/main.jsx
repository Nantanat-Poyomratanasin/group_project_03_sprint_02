import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { CartProvider } from "./context/CartContext.jsx";
import { AuthProvider } from "./context/AuthContext.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    {/* AuthProvider ครอบไว้ชั้นนอกเพื่อให้ทุกหน้ามองเห็นข้อมูล login/profile ได้ */}
    <AuthProvider>
      {/* CartProvider ยังใช้แยกหน้าที่เรื่องตะกร้าสินค้าเหมือนเดิม */}
      <CartProvider>
        <App />
      </CartProvider>
    </AuthProvider>
  </StrictMode>,
);

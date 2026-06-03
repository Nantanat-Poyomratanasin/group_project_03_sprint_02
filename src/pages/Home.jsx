import { useState, useRef } from "react";

import NavBar from "../components/HomeComponents/NavBar";
import Hero from "../components/HomeComponents/Hero";
import Banner from "../components/HomeComponents/Banner";
import CategorySample from "../components/HomeComponents/CategorySample";
import Footer from "../components/HomeComponents/Footer";
import Cart from "../components/HomeComponents/Cart";
import PaymentPage from "./PaymentPage";
import { useAuth } from "../context/AuthContext";
import Admin from "@/components/AdminComponents/Admin";

export default function Home() {
  const { isAdmin } = useAuth();
  const [currentPage, setCurrentPage] = useState("home"); // "home" | "payment" -- เดี๋ยวอาจจะต้องเอาออกต้องใช้ Router (?)

  // อาจจะต้องเอาออกตอนใช้ router (?) แต่ต้องไปแก้ใน `PaymentPage` ด้วย
  if (currentPage === "payment") {
    return <PaymentPage onBackToHome={() => setCurrentPage("home")} />;
  }

  return (
    <>
      {isAdmin ? (
        <Admin />
      ) : (
        <>
          <NavBar />
          <Hero />
          <Banner />
          <CategorySample />
          <Footer />
          <Cart onCheckout={() => setCurrentPage("payment")} />
        </>
      )}
    </>
  );
}

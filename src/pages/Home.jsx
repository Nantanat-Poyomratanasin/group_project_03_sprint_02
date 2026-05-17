import { useState, useRef } from "react";

import NavBar from "../components/HomeComponents/NavBar";
import Hero from "../components/HomeComponents/Hero";
import Banner from "../components/HomeComponents/Banner";
import CategorySample from "../components/HomeComponents/CategorySample";
import Footer from "../components/HomeComponents/Footer";
import Cart from "../components/HomeComponents/Cart";
import PopupModal from "../components/PopupModal";
import PaymentPage from "./PaymentPage";

import { bookData } from "../mock-data/bookData";
import { reviewData } from "../mock-data/reviewData";

export default function Home() {
  const [selectedCategory, setSelectredCategory] = useState("All");
  const [selectedPayment, setSelectedPayment] = useState("QR");
  const [cartItems, setCartItems] = useState([]);
  const [likeItems, setLikeItems] = useState([]);
  const [purchasedItems, setPurchasedItems] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isShelfOpen, setIsShelfOpen] = useState(false);
  const [isLogin, setIsLogin] = useState(false);
  const [isRegister, setIsRegister] = useState(false);
  const [isPaid, setIsPaid] = useState(false);
  const [isConfirmedOrder, setIsconfirmedOrder] = useState(false);
  const [isConfirmedPayment, setIsConfirmedPayment] = useState(false);
  const [isUseCoupon, setUseCoupon] = useState(false);
  const [isShowTextbox, setIsShowTextbox] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const slideHeroRef = useRef(null);
  const slideCategoryRef = useRef(null);
  const slideLikeRef = useRef(null);
  const slidePurchased = useRef(null);
  const scrollRef = useRef(null);
  // for PopupModal (น่าจะต้องเปลี่ยนหรือเพิ่ม ถ้าต้องเรียกหลาย Popup)
  const [open, setOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState("home"); // "home" | "payment" -- เดี๋ยวอาจจะต้องเอาออกต้องใช้ Router (?)

  const CATEGORIES = ["All", ...new Set(bookData.map((book) => book.category))];

  const activeCategory = bookData.filter(
    (book) => selectedCategory === "All" || book.category === selectedCategory,
  );

  const highlightBook = bookData.filter(
    (book) => book.is_highlighted === "true",
  );

  const handleCategory = (newCategory) => {
    setSelectredCategory(newCategory);
  };

  // อาจจะต้องเอาออกตอนใช้ router (?) แต่ต้องไปแก้ใน `PaementPage` ด้วย
  if (currentPage === "payment") {
    return <PaymentPage onBackToHome={() => setCurrentPage("home")} />;
  }

  return (
    <>
      <NavBar />
      <Hero />
      <Banner />
      <CategorySample />
      <Footer />
    </>
  );
}

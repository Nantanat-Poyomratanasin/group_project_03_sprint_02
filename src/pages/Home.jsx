import { useEffect, useState } from "react";

import NavBar from "../components/HomeComponents/NavBar";
import Hero from "../components/HomeComponents/Hero";
import Banner from "../components/HomeComponents/Banner";
import CategorySample from "../components/HomeComponents/CategorySample";
import Footer from "../components/HomeComponents/Footer";
import Cart from "../components/HomeComponents/Cart";
import { useAuth } from "../context/AuthContext";
import Admin from "@/components/AdminComponents/Admin";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ?? "http://localhost:3000/api";

function toNumber(value) {
  if (value == null) return 0;
  if (typeof value === "number") return value;
  if (typeof value === "object" && "$numberDecimal" in value) {
    return Number(value.$numberDecimal);
  }
  return Number(value) || 0;
}

function normalizeProduct(product) {
  const discountPercentage =
    product.discount_percentage ?? product.discountPercent ?? 0;

  return {
    id: product._id ?? product.id,
    name: product.book_name ?? product.name ?? product.title,
    category: product.category,
    author: product.author,
    price: toNumber(product.price),
    is_highlighted: Boolean(product.is_highlighted),
    isDiscount: Boolean(product.isDiscount),
    discount_percentage: Number(discountPercentage) || 0,
    img: product.img_link ?? product.img,
    rating: Number(product.rating) || 0,
    publisher: product.publisher,
    language: product.language,
    pages: product.page ?? product.pages,
  };
}

async function getProducts() {
  const response = await fetch(`${API_BASE_URL}/products`);
  const payload = await response.json().catch(() => ({}));

  if (!response.ok || payload.success === false) {
    throw new Error(payload.message || "Cannot load products");
  }

  const products = Array.isArray(payload.data) ? payload.data : [];
  return products.map(normalizeProduct);
}

export default function Home() {
  const { isAdmin } = useAuth();
  const [books, setBooks] = useState([]);
  const [isLoadingBooks, setIsLoadingBooks] = useState(true);
  const [bookError, setBookError] = useState("");

  useEffect(() => {
    async function loadBooks() {
      try {
        setIsLoadingBooks(true);
        setBookError("");
        const products = await getProducts();
        setBooks(products);
      } catch (error) {
        setBookError(error.message);
      } finally {
        setIsLoadingBooks(false);
      }
    }

    loadBooks();
  }, []);

  return (
    <>
      {isAdmin ? (
        <Admin />
      ) : (
        <>
          <NavBar />
          <Hero books={books} isLoading={isLoadingBooks} error={bookError} />
          <Banner />
          <CategorySample
            books={books}
            isLoading={isLoadingBooks}
            error={bookError}
          />
          <Footer />
          <Cart />
        </>
      )}
    </>
  );
}

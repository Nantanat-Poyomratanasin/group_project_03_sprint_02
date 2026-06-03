import { createContext, useContext, useEffect, useState } from "react";

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

async function fetchProducts() {
  const response = await fetch(`${API_BASE_URL}/products`);
  const payload = await response.json().catch(() => ({}));

  if (!response.ok || payload.success === false) {
    throw new Error(payload.message || "Cannot load products");
  }

  const products = Array.isArray(payload.data) ? payload.data : [];
  return products.map(normalizeProduct);
}

const BookContext = createContext(null);

export function BookProvider({ children }) {
  const [books, setBooks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  async function loadBooks() {
    try {
      setIsLoading(true);
      setError("");
      const products = await fetchProducts();
      setBooks(products);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    loadBooks();
  }, []);

  return (
    <BookContext.Provider value={{ books, isLoading, error, refetch: loadBooks }}>
      {children}
    </BookContext.Provider>
  );
}

export function useBooks() {
  const context = useContext(BookContext);
  if (!context) throw new Error("useBooks must be used within a BookProvider");
  return context;
}

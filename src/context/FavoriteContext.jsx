import { createContext, useContext, useState, useEffect, useCallback } from "react";
import { apiFetch } from "../lib/api";
import { useAuth } from "./AuthContext";

const FavoriteContext = createContext(null);

export function FavoriteProvider({ children }) {
  const [favoriteItems, setFavoriteItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { isLoggedIn } = useAuth();

  // ดึงรายการโปรดจาก Backend API
  const fetchFavorites = useCallback(async () => {
    if (!isLoggedIn) {
      setFavoriteItems([]);
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const data = await apiFetch("/favorites");
      setFavoriteItems(data.data?.favorite_items || []);
    } catch (err) {
      if (err.message === "No favorites found") {
        setFavoriteItems([]);
      } else {
        console.error("Failed to fetch favorites:", err.message);
        setError(err.message);
        setFavoriteItems([]);
      }
    } finally {
      setLoading(false);
    }
  }, [isLoggedIn]);

  // โหลดรายการโปรดครั้งแรกเมื่อ User ล็อกอิน
  useEffect(() => {
    fetchFavorites();
  }, [fetchFavorites]);

  // ฟังก์ชัน Toggle Favorite สำหรับใช้งานทุกที่ในแอป
  const toggleFavorite = useCallback(async (bookId) => {
    if (!isLoggedIn) return false;
    try {
      await apiFetch(`/favorites/${bookId}`, { method: "POST" });
      // ทำการดึงข้อมูลล่าสุดหลังจากเปลี่ยนสถานะ
      await fetchFavorites();
      return true;
    } catch (err) {
      console.error("Toggle favorite failed:", err);
      return false;
    }
  }, [isLoggedIn, fetchFavorites]);

  // ฟังก์ชันเช็คว่าหนังสือนี้ถูก Like หรือยัง
  const isBookLiked = useCallback((bookId) => {
    return favoriteItems.some((item) => item.book_id === bookId);
  }, [favoriteItems]);

  const value = {
    favoriteItems,
    loading,
    error,
    toggleFavorite,
    isBookLiked,
    refetchFavorites: fetchFavorites,
  };

  return <FavoriteContext.Provider value={value}>{children}</FavoriteContext.Provider>;
}

export function useFavorites() {
  const context = useContext(FavoriteContext);
  if (!context) {
    throw new Error("useFavorites must be used within a FavoriteProvider");
  }
  return context;
}

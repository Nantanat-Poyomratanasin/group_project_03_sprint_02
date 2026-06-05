import {
  ShoppingCart,
  CircleUser,
  Heart,
  Search,
  ScrollText,
  ChevronDown,
  Trash2,
  X,
} from "lucide-react";
import { useState, useEffect } from "react";
import { useCart } from "../../context/CartContext";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useBooks } from "../../context/BookContext";
import { useFavorites } from "../../context/FavoriteContext";
import LoginFirstPopup from "./LoginFirstPopup";

export default function NavBar() {
  const { setIsCartOpen, totalItems } = useCart();
  const { books } = useBooks();
  const [searchTerm, setSearchTerm] = useState("");
  const { user, isAuthenticated, isLoading, logout } = useAuth();

  const displayTotalItems = isAuthenticated ? totalItems : 0;
  

  // Favorites state & context hooks
  const [activePopup, setActivePopup] = useState(null);
  const {
    favoriteItems,
    toggleFavorite,
    loading: favoriteLoading,
    error: favoriteError,
    refetchFavorites,
  } = useFavorites();

  //Order state
  const [orders, setOrders] = useState([]);
  const [loadingOrders, setLoadingOrders] = useState(false);

  // Find book details from BookContext
  const likedBooks = favoriteItems
    .map((fav) => {
      const bookDetail = books.find((b) => b.id === fav.book_id);
      return bookDetail ? bookDetail : null;
    })
    .filter(Boolean);

  const filteredBooks = books.filter((book) => {
    if (!searchTerm) return false;
    try {
      const regex = new RegExp(searchTerm, "i");
      return regex.test(book.name);
    } catch {
      return false;
    }
  });

  const navigate = useNavigate();
  const location = useLocation();

  const API_BASE_URL =
    import.meta.env.VITE_API_BASE_URL || "http://localhost:3000/api";

  const handleHeartClick = () => {
    if (location.pathname === "/login") return;

    setIsCartOpen(false);

    if (!isAuthenticated) {
      setActivePopup("likes");
      return;
    }

    setActivePopup((prev) => (prev === "likes" ? null : "likes"));
  };

  //Cart popup handler
  const handleCartClick = () => {
    if (location.pathname === "/login") return;

    setActivePopup(null);

    if (!isAuthenticated) {
      setActivePopup("cart");
      return;
    }

    setIsCartOpen(true);
  };

  //Order popup handler
  const handleOrderClick = async () => {
    if (location.pathname === "/login") return;

    setIsCartOpen(false);

    if (!isAuthenticated) {
      setActivePopup("orders");
      return;
    }

    setLoadingOrders(true);

    try {
      const response = await fetch(`${API_BASE_URL}/orders/me`, {
        credentials: "include",
      });

      const result = await response.json();

      if (result.success) {
        setOrders(result.data);
      }

      setActivePopup("orders");
    } catch (error) {
      console.error(error);
    } finally {
      setLoadingOrders(false);
    }
  };

  //Profile popup handler
  const handleProfileClick = () => {
    if (location.pathname === "/login") return;

    setIsCartOpen(false);

    if (!isAuthenticated) {
      setActivePopup("profile");
      return;
    }
    setActivePopup((prev) => (prev === "profile" ? null : "profile"));
  };

  const handleLogout = async () => {
    await logout();
    setActivePopup(null);
    navigate("/");
  };

  // Close popup when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        !event.target.closest(".navbar-popup-trigger") &&
        !event.target.closest(".navbar-popup-content")
      ) {
        setActivePopup(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <nav className="bg-[#EEE1DB] border-b border-[#A66858]">
      <div className="max-w-7xl mx-auto px-2 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-11 md:h-16">
          {/* 1. Left Section (Logo) - Takes 1 part space, aligns left */}
          <div className="flex-1 flex justify-start">
            <Link to="/">
              <div className="shrink-0">
                <h1 className="text-lg md:text-2xl font-bold text-gray-900">
                  Read<span className="text-[#A66858]">ly</span>
                </h1>
              </div>
            </Link>
          </div>

          {/* 2. Center Section (Search Bar) - Takes 2 parts space, perfectly centered */}
          <div className="flex-[2] flex justify-center px-4 md:px-8 min-w-0">
            {/* Relative wrapper ensures dropdown width matches input exactly */}
            <div className="w-full max-w-xl relative">
              <div className="flex items-center bg-white rounded-lg border border-gray-300 shadow-sm overflow-hidden">
                <input
                  type="text"
                  placeholder="Search your favorite books..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="flex-1 px-3 py-2 text-sm outline-none bg-transparent"
                />
                <button className="px-3 py-2 text-gray-400">
                  <Search size={18} />
                </button>
              </div>

              {searchTerm && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-white border rounded-xl shadow-2xl z-[60] max-h-80 overflow-y-auto">
                  {filteredBooks.length > 0 ? (
                    <ul className="divide-y divide-gray-100">
                      {filteredBooks.map((book) => (
                        <li key={book.id}>
                          <Link
                            to={`/bookDetail/${book.id}`}
                            className="flex items-center gap-4 p-3 hover:bg-[#faf6f4] transition-colors"
                            onClick={() => setSearchTerm("")}
                          >
                            <img
                              src={book.img}
                              className="w-8 h-12 object-cover rounded shadow-sm"
                              alt=""
                            />
                            <div className="text-left font-sans">
                              <div className="text-sm font-bold text-gray-900">
                                {book.name}
                              </div>
                              <div className="text-xs text-gray-500">
                                {book.author}
                              </div>
                            </div>
                          </Link>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <div className="p-4 text-center text-sm text-gray-500">
                      No results found.
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* 3. Right Section (Icons) - Takes 1 part space, aligns right */}
          <div className="flex-1 flex justify-end items-center gap-2 md:gap-6">
            {/* Heart Button and Favorites Popup */}
            <div className="relative navbar-popup-trigger">
              <button
                onClick={handleHeartClick}
                className="relative text-black hover:text-gray-700 transition-colors flex items-center"
              >
                <Heart size={18} className="md:hidden" />
                <Heart size={24} className="hidden md:block" />

                {/* Badge แสดงจำนวนรายการโปรด */}
                {favoriteItems.length > 0 && (
                  <span className="absolute -right-2 -top-2 flex h-5 min-w-5 items-center justify-center rounded-full bg-[#A66858] px-1 text-[10px] font-bold text-white md:h-6 md:min-w-6 md:text-xs">
                    {favoriteItems.length}
                  </span>
                )}
              </button>

              {/* โครงสร้าง Favorite Popup */}
              {activePopup === "likes" && !isAuthenticated && (
                <LoginFirstPopup
                  message="Please login to view your favorites."
                  onClose={() => setActivePopup(null)}
                />
              )}

              {activePopup === "likes" && isAuthenticated && (
                <div
                  className="fixed top-20 left-1/2 -translate-x-1/2 lg:absolute lg:right-0 lg:left-auto lg:top-auto lg:translate-x-0 mt-3 z-[100] w-[90vw] max-w-[420px] sm:w-[360px] md:w-[420px] 
                rounded-3xl bg-[#FAF6F4] border border-[#EBE3DE] 
                shadow-2xl p-4 sm:p-6 font-sans navbar-popup-content"
                >
                  {/* Header ของ Popup */}
                  <div className="flex justify-between items-center mb-5">
                    <h3 className="text-xl font-bold font-['Playfair_Display'] text-[#2C1810]">
                      Your Likes
                    </h3>
                    <div className="flex items-center gap-3">
                      <span className="bg-[#A66858] text-white px-3 py-1 rounded-full text-xs font-semibold">
                        {likedBooks.length} Items
                      </span>
                      <button
                        onClick={() => setActivePopup(null)}
                        className="text-gray-400 hover:text-gray-700 transition-colors"
                      >
                        <X size={18} />
                      </button>
                    </div>
                  </div>

                  {/* ส่วนรายการหนังสือโปรด (Loading → Error → Book List → Empty) */}
                  {favoriteLoading ? (
                    <div className="text-center py-8">
                      <div className="w-8 h-8 border-[3px] border-[#A66858] border-t-transparent rounded-full animate-spin mx-auto" />
                      <p className="text-sm text-[#8B7355] mt-3">
                        Loading your favorites...
                      </p>
                    </div>
                  ) : favoriteError ? (
                    <div className="text-center py-8">
                      <p className="text-sm text-red-400">
                        ไม่สามารถโหลดรายการโปรดได้
                      </p>
                      <button
                        onClick={refetchFavorites}
                        className="mt-2 text-xs text-[#A66858] underline hover:text-[#8B5A3C]"
                      >
                        ลองใหม่อีกครั้ง
                      </button>
                    </div>
                  ) : likedBooks.length > 0 ? (
                    <div
                      className="max-h-[320px] overflow-y-auto pr-2 space-y-3 scrollbar-thumb-[#8B5A3C] 
                      scrollbar-track-[#FAF6F4] scrollbar-thin"
                    >
                      {likedBooks.map((book) => (
                        <div
                          key={book.id}
                          className="flex gap-4 p-3 bg-white rounded-2xl border border-[#F2ECE8] shadow-sm relative group hover:border-[#A66858]/30 transition-all duration-300"
                        >
                          {/* รูปหน้าปกหนังสือ */}
                          <img
                            src={book.img}
                            alt={book.name}
                            className="w-14 h-20 object-cover rounded-xl shadow-sm bg-gray-100 flex-shrink-0"
                          />

                          {/* รายละเอียดหนังสือ */}
                          <div className="flex flex-col justify-center flex-1 min-w-0 pr-6">
                            <h4 className="text-sm font-bold text-[#2C1810] truncate">
                              {book.name}
                            </h4>
                            <p className="text-xs text-[#8B7355] mt-1 truncate">
                              {book.author}
                            </p>
                            <p className="text-sm font-bold text-[#A66858] mt-2">
                              {book.price.toLocaleString("th-TH", {
                                minimumFractionDigits: 2,
                              })}{" "}
                              THB
                            </p>
                          </div>

                          {/* ปุ่มถังขยะสำหรับลบออกจาก Favorite */}
                          <button
                            onClick={() => toggleFavorite(book.id)}
                            className="absolute right-4 top-1/2 -translate-y-1/2 p-2 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all duration-200"
                            title="Remove from favorites"
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8 text-[#8B7355]">
                      <p className="text-sm">
                        You haven't liked any books yet.
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/*CART*/}
            <div className="relative navbar-popup-trigger">
              <button
                onClick={handleCartClick}
                className="relative text-black hover:text-gray-700 transition-colors "
              >
                <ShoppingCart size={18} className="md:hidden" />
                <ShoppingCart size={24} className="hidden md:block" />

                {displayTotalItems > 0 && (
                  <span className="absolute -right-2 -top-2 h-5 min-w-5 flex items-center justify-center rounded-full bg-[#A66858] px-1 text-[10px] font-bold text-white md:h-6 md:min-w-6 md:text-xs">
                    {displayTotalItems}
                  </span>
                )}
              </button>
              {activePopup === "cart" && !isAuthenticated && (
                <LoginFirstPopup
                  message="Please login to view your cart."
                  onClose={() => setActivePopup(null)}
                />
              )}
            </div>
            {/* ORDER HISTORY*/}
            <div className="relative navbar-popup-trigger">
              <button
                onClick={handleOrderClick}
                className="relative text-black hover:text-gray-700 transition-colors flex items-center justify-center"
              >
                <ScrollText size={18} className="md:hidden" />
                <ScrollText size={24} className="hidden md:block" />
              </button>

              {/* LOGIN FIRST POPUP */}
              {activePopup === "orders" && !isAuthenticated && (
                <LoginFirstPopup
                  message="Please login to view your order history."
                  onClose={() => setActivePopup(null)}
                />
              )}

              {/* ORDER HISTORY POPUP after log in*/}
              {activePopup === "orders" && isAuthenticated && (
                <div className="fixed top-20 left-1/2 -translate-x-1/2 lg:absolute lg:right-0 lg:left-auto lg:top-auto lg:translate-x-0 mt-3 z-[100] w-[90vw] max-w-[420px] sm:w-[360px] md:w-[420px] rounded-3xl bg-[#FAF6F4] border border-[#EBE3DE] shadow-2xl p-4 sm:pl-6 sm:p-5 font-['Cormorant_Garamond'] navbar-popup-content">
                  <div className="flex justify-between items-center mb-5">
                    <h3 className="text-xl font-bold font-['Playfair_Display'] text-[#2C1810]">
                      Order History
                    </h3>

                    <div className="flex items-center gap-3">
                      <span className="bg-[#A66858] text-white px-3 py-1 rounded-full text-xs font-semibold">
                        {orders.length} Orders
                      </span>

                      <button
                        onClick={() => setActivePopup(null)}
                        className="text-gray-400 hover:text-gray-700 transition-colors"
                      >
                        <X size={18} />
                      </button>
                    </div>
                  </div>

                  {loadingOrders ? (
                    <p>Loading...</p>
                  ) : orders.length === 0 ? (
                    <div className="py-10 text-center">
                      <p className="text-[#8B7355] text-lg">
                        You have no orders yet.
                      </p>
                    </div>
                  ) : (
                    <div
                      className="max-h-[320px] overflow-y-auto pr-3 space-y-3 scrollbar-thumb-[#8B5A3C] 
                      scrollbar-track-[#FAF6F4] scrollbar-thin"
                    >
                      {orders.map((order) => (
                        <div
                          key={order._id}
                          className="
                            bg-white
                            rounded-2xl
                            border border-[#F2ECE8]
                            shadow-sm
                            p-4
                            hover:border-[#A66858]/30
                            transition-all
                            duration-300
                            my-2
                            "
                        >
                          <div className="flex justify-between">
                            <div>
                              <p className="font-semibold">ORDER ID</p>

                              <p className="lg:text-[16px] text-[12px]">
                                {order._id}
                              </p>
                            </div>

                            <div>
                              <p className="font-semibold">TOTAL</p>

                              <p className="font-semibold">
                                {Number(
                                  order.total_amount.$numberDecimal,
                                ).toFixed(2)}{" "}
                                THB
                              </p>

                              <p className="text-xs text-[#8B7355] mt-1 justify-start flex items-center gap-1">
                                {new Date(order.createdAt).toLocaleDateString(
                                  "en-US",
                                  {
                                    month: "short",
                                    day: "numeric",
                                    year: "numeric",
                                  },
                                )}
                              </p>
                            </div>
                          </div>

                          {order.order_item.map((item) => (
                            <div
                              key={item.book_id}
                              className="flex gap-4 p-3 mt-3 bg-[#FAF6F4] rounded-xl"
                            >
                              <img
                                src={item.img_link}
                                className="w-12 h-16 object-cover"
                              />

                              <div className="flex flex-col justify-center">
                                <h4 className="text-sm font-bold text-[#2C1810] font-['Cormorant_Garamond']">
                                  {item.book_name}
                                </h4>

                                <p className="text-xs text-[#8B7355]">
                                  Qty: {item.quantity}
                                </p>
                              </div>
                            </div>
                          ))}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* SETTINGS */}
            <div className="relative font-['Cormorant_Garamond'] navbar-popup-trigger">
              <button
                onClick={handleProfileClick}
                className="flex items-center gap-2 text-black hover:text-gray-700 transition-colors"
              >
                <CircleUser size={18} className="md:hidden" />
                <CircleUser size={24} className="hidden md:block" />
                {isAuthenticated && !isLoading ? (
                  <span className="hidden text-sm font-medium md:inline">
                    {user?.username || "Profile"}
                  </span>
                ) : null}
              </button>

              {/* LOGIN FIRST POPUP */}
              {activePopup === "profile" && !isAuthenticated && (
                <LoginFirstPopup
                  message="Please login to access your profile."
                  onClose={() => setActivePopup(null)}
                />
              )}

              {activePopup === "profile" && isAuthenticated && (
                <div className="absolute right-0 top-10 z-50 w-40 overflow-hidden rounded-xl border border-gray-200 bg-[#FAF6F4] shadow-lg navbar-popup-content">
                  <button
                    onClick={() => {
                      setActivePopup(null);
                      navigate("/setting");
                    }}
                    className="w-full px-4 py-3 text-left hover:bg-[#f8f3f0]"
                  >
                    Settings
                  </button>

                  <button
                    onClick={handleLogout}
                    className="w-full px-4 py-3 text-left text-red-500 hover:bg-red-50"
                  >
                    Log out
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}

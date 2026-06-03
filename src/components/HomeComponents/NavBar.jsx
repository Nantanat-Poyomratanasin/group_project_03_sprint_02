import {
  ShoppingCart,
  CircleUser,
  Heart,
  Search,
  ChevronDown,
} from "lucide-react";
import { useState } from "react";
import { useCart } from "../../context/CartContext";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useBooks } from "../../context/BookContext";

export default function NavBar() {
  const [selectedCategory, setSelectedCategory] = useState("All Categories");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const { setIsCartOpen, totalItems } = useCart();
  const { books } = useBooks();
  const [searchTerm, setSearchTerm] = useState("");
  const { user, isAuthenticated, isLoading, logout } = useAuth();
  const [isProfileOpen, setIsProfileOpen] = useState(false);

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

  const handleProfileClick = () => {
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }
    setIsProfileOpen((prev) => !prev);
  };

  const handleLogout = async () => {
    await logout();
    setIsProfileOpen(false);
    navigate("/");
  };

  const categories = [
    "All Categories",
    "Fiction",
    "Non-Fiction",
    "Science",
    "Technology",
    "Business",
    "Self-Help",
    "Biography",
    "History",
  ];

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
            <button className="text-black hover:text-gray-700 transition-colors">
              <Heart size={18} className="md:hidden" />
              <Heart size={24} className="hidden md:block" />
            </button>

            <button
              onClick={() => setIsCartOpen(true)}
              className="relative text-black hover:text-gray-700 transition-colors"
            >
              <ShoppingCart size={18} className="md:hidden" />
              <ShoppingCart size={24} className="hidden md:block" />
              {totalItems > 0 && (
                <span className="absolute -right-2 -top-2 flex h-5 min-w-5 items-center justify-center rounded-full bg-[#A66858] px-1 text-[10px] font-bold text-white md:h-6 md:min-w-6 md:text-xs">
                  {totalItems}
                </span>
              )}
            </button>

            <div className="relative font-['Cormorant_Garamond']">
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

              {isProfileOpen && (
                <div className="absolute right-0 top-10 z-50 w-40 overflow-hidden rounded-xl border border-gray-200 bg-white shadow-lg">
                  <button
                    onClick={() => {
                      setIsProfileOpen(false);
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

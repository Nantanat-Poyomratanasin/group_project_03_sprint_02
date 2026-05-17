import {
  ShoppingCart,
  CircleUser,
  Heart,
  Search,
  ChevronDown,
} from "lucide-react";
import { useState } from "react";
import { useCart } from "../../context/CartContext";

export default function NavBar() {
  const [selectedCategory, setSelectedCategory] = useState("All Categories");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const { setIsCartOpen, totalItems } = useCart();

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
          {/* Logo */}
          <div className="shrink-0">
            <h1 className="text-lg md:text-2xl font-bold text-gray-900">
              Read<span className="text-[#A66858]">ly</span>
            </h1>
          </div>

          {/* Search Bar with Category Dropdown - Desktop Only (hidden on mobile) */}
          <div className="hidden md:flex flex-1 min-w-0 max-w-2xl mx-1 md:mx-8">
            <div className="flex items-center bg-white rounded-lg shadow-sm border border-gray-300 w-full">
              {/* Category Dropdown */}
              <div className="relative">
                <button
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-gray-900 border-r border-gray-300 whitespace-nowrap"
                >
                  <span className="text-sm">{selectedCategory}</span>
                  <ChevronDown size={16} />
                </button>

                {isDropdownOpen && (
                  <div className="absolute top-full left-0 mt-1 w-48 bg-white border border-gray-300 rounded-lg shadow-lg z-50">
                    {categories.map((category) => (
                      <button
                        key={category}
                        onClick={() => {
                          setSelectedCategory(category);
                          setIsDropdownOpen(false);
                        }}
                        className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 first:rounded-t-lg last:rounded-b-lg"
                      >
                        {category}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Search Input */}
              <div className="flex-1 flex items-center min-w-0">
                <input
                  type="text"
                  placeholder="Search your favorite book..."
                  className="flex-1 min-w-0 px-4 py-2 text-sm text-gray-900 placeholder-gray-400 focus:outline-none"
                />
                <button className="px-4 py-2 text-gray-400 hover:text-gray-600">
                  <Search size={20} />
                </button>
              </div>
            </div>
          </div>

          {/* Right Icons */}
          <div className="flex items-center gap-2 md:gap-6">
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
            <button className="text-black hover:text-gray-700 transition-colors">
              <CircleUser size={18} className="md:hidden" />
              <CircleUser size={24} className="hidden md:block" />
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}

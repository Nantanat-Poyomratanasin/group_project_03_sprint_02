import { UserCircle, LogOut } from "lucide-react";
import React, { useState } from "react";

export function NavBarAdmin({ activeTab, setActiveTab }) {
  // State to manage the visibility of the logout popup
  const [showDropdown, setShowDropdown] = useState(false);

  // Array of purely names, state is handled by the parent component now
  const navItems = [
    "Dashboard",
    "Product Catalog",
    "User Catalog",
    "Order management",
    "Coupon code",
  ];

  return (
    <nav className="flex items-center justify-between px-6 py-3 border-b-2 border-black bg-white overflow-x-auto">
      {/* Logo */}
      <div className="shrink-0">
        <h1 className="text-xl md:text-2xl font-bold text-gray-900">
          Read<span className="text-[#A66858]">ly</span>
        </h1>
      </div>

      <div className="flex items-center gap-2 shrink-0 ml-6">
        {navItems.map((name) => (
          <button
            key={name}
            onClick={() => setActiveTab(name)}
            className={`px-4 py-2 rounded-full text-white text-sm font-medium transition-colors whitespace-nowrap ${
              activeTab === name
                ? "bg-[#9B6D5B]"
                : "bg-[#A66858] hover:bg-[#8a5547]" // Added a slightly darker hover state for better UX
            }`}
          >
            {name}
          </button>
        ))}

        {/* Profile Dropdown Container */}
        <div className="relative ml-3 shrink-0">
          <button
            className="p-0.5 overflow-hidden flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors"
            onClick={() => setShowDropdown(!showDropdown)}
            onBlur={() => setTimeout(() => setShowDropdown(false), 150)} // Delay hides so click registers
          >
            <UserCircle size={32} strokeWidth={1.5} className="text-black" />
          </button>

          {/* Logout Popup */}
          {showDropdown && (
            <div className="absolute right-0 mt-2 w-40 bg-white border border-gray-200 rounded-lg shadow-lg py-1 z-50">
              <button
                onClick={handleLogout}
                className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
              >
                <LogOut size={16} className="mr-2" />
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}

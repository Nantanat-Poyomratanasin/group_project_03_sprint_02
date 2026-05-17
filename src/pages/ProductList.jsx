import React, { useState, useEffect } from "react";
import Pagination from "@mui/material/Pagination";
import BookCard from "../components/CardComponents/BookCard";
import { bookData } from "../mock-data/bookData";

import NavBar from "../components/HomeComponents/NavBar";
import Footer from "../components/HomeComponents/Footer";
import { ScrollRestoration } from "react-router-dom";

const ProductList = () => {
  // --- States ---

  const categories = ["All","Self-help", "History", "Science fiction & Fantasy","Children","Romance"];


  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(8);
  const [ selectedCategory, setSelectedCategory ] = useState('All');

  // --- Responsive Logic ---
  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      if (width >= 1024) setItemsPerPage(8);
      else if (width >= 768) setItemsPerPage(6);
      else setItemsPerPage(4);
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // --- Filtering Logic ---
  const filteredBooks =
    selectedCategory === "All"
      ? bookData
      : bookData.filter((book) => book.category === selectedCategory);

  // --- Pagination Logic (Now based on filteredBooks) ---
  const totalPages = Math.ceil(filteredBooks.length / itemsPerPage);

  // Reset to page 1 if the current page exceeds total pages after a filter/resize
  useEffect(() => {
    if (currentPage > totalPages && totalPages > 0) {
      setCurrentPage(totalPages);
    }
  }, [totalPages, currentPage]);

  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentBooks = filteredBooks.slice(
    startIndex,
    startIndex + itemsPerPage,
  );

  // --- Handlers ---
  const handlePageChange = (event, value) => {
    setCurrentPage(value);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
    setCurrentPage(1); // Crucial: Reset to page 1 when changing categories
  };

  return (
    <>
      <NavBar />
      <div className="min-h-screen bg-[#f4ece3] p-6 md:p-10 font-['Cormorant_Garamond']">
        <div className="max-w-7xl mx-auto">
          {/* Header Area */}
          <div className="flex flex-col md:flex-row md:items-center mb-10 gap-6">
            <h1 className="text-4xl font-semibold font-['Cormorant_Garamond'] text-gray-900 tracking-wide whitespace-nowrap">
              Library
            </h1>

            {/* Category Pills */}
            <div className="flex flex-wrap gap-3">
              {categories.map((cat) => {
                const isActive = selectedCategory === cat;
                return (
                  <button
                    key={cat}
                    onClick={() => handleCategoryChange(cat)}
                    className={`px-5 py-1.5 rounded-full text-sm font-medium transition-all duration-200 ${
                      isActive
                        ? "bg-[#6c483b] text-white shadow-md ring-2 ring-offset-2 ring-[#6c483b] ring-offset-[#f4ece3]" // Darker active state
                        : "bg-[#A87968] text-white hover:bg-[#8B6253]" // Normal state
                    } cursor-pointer`}
                  >
                    {cat}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Responsive Grid Layout */}
          {filteredBooks.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 min-h-[600px] content-start">
              {currentBooks.map((book) => (
                <BookCard key={book.id} book={book} />
              ))}
            </div>
          ) : (
            // Empty state handling if a category has no books
            <div className="min-h-[600px] flex items-center justify-center">
              <p className="text-gray-500 text-lg">
                No books found in this category.
              </p>
            </div>
          )}

          {/* MUI Pagination */}
          {totalPages > 1 && ( // Only show pagination if there is more than 1 page
            <div className="flex justify-start items-center mt-12">
              <Pagination
                count={totalPages}
                page={currentPage}
                onChange={handlePageChange}
                shape="rounded"
                sx={{
                  "& .MuiPaginationItem-root": {
                    backgroundColor: "white",
                    color: "#374151",
                    boxShadow: "0 1px 2px 0 rgb(0 0 0 / 0.05)",
                    "&:hover": {
                      backgroundColor: "#f9fafb",
                    },
                  },
                  "& .Mui-selected": {
                    backgroundColor: "#A87968 !important",
                    color: "white",
                    "&:hover": {
                      backgroundColor: "#8B6253 !important",
                    },
                  },
                }}
              />
            </div>
          )}
        </div>
      </div>
      <Footer />
    </>
  );
};

export default ProductList;

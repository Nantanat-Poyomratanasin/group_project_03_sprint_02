import { useEffect, useMemo, useState } from "react";
import CategoryFilter from "../CategoryFilter";
import SlideBooks from "../CardComponents/SlideBooks";
import { Link } from "react-router-dom";

export default function CategorySample({
  books = [],
  isLoading = false,
  error = "",
}) {
  const categories = useMemo(() => {
    return [...new Set(books.map((book) => book.category).filter(Boolean))];
  }, [books]);

  const [activeCategory, setActiveCategory] = useState("");

  useEffect(() => {
    if (!activeCategory && categories.length > 0) {
      setActiveCategory(categories[0]);
    }
  }, [activeCategory, categories]);

  const filteredBooks = useMemo(() => {
    // ถ้าเลือก All ให้ใช้หนังสือทั้งหมด ไม่งั้นค่อยกรองตามหมวด
    const matchedBooks =
      activeCategory === "All"
        ? books
        : books.filter((book) => book.category === activeCategory);

    // เรียงคะแนนมากไปน้อย แล้วตัดให้เหลือแค่ 6 เล่ม
    return [...matchedBooks].sort((a, b) => b.rating - a.rating).slice(0, 6);
  }, [activeCategory, books]);

  return (
    <div className="bg-[#EEE1DB] px-4 pb-10 pt-10 sm:px-8 lg:px-20 lg:pb-14 lg:pt-16">
      <div className="mb-6 flex items-center justify-between lg:mb-8">
        <h2 className="text-3xl font-bold text-black sm:text-4xl lg:text-5xl">
          Popular Category
        </h2>
        <Link to="/productList">
          <button className="cursor-pointer text-sm font-semibold text-black hover:underline sm:text-base lg:text-lg">
            See more &gt;
          </button>
        </Link>
      </div>

      {categories.length > 0 && (
        <CategoryFilter
          className=""
          categories={categories}
          activeCategory={activeCategory}
          onCategoryChange={setActiveCategory}
        />
      )}

      {/* ปรับ padding ของกรอบตามขนาดหน้าจอ เพื่อให้การ์ดดูบาลานซ์ทุกขนาด */}
      <div className="flex items-center justify-center rounded-[2rem] bg-[#F9F4F1] px-3 py-5 shadow-sm sm:rounded-[2.5rem] sm:px-5 sm:py-7 lg:ml-12 lg:px-6 lg:py-8">
        {isLoading && <p className="py-10 text-center">Loading books...</p>}
        {!isLoading && error && (
          <p className="py-10 text-center text-red-700">{error}</p>
        )}
        {!isLoading && !error && filteredBooks.length === 0 && (
          <p className="py-10 text-center">No books found.</p>
        )}
        {!isLoading && !error && filteredBooks.length > 0 && (
          // ใช้ variant แยกสำหรับ category โดยเฉพาะ
          // เพื่อไม่ให้ขนาดการ์ดของส่วนนี้ไปกระทบ Hero หรือส่วนอื่น
          <SlideBooks books={filteredBooks} variant="category" visibleCards={5} />
        )}
      </div>
    </div>
  );
}

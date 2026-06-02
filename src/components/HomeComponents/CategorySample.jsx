import { useMemo, useState } from "react";
import CategoryFilter from "../CategoryFilter";
import SlideBooks from "../CardComponents/SlideBooks";
import { bookData } from "../../mock-data/bookData";
import { Link } from "react-router-dom";

export default function CategorySample() {
  const categories = [
    "Romance",
    "Science fiction & Fantasy",
    "Self-help",
    "History",
    "Children",
  ];
  const [activeCategory, setActiveCategory] = useState("Romance");

  const filteredBooks = useMemo(() => {
    // ถ้าเลือก All ให้ใช้หนังสือทั้งหมด ไม่งั้นค่อยกรองตามหมวด
    const matchedBooks =
      activeCategory === "All"
        ? bookData
        : bookData.filter((book) => book.category === activeCategory);

    // เรียงคะแนนมากไปน้อย แล้วตัดให้เหลือแค่ 6 เล่ม
    return [...matchedBooks].sort((a, b) => b.rating - a.rating).slice(0, 6);
  }, [activeCategory]);

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

      <CategoryFilter
        className=""
        categories={categories}
        activeCategory={activeCategory}
        onCategoryChange={setActiveCategory}
      />

      {/* ปรับ padding ของกรอบตามขนาดหน้าจอ เพื่อให้การ์ดดูบาลานซ์ทุกขนาด */}
      <div className="flex items-center justify-center rounded-[2rem] bg-[#F9F4F1] px-3 py-5 shadow-sm sm:rounded-[2.5rem] sm:px-5 sm:py-7 lg:ml-12 lg:px-6 lg:py-8">
        <SlideBooks books={filteredBooks} />
      </div>
    </div>
  );
}

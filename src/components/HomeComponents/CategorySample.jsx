import { useState } from "react";
import CategoryFilter from "../CategoryFilter";
import SlideBooks from "../CardComponents/SlideBooks";
import { bookData } from "../../mock-data/bookData";
import { Link } from "react-router-dom";

export default function CategorySample() {
  const categories = [
    "Romance",
    "Science Fiction & Fantasy",
    "Self-Help",
    "History",
    "Children's Books",
  ];
  const [activeCategory, setActiveCategory] = useState("Romance");

  // กรองข้อมูล: ถ้าในข้อมูล (book.category) ตรงกับหมวดที่เลือก (activeCategory) ให้เก็บไว้
  const filteredBooks = bookData.filter((book) => {
    // ป้องกันเรื่องตัวพิมพ์เล็ก-ใหญ่ไม่ตรงกัน โดยใช้ toLowerCase()
    return book.category.toLowerCase() === activeCategory.toLowerCase();
  });

  return (
    <div className="pt-16 pb-14 px-20 bg-[#EEE1DB]">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-5xl font-bold text-black">Popular Category</h2>
        <Link to="/productList">
          <button className="text-black hover:underline">See more &gt;</button>
        </Link>
      </div>

      {/* เรียกใช้ Component ที่เอมสร้าง */}
      <CategoryFilter
        categories={categories}
        activeCategory={activeCategory}
        onCategoryChange={setActiveCategory}
      />

      {/* ส่วนแสดง BookCard ที่เอมทำไว้ (ใส่ Filter ตามหมวดหมู่ได้เลยค่ะ) */}
      <div className="flex items-center gap-6 overflow-x-auto py-4 ml-14 bg-[#F9EEE9] rounded-3xl">
        <SlideBooks books={filteredBooks} />
      </div>
    </div>
  );
}

import { useRef } from "react";
import BookCard from "./BookCard";

export default function SlideBooks({ books }) {
  const slideRef = useRef(null);

  const scroll = (direction) => {
    const { current } = slideRef;
    if (direction === "left") {
      current.scrollLeft -= 300; // เลื่อนไปทางซ้าย 300 พิกเซล
    } else {
      current.scrollLeft += 300; // เลื่อนไปทางขวา 300 พิกเซล
    }
  };

  return (
    <div className="relative w-full max-w-6xl mx-auto px-10">
      {/* 3. ปุ่มลูกศรซ้าย */}
      <button
        onClick={() => scroll("left")}
        className="absolute -left-5 top-1/2 -translate-y-1/2 w-9 h-9 bg-white border border-gray-200 rounded-full shadow flex items-center justify-center"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="w-4 h-4 text-gray-600"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M15 19l-7-7 7-7"
          ></path>
        </svg>
      </button>

      {/* 4. กล่องแสดงรายการหนังสือ (ส่วนที่ใช้ Ref) */}
      <div
        ref={slideRef}
        className="flex gap-6 overflow-x-auto scroll-smooth no-scrollbar py-4"
      >
        {books.map((book) => (
          <div key={book.id} className="flex-none">
            <BookCard book={book} />
          </div>
        ))}
      </div>

      {/* 5. ปุ่มลูกศรขวา */}
      <button
        onClick={() => scroll("right")}
        className="absolute -right-5 top-1/2 -translate-y-1/2 w-9 h-9 bg-white border border-gray-200 rounded-full shadow flex items-center justify-center"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="w-4 h-4 text-gray-600"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M9 5l7 7-7 7"
          ></path>
        </svg>
      </button>
    </div>
  );
}

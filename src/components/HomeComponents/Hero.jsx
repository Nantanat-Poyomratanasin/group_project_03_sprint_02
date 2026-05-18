import { bookData } from "../../mock-data/bookData";
import SlideBooks from "../CardComponents/SlideBooks";

export default function Hero() {
  // เลือกเฉพาะหนังสือที่ถูกปักหมุดให้แสดงในส่วน Trending
  const trendingBooks = bookData
    .filter((book) => book.is_highlighted)
    .slice(0, 5); // เก็บไว้ 5 เล่ม เพื่อให้ 3 เล่มแรกแสดงก่อน และเลื่อนดูเล่มถัดไปได้

  return (
    <section className="flex flex-col gap-8 bg-[#ECE0DC] px-10 py-8 font-['Cormorant_Garamond'] sm:px-10 lg:flex-row lg:items-center lg:px-[100px]">
      <div className="max-w-[260px] [text-wrap:pretty]">
        <h1 className="text-5xl font-extrabold leading-[0.95] sm:text-6xl">
          Trending Books
        </h1>
        <p className="mt-8 text-2xl font-semibold leading-tight">
          Let's discover your new favorite books !
        </p>
      </div>
      {/* กล่องด้านขวาล็อกให้เห็น 3 การ์ดพอดีตามภาพตัวอย่าง */}
      <div className="w-full rounded-[50px] bg-[#faf4ef] px-10 py-10">
        <SlideBooks books={trendingBooks} variant="hero" visibleCards={3} />
      </div>
    </section>
  );
}

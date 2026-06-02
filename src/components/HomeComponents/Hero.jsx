import { bookData } from "../../mock-data/bookData";
import SlideBooks from "../CardComponents/SlideBooks";

export default function Hero() {
  // เลือกเฉพาะหนังสือที่ถูกปักหมุดให้แสดงในส่วน Trending
  const trendingBooks = bookData
    .filter((book) => book.is_highlighted)
    .slice(0, 5); // เก็บไว้ 5 เล่ม เพื่อให้ 3 เล่มแรกแสดงก่อน และเลื่อนดูเล่มถัดไปได้

  return (
    <section
      className="flex flex-col gap-8 bg-[#ECE0DC] px-5 py-7 font-['Cormorant_Garamond']
      md:px-10
      lg:flex-row lg:items-start lg:px-16
      "
    >
      <div
        className="
          flex flex-col
          gap-4
          md:max-w-full
          md:items-Start
          lg:max-w-[240px]
          lg:flex-col
          whitespace-nowrap
          lg:whitespace-normal
          
        "
      >
        <h1
          className="text-5xl font-extrabold leading-[0.95]
            sm:text-6xl
            md:text-5xl
            lg:text-4xl"
        >
          Trending Books
        </h1>
        <p
          className="mt-3
            max-w-[280px]
            text-lg
            font-semibold
            leading-tight
            md:mt-0
            md:text-left
            lg:text-left"
        >
          Let's discover your new favorite books !
        </p>
      </div>
      {/* กล่องด้านขวาล็อกให้เห็น 3 การ์ดพอดีตามภาพตัวอย่าง */}
      <div
        className="w-full rounded-[32px] bg-[#faf4ef] px-6 py-6
        md:px-8 md:py-8
        lg:rounded-[36px] lg:px-6 lg:py-2"
      >
        <SlideBooks books={trendingBooks} variant="hero" visibleCards={3} />
      </div>
    </section>
  );
}

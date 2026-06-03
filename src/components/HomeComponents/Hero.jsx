import { bookData } from "../../mock-data/bookData";
import SlideBooks from "../CardComponents/SlideBooks";
import woodTexture from "../../assets/BgLoginAndRegiter/bglogin.jpg";

export default function Hero() {
  // เลือกเฉพาะหนังสือที่ถูกปักหมุดให้แสดงในส่วน Trending
  const trendingBooks = bookData
    .filter((book) => book.is_highlighted)
    .slice(0, 5); // เก็บไว้ 5 เล่ม เพื่อให้ 3 เล่มแรกแสดงก่อน และเลื่อนดูเล่มถัดไปได้

  return (
    <section
      className="flex flex-col lg:flex-row  font-['Cormorant_Garamond']
       lg:items-stretch 
      "
    >
      {/* ฝั่งซ้าย */}
      <div
        className="
        bg-[#ECE0DC] 
          flex flex-col
          gap-1
          md:gap-4
          md:max-w-full
          md:items-start
          md:pl-8
          lg:max-w-[300px]
          lg:flex-col
          whitespace-nowrap
          lg:whitespace-normal
          lg:pl-16 lg:pr-6
          pt-8
          pb-4
          px-6
          
        "
      >
        <h1
          className="text-3xl
          font-extrabold
          leading-[0.95]

          sm:text-3xl
          md:text-5xl
          lg:text-5xl"
        >
          Trending Books
        </h1>
        <p
          className="mt-3
            max-w-[280px]
            text-m
            lg:text-lg
            font-semibold
            leading-tight
            md:mt-0
            md:text-left
            lg:text-left"
        >
          Let's discover your new favorite books !
        </p>
      </div>

      {/* ฝั่งขวา */}
      {/* กล่องด้านขวาล็อกให้เห็น 3 การ์ดพอดีตามภาพตัวอย่าง */}
      <div
        className="
            flex-1
            w-full
            bg-cover
            bg-center
            bg-no-repeat
            py-6
            px-4
            lg:py-8
          "
        style={{
          backgroundImage: `url(${woodTexture})`,
        }}
      >
        <div
          className="w-full mx-auto rounded-[32px] bg-[#faf4ef] px-5 py-1 
        md:px-5 md:py-8 md:max-w-[640px]
        lg:rounded-[36px] lg:px-4 lg:py-2 lg:max-w-[800px]"
        >
          <SlideBooks books={trendingBooks} variant="hero" visibleCards={3} />
        </div>
      </div>
    </section>
  );
}

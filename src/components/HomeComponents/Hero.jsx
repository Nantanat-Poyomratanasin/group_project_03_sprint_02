import { bookData } from "../../mock-data/bookData";
import SlideBooks from "../CardComponents/SlideBooks";

export default function Hero() {
  //only is_highlighted: true
  const trendingBooks = bookData
    .filter((book) => book.is_highlighted)
    .slice(0, 5); // เอาแค่ 5 เล่มแรกที่เป็น highlighted

  return (
    <section className="px-10 sm:px-10 lg:px-[100px] py-8 bg-[#ECE0DC] font-['Cormorant_Garamond'] flex flex-col sm:flex-row gap-5">
      <div className="[text-wrap:pretty]">
        <h1 className="font-extrabold text-2xl sm:text-3xl">Trending Books</h1>
        <p className="mt-2 text-lg sm:text-xl font-semibold ">
          Let's discover your new favorite books !
        </p>
      </div>
      <div className="w-full bg-[#faf4ef] rounded-[50px] px-6 sm:px-8 py-6">
        <SlideBooks books={trendingBooks} />
      </div>
    </section>
  );
}

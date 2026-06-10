import SlideBooks from "../CardComponents/SlideBooks";
import woodTexture from "../../assets/BgLoginAndRegiter/bglogin.jpg";

export default function Hero({ books = [], isLoading = false, error = "" }) {
  const trendingBooks = books.filter((book) => book.is_highlighted).slice(0, 5);

  return (
    <section
      className="flex flex-col lg:flex-row  font-['Cormorant_Garamond']
       lg:items-stretch 
      "
    >
      <div
        className="
        bg-[#ECE0DC] 
          flex flex-col
          gap-1
          md:gap-4
          md:max-w-full
          md:items-start
          md:pl-8
          lg:max-w-[280px]
          lg:flex-col
          whitespace-nowrap
          lg:whitespace-normal
          lg:pl-12
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

      <div
        className="
            flex-1
            w-full
            bg-cover
            bg-center
            bg-no-repeat
            py-6
            px-4
            lg:py-10
          "
        style={{
          backgroundImage: `url(${woodTexture})`,
        }}
      >
        <div
          className="w-full mx-auto rounded-[32px] bg-[#faf4ef] px-5 py-1 
        md:px-4 md:py-2 md:max-w-[650px]
        lg:rounded-[36px] lg:px-4  lg:max-w-[840px] "
        >
          {isLoading && <p className="py-10 text-center">Loading books...</p>}
          {!isLoading && error && (
            <p className="py-10 text-center text-red-700">{error}</p>
          )}
          {!isLoading && !error && trendingBooks.length === 0 && (
            <p className="py-10 text-center">No highlighted books found.</p>
          )}
          {!isLoading && !error && trendingBooks.length > 0 && (
            <SlideBooks books={trendingBooks} variant="hero" visibleCards={3} />
          )}
        </div>
      </div>
    </section>
  );
}

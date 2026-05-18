import { useEffect, useRef, useState } from "react";
import BookCard from "./BookCard";

export default function SlideBooks({
  books,
  variant = "default",
  visibleCards = 5,
}) {
  const slideRef = useRef(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);
  const [screenWidth, setScreenWidth] = useState(
    typeof window !== "undefined" ? window.innerWidth : 1440,
  );
  const isHeroVariant = variant === "hero";
  // กำหนดขนาด card และจำนวนใบที่ต้องเห็นตาม breakpoint
  let cardWidth = isHeroVariant ? 340 : 188;
  let cardGap = isHeroVariant ? 24 : 16;
  let cardsPerView = visibleCards;

  if (screenWidth < 640) {
    // mobile: เห็นแค่ 1 ใบ และลดระยะห่างเพื่อไม่ให้แน่นจอเกินไป
    cardWidth = isHeroVariant ? 260 : 220;
    cardGap = 0;
    cardsPerView = 1;
  } else if (screenWidth < 1024) {
    // tablet: Hero เห็น 2 ใบ ส่วน Category เห็น 3 ใบตามตัวอย่าง
    cardWidth = isHeroVariant ? 280 : 170;
    cardGap = isHeroVariant ? 20 : 18;
    cardsPerView = isHeroVariant ? 2 : 3;
  }

  // ใช้ระยะเลื่อนทีละ 1 การ์ดพร้อม gap
  const CARD_STEP = cardWidth + cardGap;
  // ล็อกความกว้าง viewport ให้เห็นจำนวนการ์ดตามที่กำหนด
  const viewportWidth =
    cardsPerView * cardWidth + (cardsPerView - 1) * cardGap;

  const updateArrowState = () => {
    const current = slideRef.current;

    if (!current) {
      return;
    }

    const maxScrollLeft = current.scrollWidth - current.clientWidth;
    setCanScrollLeft(current.scrollLeft > 0);
    setCanScrollRight(current.scrollLeft < maxScrollLeft - 1);
  };

  const scroll = (direction) => {
    const { current } = slideRef;

    if (!current) {
      return;
    }

    if (direction === "left") {
      current.scrollBy({ left: -CARD_STEP, behavior: "smooth" });
    } else {
      current.scrollBy({ left: CARD_STEP, behavior: "smooth" });
    }
  };

  useEffect(() => {
    updateArrowState();
    const current = slideRef.current;

    if (!current) {
      return;
    }

    current.addEventListener("scroll", updateArrowState);
    window.addEventListener("resize", updateArrowState);

    return () => {
      current.removeEventListener("scroll", updateArrowState);
      window.removeEventListener("resize", updateArrowState);
    };
  }, [books]);

  useEffect(() => {
    // ฟังการ resize เพื่อคำนวณ layout ใหม่ทุกครั้งที่หน้าจอเปลี่ยนขนาด
    const handleResize = () => {
      setScreenWidth(window.innerWidth);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    // วาง slider กลาง section และเผื่อพื้นที่ลูกศรซ้ายขวาให้สมดุลกัน
    <div
      className={`relative mx-auto w-full ${
        isHeroVariant
          ? "max-w-[1128px] px-4 sm:px-6 lg:px-12"
          : "max-w-[1100px] px-3 sm:px-6 lg:px-8"
      }`}
    >
      {canScrollLeft && (
        <button
          onClick={() => scroll("left")}
          className={`absolute top-1/2 -translate-y-1/2 rounded-full border border-gray-200 bg-white shadow flex items-center justify-center ${
            isHeroVariant
              ? "-left-1 h-10 w-10 sm:-left-2 sm:h-11 sm:w-11 lg:-left-3 lg:h-12 lg:w-12"
              : "left-0 h-8 w-8 sm:-left-2 sm:h-9 sm:w-9 lg:-left-4"
          }`}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-4 h-4 text-gray-600"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M15 19l-7-7 7-7"
            ></path>
          </svg>
        </button>
      )}

      <div
        ref={slideRef}
        // ล็อก viewport ให้เห็นจำนวน cards ตามที่กำหนด และเลื่อนเพื่อดูใบถัดไป
        className="mx-auto flex overflow-x-auto scroll-smooth no-scrollbar"
        style={{
          width: `${viewportWidth}px`,
          maxWidth: "100%",
          gap: `${cardGap}px`,
          paddingTop: isHeroVariant ? "16px" : screenWidth < 640 ? "12px" : "20px",
          paddingBottom:
            isHeroVariant ? "16px" : screenWidth < 640 ? "12px" : "20px",
        }}
      >
        {books.map((book) => (
          <div key={book.id} className="flex-none">
            <BookCard book={book} variant={variant} />
          </div>
        ))}
      </div>

      {canScrollRight && (
        <button
          onClick={() => scroll("right")}
          className={`absolute top-1/2 -translate-y-1/2 rounded-full border border-gray-200 bg-white shadow flex items-center justify-center ${
            isHeroVariant
              ? "-right-1 h-10 w-10 sm:-right-2 sm:h-11 sm:w-11 lg:-right-3 lg:h-12 lg:w-12"
              : "right-0 h-8 w-8 sm:-right-2 sm:h-9 sm:w-9 lg:-right-4"
          }`}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-4 h-4 text-gray-600"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M9 5l7 7-7 7"
            ></path>
          </svg>
        </button>
      )}
    </div>
  );
}

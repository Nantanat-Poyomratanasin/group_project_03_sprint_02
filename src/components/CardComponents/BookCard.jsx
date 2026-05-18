import { Link } from "react-router-dom";
import { useCart } from "../../context/CartContext";

export default function BookCard({ book, variant = "default" }) {
  const defaultImg = "https://via.placeholder.com/150?text=No+Image";
  const { addToCart } = useCart();
  const isHeroVariant = variant === "hero";
  // เช็กก่อนว่าหนังสือเล่มนี้มีส่วนลดหรือไม่
  const hasDiscount = book.isDiscount && book.discount_percentage > 0;
  // ถ้ามีส่วนลด ให้คำนวณราคาหลังหักเปอร์เซ็นต์
  const discountPrice = hasDiscount
    ? book.price * (1 - book.discount_percentage / 100)
    : book.price;
  const formattedDiscountPrice = discountPrice.toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
  const formattedOriginalPrice = book.price.toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
  const roundedRating = Number(book.rating?.toFixed(1) || 0);

  return (
    <Link to={`/bookDetail/${book.id}`} className="block">
      {/* ถ้าอยู่ใน Hero จะใช้ card ที่ใหญ่ขึ้นเพื่อให้เห็นแค่ 3 ใบตามตัวอย่าง */}
      <div
        className={`flex flex-col border border-[#EFE7E2] bg-white shadow-[0_4px_18px_rgba(44,24,16,0.08)] ${
          isHeroVariant
            ? "h-[430px] w-[260px] rounded-[28px] p-4 sm:h-[460px] sm:w-[280px] sm:rounded-[30px] sm:p-5 lg:h-[520px] lg:w-[340px] lg:rounded-[34px] lg:p-7"
            : "h-[360px] w-[220px] rounded-[24px] p-3 sm:h-[360px] sm:w-[170px] sm:rounded-[24px] sm:p-3 lg:h-[392px] lg:w-[188px] lg:rounded-[28px] lg:p-4"
        }`}
      >
        {/* ปรับสัดส่วนรูปแยกตามขนาดของ card แต่ละแบบ */}
        <div
          className={`overflow-hidden bg-[#F4ECE7] ${
            isHeroVariant
              ? "mb-4 h-[250px] rounded-xl sm:h-[280px] sm:rounded-2xl lg:mb-5 lg:h-[320px]"
              : "mb-3 h-[220px] rounded-xl sm:h-[210px] lg:h-[238px]"
          }`}
        >
          <img
            src={book.img || defaultImg}
            alt={book.name || "Book"}
            onError={(e) => {
              if (e.currentTarget.src !== defaultImg) {
                e.currentTarget.src = defaultImg;
              }
            }}
            className="h-full w-full object-cover transition-transform duration-300 hover:scale-105"
          />
        </div>

        <div className="flex flex-1 flex-col">
          <h3
            className={`line-clamp-1 font-bold text-[#1F2432] ${
              isHeroVariant
                ? "text-[1rem] sm:text-[1.02rem] lg:text-[1.1rem]"
                : "text-[0.88rem] sm:text-[0.9rem] lg:text-[0.98rem]"
            }`}
          >
            {book.name}
          </h3>
          <div
            className={`flex items-center gap-2 text-[#1F2432] ${isHeroVariant ? "mt-4" : "mt-3"}`}
          >
            <span
              className={
                isHeroVariant
                  ? "text-sm font-semibold sm:text-sm lg:text-base"
                  : "text-xs font-semibold sm:text-xs lg:text-sm"
              }
            >
              {roundedRating}
            </span>
            <span
              className={
                isHeroVariant
                  ? "text-sm tracking-[0.12em] text-[#1F2432] sm:text-sm lg:text-base"
                  : "text-[0.68rem] tracking-[0.1em] text-[#1F2432] sm:text-[0.65rem] lg:text-xs"
              }
            >
              {"★".repeat(Math.round(book.rating || 5))}
            </span>
          </div>

          <div
            className={`flex items-end gap-2 ${isHeroVariant ? "mb-4 mt-4" : "mb-3 mt-3"}`}
          >
            <p
              className={
                isHeroVariant
                  ? "text-[0.95rem] font-bold text-[#1F2432] sm:text-[0.95rem] lg:text-[1rem]"
                  : "text-[1rem] font-bold text-[#1F2432]"
              }
            >
              {formattedDiscountPrice} THB
            </p>
            {hasDiscount && (
              <p
                className={
                  isHeroVariant
                    ? "text-xs font-medium text-[#A8B0BE] line-through"
                    : "text-[0.65rem] font-medium text-[#A8B0BE] line-through"
                }
              >
                {formattedOriginalPrice} THB
              </p>
            )}
          </div>

          <button
            onClick={(event) => {
              event.preventDefault();
              addToCart(book);
            }}
            className={`mt-auto rounded-full bg-[#B77B68] font-semibold text-white transition hover:bg-[#A66858] ${
              isHeroVariant
                ? "px-4 py-2.5 text-xs sm:px-4 sm:py-3 sm:text-sm"
                : "px-3 py-2 text-[0.68rem] sm:text-[0.68rem] lg:text-[0.7rem]"
            }`}
          >
            Add to Cart
          </button>
        </div>
      </div>
    </Link>
  );
}

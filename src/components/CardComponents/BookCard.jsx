import { Link } from "react-router-dom";
import { useCart } from "../../context/CartContext";

export default function BookCard({ book }) {
  const defaultImg = "https://via.placeholder.com/150?text=No+Image";
  const { addToCart } = useCart();

  return (
    <Link to={`/bookDetail/${book.id}`}>
      <div className="flex w-64 flex-col rounded-[28px] bg-white p-4 shadow-sm">
        <div className="mb-4 h-80 w-full overflow-hidden rounded-2xl">
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

        <div className="flex flex-1 flex-col gap-2">
          <h3 className="line-clamp-2 text-lg font-bold text-gray-800">
            {book.name}
          </h3>
          <div className="text-sm text-yellow-500">
            {"*".repeat(Math.round(book.rating || 5))}
          </div>

          <p className="text-xl font-semibold text-black">
            {book.price} <span className="text-sm font-normal">THB</span>
          </p>

          <button
            onClick={() => addToCart(book)}
            className="mt-2 rounded-full bg-[#B77B68] px-4 py-3 text-sm font-semibold text-white transition hover:bg-[#A66858]"
          >
            Add to Cart
          </button>
        </div>
      </div>
    </Link>
  );
}

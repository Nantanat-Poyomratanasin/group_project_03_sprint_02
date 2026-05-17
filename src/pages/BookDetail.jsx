import { useState } from "react";
import { Heart, Star } from "lucide-react";
import NavBar from "../components/HomeComponents/NavBar";
import Footer from "../components/HomeComponents/Footer";
import ReviewSection from "../components/BookDetailComponents/ReviewSection";
import WriteReviewForm from "../components/BookDetailComponents/WriteReviewForm";
import { useCart } from "../context/CartContext";

export default function BookDetail() {
  const [isWritingReview, setIsWritingReview] = useState(false);
  const { addToCart } = useCart();

  const book = {
    id: 19,
    name: "The Night We Met",
    author: "Abby Jimenez",
    rating: 4.7,
    totalRatings: 2814,
    description:
      "A heartwarming and hilarious love story about two people who meet in the most unexpected of places. When Alexis meets Daniel while waiting for a ferry, she never imagines the night will change her life forever.",
    price: 434.15,
    originalPrice: 542.0,
    discount: 20,
    pages: 320,
    language: "English",
    publisher: "Forever",
    format: "Paperback",
    categories: ["Romance", "Contemporary"],
    img: "https://m.media-amazon.com/images/I/81mXpS+X6vL.jpg",
  };

  const reviews = [
    {
      id: 1,
      customerName: "Sarah K.",
      avatar: "S",
      verified: true,
      date: "12 Apr 2026",
      rating: 5,
      review:
        "Absolutely loved this book! The chemistry between the characters was amazing and I couldn't put it down. Abby Jimenez never disappoints and this might be her best yet.",
    },
    {
      id: 2,
      customerName: "Mike L.",
      avatar: "M",
      verified: true,
      date: "5 Apr 2026",
      rating: 4,
      review:
        "Great read for a rainy day. The humor is spot on and the emotional moments hit hard. Only knocked one star because the ending felt a little rushed.",
    },
  ];

  return (
    <div className="min-h-screen bg-[#F5F5F5]">
      <NavBar />

      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <nav className="mb-6 text-sm text-gray-600">
          <span className="cursor-pointer hover:text-[#A66858]">Home</span>
          <span className="mx-2">/</span>
          <span className="cursor-pointer hover:text-[#A66858]">Romance</span>
          <span className="mx-2">/</span>
          <span className="text-gray-900">{book.name}</span>
        </nav>

        <div className="mb-6 rounded-lg bg-white p-6 shadow-sm md:p-8">
          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            <div className="flex flex-col items-center md:items-start">
              <div className="mb-4 aspect-[2/3] w-full max-w-[280px] overflow-hidden rounded-lg shadow-lg">
                <img
                  src={book.img}
                  alt={book.name}
                  className="h-full w-full object-cover"
                />
              </div>
              <button className="flex items-center gap-2 rounded-full border-2 border-gray-300 px-6 py-2 text-gray-700 transition-colors hover:border-[#A66858] hover:text-[#A66858]">
                <Heart size={20} />
                <span>Like</span>
              </button>
            </div>

            <div className="md:col-span-2">
              <div className="mb-3 flex gap-2">
                {book.categories.map((category) => (
                  <span
                    key={category}
                    className="rounded-full bg-[#F5E6D3] px-3 py-1 text-sm text-[#A66858]"
                  >
                    {category}
                  </span>
                ))}
              </div>

              <h1 className="mb-2 text-3xl font-bold text-gray-900 md:text-4xl">
                {book.name}
              </h1>
              <p className="mb-4 text-gray-600">by {book.author}</p>

              <div className="mb-4 flex items-center gap-2">
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      size={18}
                      className={
                        i < Math.floor(book.rating)
                          ? "fill-yellow-400 text-yellow-400"
                          : "text-gray-300"
                      }
                    />
                  ))}
                </div>
                <span className="font-semibold text-gray-900">{book.rating}</span>
                <span className="text-gray-500">
                  ({book.totalRatings.toLocaleString()} ratings)
                </span>
              </div>

              <p className="mb-6 leading-relaxed text-gray-700">
                {book.description}
              </p>

              <div className="mb-6 flex items-center gap-4">
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-bold text-gray-900">
                    {book.price.toFixed(2)} THB
                  </span>
                  <span className="text-lg text-gray-400 line-through">
                    {book.originalPrice.toFixed(2)} THB
                  </span>
                  <span className="rounded bg-red-500 px-2 py-1 text-sm text-white">
                    -{book.discount}%
                  </span>
                </div>
              </div>

              <div className="mb-6">
                <button
                  onClick={() => addToCart(book)}
                  className="w-full rounded-lg bg-[#A66858] px-8 py-3 font-medium text-white transition-colors hover:bg-[#8B5647] sm:w-auto"
                >
                  Add to Cart
                </button>
              </div>
            </div>
          </div>

          <div className="mt-8 grid grid-cols-2 gap-4 border-t border-gray-200 pt-8 md:grid-cols-4">
            <div className="text-center">
              <p className="mb-1 text-sm text-gray-500">Pages</p>
              <p className="font-semibold text-gray-900">{book.pages}</p>
            </div>
            <div className="text-center">
              <p className="mb-1 text-sm text-gray-500">Language</p>
              <p className="font-semibold text-gray-900">{book.language}</p>
            </div>
            <div className="text-center">
              <p className="mb-1 text-sm text-gray-500">Publisher</p>
              <p className="font-semibold text-gray-900">{book.publisher}</p>
            </div>
            <div className="text-center">
              <p className="mb-1 text-sm text-gray-500">Format</p>
              <p className="font-semibold text-gray-900">{book.format}</p>
            </div>
          </div>
        </div>

        <div className="rounded-lg bg-white p-6 shadow-sm md:p-8">
          <div className="mb-6 flex items-center justify-between">
            <h2 className="text-2xl font-bold text-gray-900">
              Customer Reviews
            </h2>
            <button
              onClick={() => setIsWritingReview(true)}
              className="rounded-lg bg-[#A66858] px-4 py-2 text-white transition-colors hover:bg-[#8B5647]"
            >
              Write a Review
            </button>
          </div>

          {isWritingReview && (
            <WriteReviewForm onClose={() => setIsWritingReview(false)} />
          )}

          <ReviewSection reviews={reviews} totalReviews={book.totalRatings} />
        </div>
      </div>

      <Footer />
    </div>
  );
}

import { useState } from "react";
import { Rating } from "@mui/material";
import NavBar from "../components/HomeComponents/NavBar";
import Footer from "../components/HomeComponents/Footer";
import { bookData } from "../mock-data/bookData";
import { reviewData } from "../mock-data/reviewData";

const currentUser = { name: "You" };

function HeartIcon({ filled }) {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill={filled ? "#A66858" : "none"}
      stroke={filled ? "#A66858" : "currentColor"}
      strokeWidth="2"
    >
      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
    </svg>
  );
}

function Avatar({ name }) {
  return (
    <div
      className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 text-sm font-semibold"
      style={{ backgroundColor: "#EEE1DB", color: "#A66858" }}
    >
      {name.charAt(0)}
    </div>
  );
}

function WriteReviewForm({ onSubmit }) {
  const [rating, setRating] = useState(0);
  const [text, setText] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  function handleSubmit(e) {
    e.preventDefault();
    if (rating === 0) {
      setError("Please select a star rating.");
      return;
    }
    if (text.trim().length < 5) {
      setError("Please write at least a short review.");
      return;
    }
    setError("");
    onSubmit({ rating, text: text.trim() });
    setSubmitted(true);
    setRating(0);
    setText("");
    setTimeout(() => setSubmitted(false), 3000);
  }

  return (
    <div className="bg-white rounded-2xl px-6 py-6 shadow-sm">
      <h3
        className="text-base font-bold text-center mb-4 font-['Playfair_Display']"
        style={{ color: "#2c1810" }}
      >
        Write a Review
      </h3>
      {submitted ? (
        <div className="text-center py-4" style={{ color: "#5c8a5c" }}>
          <p className="font-semibold">Thank you for your review!</p>
          <p className="text-sm mt-1 opacity-75">
            Your review has been posted.
          </p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex justify-center">
            <Rating
              value={rating}
              onChange={(event, newValue) => setRating(newValue)}
              precision={0.5}
              size="large"
              sx={{
                "& .MuiRating-iconFilled": {
                  color: "#FFC107",
                },
                "& .MuiRating-iconHover": {
                  color: "#FFC107",
                },
              }}
            />
          </div>
          <textarea
            value={text}
            onChange={(e) => {
              setText(e.target.value);
              setError("");
            }}
            placeholder="Write your review here..."
            rows={4}
            className="w-full px-4 py-3 text-sm rounded-xl border resize-none outline-none transition-colors"
            style={{
              borderColor: "#d4c4b4",
              color: "#2c1810",
              backgroundColor: "#faf7f4",
            }}
            onFocus={(e) => (e.target.style.borderColor = "#A66858")}
            onBlur={(e) => (e.target.style.borderColor = "#d4c4b4")}
          />
          {error && (
            <p className="text-xs text-center" style={{ color: "#c0392b" }}>
              {error}
            </p>
          )}
          <div className="flex justify-center">
            <button
              type="submit"
              className="px-10 py-2.5 rounded-full text-white text-sm font-semibold transition-opacity hover:opacity-90"
              style={{ backgroundColor: "#A66858" }}
            >
              Submit Review
            </button>
          </div>
        </form>
      )}
    </div>
  );
}

function formatDate(date) {
  return new Date(date).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export default function BookDetail() {
  // const { id } = useParams();
  const [liked, setLiked] = useState(false);
  const [cartAdded, setCartAdded] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // ดึงข้อมูลหนังสือจาก mock-data (ใช้หนังสือเล่มแรกสำหรับทดสอบ)
  const book = bookData[0]; // Atomic Habits

  // ดึง reviews ของหนังสือเล่มนี้
  const initialReviews = reviewData
    .filter((r) => r.book_id === book.id)
    .map((r) => ({
      id: r.id,
      name: r.customer_name,
      date: formatDate(r.created_at),
      rating: r.rating,
      text: r.review,
    }));

  const [reviews, setReviews] = useState(initialReviews);

  function handleAddToCart() {
    setCartAdded(true);
    setTimeout(() => setCartAdded(false), 2000);
  }

  function handleSubmitReview({ rating, text }) {
    const newReview = {
      id: Date.now(),
      name: currentUser.name,
      date: formatDate(new Date()),
      rating,
      text,
    };
    setReviews((prev) => [newReview, ...prev]);
  }

  // สร้าง description ถ้าไม่มี
  const description =
    book.description ||
    `Discover "${book.name}" by ${book.author}, a captivating ${book.category} book published by ${book.publisher}. This ${book.pages}-page masterpiece in ${book.language} offers readers an unforgettable journey through its compelling narrative and insightful perspectives.`;

  return (
    <div
      className="min-h-screen flex flex-col"
      style={{ backgroundColor: "#FAF4F1" }}
    >
      <NavBar />
      <main className="flex-1 max-w-5xl mx-auto w-full px-6 py-8 space-y-5">
        {/* Book card */}
        <div className="bg-white rounded-2xl p-7 shadow-sm">
          <div className="flex gap-8">
            {/* Cover */}
            <div className="flex flex-col items-center gap-4 flex-shrink-0">
              <div className="w-48 h-64 rounded-lg overflow-hidden shadow-md">
                {book.img ? (
                  <img
                    src={book.img}
                    alt={book.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div
                    className="w-full h-full flex items-center justify-center"
                    style={{ backgroundColor: "#1e3a8a" }}
                  >
                    <span className="text-white text-center font-bold text-base px-4 leading-snug">
                      {book.name}
                    </span>
                  </div>
                )}
              </div>
              <button
                onClick={() => setLiked((l) => !l)}
                className="flex items-center gap-2 px-8 py-2 rounded-full border text-sm transition-colors"
                style={{
                  borderColor: liked ? "#A66858" : "#d4c4b4",
                  color: liked ? "#A66858" : "#8b7355",
                  backgroundColor: "transparent",
                }}
              >
                <HeartIcon filled={liked} />
                Like
              </button>
            </div>

            {/* Info */}
            <div className="flex-1 min-w-0">
              <span
                className="inline-block text-xs px-3 py-1 rounded-full mb-3"
                style={{ backgroundColor: "#EEE1DB", color: "#A66858" }}
              >
                {book.category}
              </span>
              <h1
                className="text-2xl font-bold mb-0.5 font-['Playfair_Display']"
                style={{ color: "#2c1810" }}
              >
                {book.name}
              </h1>
              <p className="text-sm mb-3" style={{ color: "#8b7355" }}>
                by {book.author}
              </p>
              <div className="flex items-center gap-2 mb-4">
                <Rating
                  value={book.rating}
                  precision={0.1}
                  readOnly
                  sx={{
                    "& .MuiRating-iconFilled": {
                      color: "#FFC107",
                    },
                  }}
                />
                <span
                  className="text-sm font-semibold"
                  style={{ color: "#2c1810" }}
                >
                  {book.rating.toFixed(1)}
                </span>
              </div>
              <p
                className="text-sm leading-relaxed mb-5"
                style={{ color: "#4a3728", lineHeight: "1.75" }}
              >
                {description}
              </p>
              <p
                className="text-3xl font-bold mb-4 font-['Playfair_Display']"
                style={{ color: "#A66858" }}
              >
                {book.price.toLocaleString("th-TH", {
                  minimumFractionDigits: 2,
                })}{" "}
                THB
              </p>
              <button
                onClick={handleAddToCart}
                className="w-full py-3 rounded-xl text-white font-semibold text-sm transition-all hover:opacity-80"
                style={{ backgroundColor: cartAdded ? "#8B5A3C" : "#A66858" }}
              >
                {cartAdded ? "Added to Cart!" : "Add to Cart"}
              </button>
            </div>
          </div>
        </div>

        {/* Book metadata */}
        <div className="bg-white rounded-2xl px-6 py-5 shadow-sm">
          <div className="flex divide-x divide-gray-200">
            <div className="flex-1 flex flex-col items-center gap-1">
              <span className="text-xs" style={{ color: "#9b8b7a" }}>
                Pages
              </span>
              <span className="font-bold text-sm" style={{ color: "#2c1810" }}>
                {book.pages}
              </span>
            </div>
            <div className="flex-1 flex flex-col items-center gap-1">
              <span className="text-xs" style={{ color: "#9b8b7a" }}>
                Language
              </span>
              <span className="font-bold text-sm" style={{ color: "#2c1810" }}>
                {book.language}
              </span>
            </div>
            <div className="flex-1 flex flex-col items-center gap-1">
              <span className="text-xs" style={{ color: "#9b8b7a" }}>
                Publisher
              </span>
              <span className="font-bold text-sm" style={{ color: "#2c1810" }}>
                {book.publisher}
              </span>
            </div>
          </div>
        </div>

        {/* Review section — login prompt OR write form */}
        {isLoggedIn ? (
          <WriteReviewForm onSubmit={handleSubmitReview} />
        ) : (
          <div
            className="rounded-2xl px-6 py-4 text-center text-sm"
            style={{
              border: "1.5px dashed #A66858",
              backgroundColor: "#faf7f4",
              color: "#A66858",
            }}
          >
            <button
              className="underline hover:opacity-80"
              onClick={() => setIsLoggedIn(true)}
            >
              Please log in
            </button>{" "}
            to write a review for this book.
          </div>
        )}

        {/* Customer Reviews */}
        <section>
          <h2
            className="text-lg font-bold mb-4 font-['Playfair_Display']"
            style={{ color: "#2c1810" }}
          >
            Customer Reviews
          </h2>
          <div className="space-y-3">
            {reviews.length > 0 ? (
              reviews.map((review) => (
                <div
                  key={review.id}
                  className="bg-white rounded-2xl px-5 py-4 shadow-sm"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-start gap-3">
                      <Avatar name={review.name} />
                      <div>
                        <p
                          className="font-bold text-sm"
                          style={{ color: "#2c1810" }}
                        >
                          {review.name}
                        </p>
                        <p
                          className="text-xs mt-0.5"
                          style={{ color: "#9b8b7a" }}
                        >
                          {review.date}
                        </p>
                      </div>
                    </div>
                    <Rating
                      value={review.rating}
                      precision={0.5}
                      readOnly
                      size="small"
                      sx={{
                        "& .MuiRating-iconFilled": {
                          color: "#FFC107",
                        },
                      }}
                    />
                  </div>
                  <p
                    className="mt-3 text-sm leading-relaxed"
                    style={{ color: "#4a3728" }}
                  >
                    {review.text}
                  </p>
                </div>
              ))
            ) : (
              <div className="bg-white rounded-2xl px-5 py-8 shadow-sm text-center">
                <p className="text-sm" style={{ color: "#9b8b7a" }}>
                  No reviews yet. Be the first to review this book!
                </p>
              </div>
            )}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}

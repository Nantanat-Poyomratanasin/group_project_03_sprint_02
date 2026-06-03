import { useState, useEffect, useCallback } from "react";
import { useParams, Navigate, useNavigate } from "react-router-dom";
import { Rating } from "@mui/material";
import NavBar from "../components/HomeComponents/NavBar";
import Footer from "../components/HomeComponents/Footer";
import { apiFetch } from "../lib/api";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";


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

function WriteReviewForm({ onSubmit, isSubmitting }) {
  const [rating, setRating] = useState(0);
  const [text, setText] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e) {
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
    try {
      await onSubmit({ rating, text: text.trim() });
      setSubmitted(true);
      setRating(0);
      setText("");
      setTimeout(() => setSubmitted(false), 3000);
    } catch (err) {
      setError(err.message || "Failed to submit review.");
    }
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
              onChange={(_, newValue) => setRating(newValue)}
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
              disabled={isSubmitting}
              className="px-10 py-2.5 rounded-full text-white text-sm font-semibold transition-opacity hover:opacity-90 disabled:opacity-50"
              style={{ backgroundColor: "#A66858" }}
            >
              {isSubmitting ? "Submitting..." : "Submit Review"}
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

// แปลง price ที่อาจเป็น MongoDB Decimal128 เป็น number
function parsePrice(price) {
  if (price == null) return 0;
  if (typeof price === "number") return price;
  if (typeof price === "object" && price.$numberDecimal) {
    return parseFloat(price.$numberDecimal);
  }
  return parseFloat(price) || 0;
}

export default function BookDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, isLoggedIn, isLoading: authLoading } = useAuth();
  const { addToCart } = useCart();

  // Book state
  const [book, setBook] = useState(null);
  const [bookLoading, setBookLoading] = useState(true);
  const [bookError, setBookError] = useState(null);

  // Reviews state
  const [reviews, setReviews] = useState([]);
  const [reviewsLoading, setReviewsLoading] = useState(true);
  const [reviewSubmitting, setReviewSubmitting] = useState(false);

  // Favorite state
  const [liked, setLiked] = useState(false);
  const [favoriteLoading, setFavoriteLoading] = useState(false);

  // Cart state
  const [cartAdded, setCartAdded] = useState(false);

  // ---------- โหลดหนังสือ 1 เล่ม (API first, fallback mock) ----------
  useEffect(() => {
    let cancelled = false;

    async function fetchBook() {
      setBookLoading(true);
      setBookError(null);
      try {
        const data = await apiFetch(`/producsts/${id}`);
        if (!cancelled) {
          setBook(data.data || data);
        }
      } catch (err) {
        if (!cancelled) {
          setBookError(err.message || "Book not found");
        }
      } finally {
        if (!cancelled) setBookLoading(false);
      }
    }

    fetchBook();
    return () => {
      cancelled = true;
    };
  }, [id]);

  // ---------- โหลด reviews (API first, fallback mock) ----------
  useEffect(() => {
    let cancelled = false;

    async function fetchReviews() {
      setReviewsLoading(true);
      try {
        const data = await apiFetch(`/reviews/${id}`);
        // backend ตอบ review list ใน field "message"
        const reviewList = data.message || data.data || [];
        if (!cancelled) {
          setReviews(
            reviewList.map((r) => ({
              id: r._id,
              name: r.user_id?.username || "Anonymous",
              date: formatDate(r.createdAt),
              rating: Number(r.rating) || 0,
              text: r.review,
            }))
          );
        }
      } catch (err) {
        console.error("Failed to fetch reviews:", err);
        if (!cancelled) {
          setReviews([]);
        }
      } finally {
        if (!cancelled) setReviewsLoading(false);
      }
    }

    fetchReviews();
    return () => {
      cancelled = true;
    };
  }, [id]);

  // ---------- เช็ค favorite ถ้า login แล้ว ----------
  useEffect(() => {
    if (!isLoggedIn || authLoading) return;
    let cancelled = false;

    async function checkFavorite() {
      try {
        const data = await apiFetch("/favorites");
        const items = data.data?.favorite_items || [];
        if (!cancelled) {
          setLiked(items.some((item) => item.book_id === id));
        }
      } catch {
        // 404 = ยังไม่เคยมี favorite document
        if (!cancelled) setLiked(false);
      }
    }

    checkFavorite();
    return () => {
      cancelled = true;
    };
  }, [id, isLoggedIn, authLoading]);

  // ---------- toggle favorite ----------
  const handleToggleLike = useCallback(async () => {
    if (!isLoggedIn) {
      navigate("/login");
      return;
    }
    setFavoriteLoading(true);
    try {
      await apiFetch(`/favorites/${id}`, { method: "POST" });
      setLiked((prev) => !prev);
    } catch (err) {
      console.error("Favorite toggle failed:", err.message);
    } finally {
      setFavoriteLoading(false);
    }
  }, [id, isLoggedIn, navigate]);

  // ---------- add to cart ----------
  const handleAddToCart = useCallback(async () => {
    if (!isLoggedIn) {
      navigate("/login");
      return;
    }

    const price = parsePrice(book?.price);

    try {
      await apiFetch("/cart", {
        method: "POST",
        body: {
          user_id: user._id,
          total_amount: price,
          status: "active",
          cart_item: [
            {
              book_id: book._id,
              book_name: book.book_name,
              author: book.author,
              quantity: 1,
              price: price,
              img_link: book.img_link,
            },
          ],
        },
      });

      // update local CartContext ให้ badge navbar เพิ่มทันที
      addToCart({
        id: book._id,
        name: book.book_name,
        author: book.author,
        price: price,
        img: book.img_link,
      });

      setCartAdded(true);
      setTimeout(() => setCartAdded(false), 2000);
    } catch (err) {
      console.error("Add to cart failed:", err.message);
    }
  }, [book, user, isLoggedIn, navigate, addToCart]);

  // ---------- submit review ----------
  async function handleSubmitReview({ rating, text }) {
    setReviewSubmitting(true);
    try {
      await apiFetch("/reviews", {
        method: "POST",
        body: {
          rating,
          review: text,
          user_id: user._id,
          book_id: id,
        },
      });

      // เพิ่ม review ใหม่ลง list ทันทีโดยไม่ต้อง refetch
      const newReview = {
        id: Date.now(),
        name: user.username || "You",
        date: formatDate(new Date()),
        rating,
        text,
      };
      setReviews((prev) => [newReview, ...prev]);
    } finally {
      setReviewSubmitting(false);
    }
  }

  // ---------- Loading / Error states ----------
  if (bookLoading || authLoading) {
    return (
      <div
        className="min-h-screen flex flex-col"
        style={{ backgroundColor: "#FAF4F1" }}
      >
        <NavBar />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center space-y-3">
            <div
              className="w-10 h-10 border-3 border-t-transparent rounded-full animate-spin mx-auto"
              style={{ borderColor: "#A66858", borderTopColor: "transparent" }}
            />
            <p className="text-sm" style={{ color: "#8b7355" }}>
              Loading book details...
            </p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (bookError || !book) {
    return <Navigate to="/" replace />;
  }

  // ---------- แปลงค่าที่อาจเป็น format แปลก ----------
  const rating = Number(book.rating) || 0;
  const price = parsePrice(book.price);

  // สร้าง description ถ้าไม่มี
  const description =
    book.description ||
    `Discover "${book.book_name}" by ${book.author}, a captivating ${book.category} book published by ${book.publisher}. This ${book.page}-page masterpiece in ${book.language} offers readers an unforgettable journey through its compelling narrative and insightful perspectives.`;

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
            <div className="flex flex-col items-center gap-4 shrink-0">
              <div className="w-48 h-64 rounded-lg overflow-hidden shadow-md">
                {book.img_link ? (
                  <img
                    src={book.img_link}
                    alt={book.book_name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div
                    className="w-full h-full flex items-center justify-center"
                    style={{ backgroundColor: "#1e3a8a" }}
                  >
                    <span className="text-white text-center font-bold text-base px-4 leading-snug">
                      {book.book_name}
                    </span>
                  </div>
                )}
              </div>
              <button
                onClick={handleToggleLike}
                disabled={favoriteLoading}
                className="flex items-center gap-2 px-8 py-2 rounded-full border text-sm transition-colors disabled:opacity-50"
                style={{
                  borderColor: liked ? "#A66858" : "#d4c4b4",
                  color: liked ? "#A66858" : "#8b7355",
                  backgroundColor: "transparent",
                }}
              >
                <HeartIcon filled={liked} />
                {liked ? "Liked" : "Like"}
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
                {book.book_name}
              </h1>
              <p className="text-sm mb-3" style={{ color: "#8b7355" }}>
                by {book.author}
              </p>
              <div className="flex items-center gap-2 mb-4">
                <Rating
                  value={rating}
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
                  {rating.toFixed(1)}
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
                {price.toLocaleString("th-TH", {
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
                {book.page || "—"}
              </span>
            </div>
            <div className="flex-1 flex flex-col items-center gap-1">
              <span className="text-xs" style={{ color: "#9b8b7a" }}>
                Language
              </span>
              <span className="font-bold text-sm" style={{ color: "#2c1810" }}>
                {book.language || "—"}
              </span>
            </div>
            <div className="flex-1 flex flex-col items-center gap-1">
              <span className="text-xs" style={{ color: "#9b8b7a" }}>
                Publisher
              </span>
              <span className="font-bold text-sm" style={{ color: "#2c1810" }}>
                {book.publisher || "—"}
              </span>
            </div>
          </div>
        </div>

        {/* Review section — login prompt OR write form */}
        {isLoggedIn ? (
          <WriteReviewForm
            onSubmit={handleSubmitReview}
            isSubmitting={reviewSubmitting}
          />
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
              onClick={() => navigate("/login")}
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
            {reviewsLoading ? (
              <div className="bg-white rounded-2xl px-5 py-8 shadow-sm text-center">
                <p className="text-sm" style={{ color: "#9b8b7a" }}>
                  Loading reviews...
                </p>
              </div>
            ) : reviews.length > 0 ? (
              reviews.map((review) => (
                <div
                  key={review.id}
                  className="bg-white rounded-2xl px-5 py-4 shadow-sm"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-start gap-3">
                      <Avatar name={review.name} />
                      <div className="shrink-0">
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

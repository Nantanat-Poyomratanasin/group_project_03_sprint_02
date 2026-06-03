import { useEffect, useMemo, useState } from "react"
import { useNavigate } from "react-router-dom"
import { ArrowLeft, CheckCircle2, Ticket } from "lucide-react"
import NavBar from "../components/HomeComponents/NavBar"
import Footer from "../components/HomeComponents/Footer"
import { useCart } from "../context/CartContext"

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? "http://localhost:5000/api"
const SHIPPING = 50

function toNumber(value) {
  if (value == null) return 0
  if (typeof value === "number") return value
  if (typeof value === "object" && "$numberDecimal" in value) {
    return Number(value.$numberDecimal)
  }
  return Number(value) || 0
}

function normalizeCartItem(item) {
  return {
    id: item.book_id?._id ?? item.book_id ?? item.id,
    name: item.book_name ?? item.name,
    author: item.author ?? "",
    price: toNumber(item.price),
    img: item.img_link ?? item.img,
    quantity: Number(item.quantity) || 1,
    isDiscount: Boolean(item.isDiscount),
    discountPercent: Number(item.discountPercent) || 0,
  }
}

async function apiRequest(path, options = {}) {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      ...(options.headers ?? {}),
    },
    ...options,
  })

  const payload = await response.json().catch(() => ({}))

  if (!response.ok || payload.success === false) {
    throw new Error(payload.message || payload.error || "Request failed")
  }

  return payload
}

function ProcessingView() {
  return (
    <div className="min-h-screen bg-[#f4ece3] flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div className="w-14 h-14 border-4 border-[#A66858] border-t-transparent rounded-full animate-spin" />
        <h2 className="text-xl font-bold font-['Playfair_Display'] text-[#2F241F] mt-2">
          Processing Your Order...
        </h2>
        <p className="text-[#7D6A62] font-['Cormorant_Garamond'] text-lg">
          Verifying cart, coupon, and payment details.
        </p>
      </div>
    </div>
  )
}

function SuccessView({ orderNumber, totalPaid, onReturnToShop }) {
  return (
    <div className="min-h-screen bg-[#f4ece3] flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl p-10 max-w-md w-full text-center shadow-md">
        <div className="flex justify-center mb-5">
          <CheckCircle2 className="w-16 h-16 text-green-500" strokeWidth={1.5} />
        </div>
        <h2 className="text-2xl font-bold font-['Playfair_Display'] text-[#2F241F] mb-2">
          Payment Successful!
        </h2>
        <p className="text-[#7D6A62] font-['Cormorant_Garamond'] text-lg mb-7">
          Your order has been placed. We&apos;ve sent a confirmation email to you.
        </p>

        <div className="bg-[#f4ece3] rounded-xl p-4 mb-7 text-left space-y-0">
          <div className="flex justify-between py-3 border-b border-[#E5D8D0]">
            <span className="text-xs font-semibold text-[#7D6A62] tracking-widest">
              ORDER NUMBER
            </span>
            <span className="text-sm font-bold text-[#2F241F]">{orderNumber}</span>
          </div>
          <div className="flex justify-between py-3">
            <span className="text-xs font-semibold text-[#7D6A62] tracking-widest">
              TOTAL PAID
            </span>
            <span className="text-sm font-bold text-[#A66858]">
              {totalPaid.toFixed(2)} THB
            </span>
          </div>
        </div>

        <button
          onClick={onReturnToShop}
          className="w-full bg-[#A66858] hover:bg-[#8B5A4A] text-white font-bold py-3.5 px-6 rounded-xl transition-colors font-['Playfair_Display'] cursor-pointer"
        >
          Return to Shop
        </button>
      </div>
    </div>
  )
}

export default function PaymentPage({ onBackToHome }) {
  const navigate = useNavigate()
  const { clearCart } = useCart()

  const [cartItems, setCartItems] = useState([])
  const [cartIds, setCartIds] = useState([])
  const [isLoadingCart, setIsLoadingCart] = useState(true)
  const [cartError, setCartError] = useState("")

  const [couponInput, setCouponInput] = useState("")
  const [appliedCoupon, setAppliedCoupon] = useState(null)
  const [couponError, setCouponError] = useState("")
  const [isApplyingCoupon, setIsApplyingCoupon] = useState(false)

  const [view, setView] = useState("payment")
  const [orderNumber, setOrderNumber] = useState("")
  const [finalTotal, setFinalTotal] = useState(0)
  const [paymentError, setPaymentError] = useState("")

  const totalPrice = useMemo(
    () => cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0),
    [cartItems],
  )
  const discount = appliedCoupon?.discountAmount ?? 0
  const total = Math.max(totalPrice + SHIPPING - discount, 0)

  function handleReturnToShop() {
    if (onBackToHome) {
      onBackToHome()
      return
    }

    navigate("/")
  }

  useEffect(() => {
    let ignore = false

    async function fetchCartFromDatabase() {
      setIsLoadingCart(true)
      setCartError("")

      try {
        const profilePayload = await apiRequest("/users/auth/me")
        const userId =
          profilePayload.data?._id ?? profilePayload.user?._id ?? profilePayload._id

        if (!userId) {
          throw new Error("User session was found, but user id is missing.")
        }

        const cartPayload = await apiRequest(`/cart/${userId}`)
        const cartDocs = Array.isArray(cartPayload.data) ? cartPayload.data : []
        const nextCartItems = cartDocs.flatMap((cart) =>
          Array.isArray(cart.cart_item) ? cart.cart_item.map(normalizeCartItem) : [],
        )

        if (!ignore) {
          setCartIds(cartDocs.map((cart) => cart._id).filter(Boolean))
          setCartItems(nextCartItems)
        }
      } catch (error) {
        if (!ignore) {
          setCartError(error.message)
          setCartItems([])
          setCartIds([])
        }
      } finally {
        if (!ignore) {
          setIsLoadingCart(false)
        }
      }
    }

    fetchCartFromDatabase()

    return () => {
      ignore = true
    }
  }, [])

  async function handleApplyCoupon() {
    setAppliedCoupon(null)
    setCouponError("")

    const code = couponInput.trim()
    if (!code) return

    if (totalPrice <= 0) {
      setCouponError("Your cart is empty.")
      return
    }

    setIsApplyingCoupon(true)

    try {
      const payload = await apiRequest("/coupons/validate", {
        method: "POST",
        body: JSON.stringify({
          code,
          orderAmount: totalPrice,
        }),
      })

      setAppliedCoupon({
        code: code.toUpperCase(),
        ...payload.data,
      })
    } catch (error) {
      setCouponError(error.message)
    } finally {
      setIsApplyingCoupon(false)
    }
  }

  function handleCouponInputChange(e) {
    setCouponInput(e.target.value)
    setAppliedCoupon(null)
    setCouponError("")
  }

  async function handlePayNow() {
    setPaymentError("")

    if (cartItems.length === 0) {
      setPaymentError("Your cart is empty.")
      return
    }

    setView("processing")

    try {
      const payload = await apiRequest("/orders", {
        method: "POST",
        body: JSON.stringify({
          total_amount: total,
          status: "paid",
          order_item: cartItems.map((item) => ({
            book_id: item.id,
            book_name: item.name,
            author: item.author,
            quantity: item.quantity,
            price: item.price,
            img_link: item.img,
            isDiscount: item.isDiscount,
            discountPercent: item.discountPercent,
          })),
        }),
      })

      await Promise.allSettled(cartIds.map((cartId) => apiRequest(`/cart/${cartId}`, { method: "DELETE" })))

      clearCart()
      setOrderNumber(payload.data?._id ?? "Order created")
      setFinalTotal(total)
      setView("success")
    } catch (error) {
      setPaymentError(error.message)
      setView("payment")
    }
  }

  if (view === "processing") return <ProcessingView />

  if (view === "success") {
    return (
      <SuccessView
        orderNumber={orderNumber}
        totalPaid={finalTotal}
        onReturnToShop={handleReturnToShop}
      />
    )
  }

  return (
    <div className="min-h-screen bg-[#f4ece3] flex flex-col">
      <NavBar />

      <main className="flex-1 max-w-5xl mx-auto w-full px-4 py-8">
        <button
          onClick={handleReturnToShop}
          className="flex items-center gap-1.5 text-[#A66858] hover:underline mb-8 font-['Cormorant_Garamond'] text-base cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Home
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
          <div className="bg-white rounded-2xl p-7 shadow-sm">
            <h2 className="text-xl font-bold font-['Playfair_Display'] text-[#2F241F] mb-5 flex items-center gap-2">
              <Ticket className="w-5 h-5 text-[#A66858]" />
              Have a Coupon?
            </h2>

            <div className="flex gap-3">
              <input
                type="text"
                value={couponInput}
                onChange={handleCouponInputChange}
                onKeyDown={(e) => e.key === "Enter" && handleApplyCoupon()}
                placeholder="e.g. READ50, WELCOME10"
                className="flex-1 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#A66858] font-['Cormorant_Garamond'] text-base"
              />
              <button
                onClick={handleApplyCoupon}
                disabled={isApplyingCoupon || isLoadingCart || cartItems.length === 0}
                className="bg-[#2F241F] hover:bg-[#3A2F2A] disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold px-6 py-3 rounded-xl transition-colors font-['Playfair_Display'] cursor-pointer whitespace-nowrap"
              >
                {isApplyingCoupon ? "Applying..." : "Apply"}
              </button>
            </div>

            {appliedCoupon && (
              <p className="text-green-600 text-sm mt-3 font-['Cormorant_Garamond'] text-base">
                Coupon &quot;{appliedCoupon.code}&quot; applied. You saved{" "}
                {discount.toFixed(2)} THB.
              </p>
            )}
            {couponError && (
              <p className="text-red-500 text-sm mt-3 font-['Cormorant_Garamond'] text-base">
                {couponError}
              </p>
            )}
          </div>

          <div className="bg-white rounded-2xl p-7 shadow-sm">
            <h2 className="text-xl font-bold font-['Playfair_Display'] text-[#2F241F] mb-5">
              Order Summary
            </h2>

            {isLoadingCart ? (
              <p className="text-[#7D6A62] font-['Cormorant_Garamond'] text-base mb-4">
                Loading your cart...
              </p>
            ) : cartError ? (
              <p className="text-red-500 font-['Cormorant_Garamond'] text-base mb-4">
                {cartError}
              </p>
            ) : cartItems.length === 0 ? (
              <p className="text-[#7D6A62] font-['Cormorant_Garamond'] text-base mb-4">
                Your cart is empty.
              </p>
            ) : (
              <div className="space-y-4 mb-5">
                {cartItems.map((item) => (
                  <div key={item.id} className="flex gap-3 items-center">
                    <img
                      src={item.img}
                      alt={item.name}
                      className="w-12 h-16 object-cover rounded-lg flex-shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-[#2F241F] line-clamp-2 font-['Playfair_Display'] leading-tight">
                        {item.name}
                      </p>
                      <p className="text-xs text-[#7D6A62] font-['Cormorant_Garamond'] mt-0.5">
                        Qty: {item.quantity}
                      </p>
                    </div>
                    <p className="text-sm font-bold text-[#2F241F] font-['Cormorant_Garamond'] flex-shrink-0">
                      {(item.price * item.quantity).toFixed(2)} THB
                    </p>
                  </div>
                ))}
              </div>
            )}

            <hr className="border-[#E5D8D0] mb-4" />

            <div className="space-y-2 mb-4 font-['Cormorant_Garamond'] text-base">
              <div className="flex justify-between text-[#7D6A62]">
                <span>Subtotal</span>
                <span>{totalPrice.toFixed(2)} THB</span>
              </div>
              {appliedCoupon && (
                <div className="flex justify-between text-green-600">
                  <span>Discount ({appliedCoupon.code})</span>
                  <span>-{discount.toFixed(2)} THB</span>
                </div>
              )}
              <div className="flex justify-between text-[#7D6A62]">
                <span>Shipping</span>
                <span>{SHIPPING.toFixed(2)} THB</span>
              </div>
            </div>

            <hr className="border-[#E5D8D0] mb-5" />

            <div className="flex justify-between font-bold text-lg text-[#2F241F] font-['Playfair_Display'] mb-6">
              <span>Total</span>
              <span>{total.toFixed(2)} THB</span>
            </div>

            {paymentError && (
              <p className="text-red-500 text-sm mb-4 font-['Cormorant_Garamond'] text-base">
                {paymentError}
              </p>
            )}

            <button
              onClick={handlePayNow}
              disabled={isLoadingCart || cartItems.length === 0 || Boolean(cartError)}
              className="w-full bg-[#A66858] hover:bg-[#8B5A4A] disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold py-3.5 px-6 rounded-xl transition-colors font-['Playfair_Display'] cursor-pointer"
            >
              Confirm &amp; Pay
            </button>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}

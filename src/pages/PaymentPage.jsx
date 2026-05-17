import { useEffect, useState } from "react"
import { ArrowLeft, CheckCircle2, Ticket } from "lucide-react"
import NavBar from "../components/HomeComponents/NavBar"
import Footer from "../components/HomeComponents/Footer"
import { useCart } from "../context/CartContext"
import { coupons } from "../mock-data/couponData"

const SHIPPING = 50

// ─── handleApplyCoupon (POST /coupons/validate → validateCoupon) ───────────────
function validateCoupon(code) {
  return coupons.find((c) => c.code.toUpperCase() === code.trim().toUpperCase()) ?? null
}

// ─── Generate order number (matches format ORD-YYYYMMDD-XXXXXX) ────────────────
function createOrder() {
  const dateStr = new Date().toISOString().slice(0, 10).replace(/-/g, "")
  const randomPart = Math.random().toString(16).slice(2, 8).toUpperCase()
  return `ORD-${dateStr}-${randomPart}`
}

// ─── Processing view ─────────────────────────────────────────────────────────── 
function ProcessingView() {
  return (
    <div className="min-h-screen bg-[#f4ece3] flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div className="w-14 h-14 border-4 border-[#A66858] border-t-transparent rounded-full animate-spin" />
        <h2 className="text-xl font-bold font-['Playfair_Display'] text-[#2F241F] mt-2">
          Processing Your Order...
        </h2>
        <p className="text-[#7D6A62] font-['Cormorant_Garamond'] text-lg">
          Verifying payment with your bank.
        </p>
      </div>
    </div>
  )
}

// ─── Success view ──────────────────────────────────────────────────────────────
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

// ─── Main PaymentPage ──────────────────────────────────────────────────────────
export default function PaymentPage({ onBackToHome }) {
  const { cartItems, totalPrice, clearCart } = useCart()

  const [couponInput, setCouponInput] = useState("")
  const [appliedCoupon, setAppliedCoupon] = useState(null)
  const [couponError, setCouponError] = useState("")

  // "payment" → "processing" → "success"
  const [view, setView] = useState("payment")
  const [orderNumber, setOrderNumber] = useState("")
  const [finalTotal, setFinalTotal] = useState(0)

  const discount =
    appliedCoupon?.type === "percent"
      ? (totalPrice * appliedCoupon.discount) / 100
      : (appliedCoupon?.discount ?? 0)

  const total = totalPrice + SHIPPING - discount

  // ── handleApplyCoupon ──────────────────────────────────────────────────────
  function handleApplyCoupon() {
    setAppliedCoupon(null) // always clear previous coupon first
    setCouponError("")

    if (!couponInput.trim()) return

    const found = validateCoupon(couponInput)
    if (found) {
      setAppliedCoupon(found)
    } else {
      setCouponError("Coupon not found. Please check the code and try again.")
    }
  }

  // Clear applied coupon as soon as user edits the input field
  function handleCouponInputChange(e) {
    setCouponInput(e.target.value)
    setAppliedCoupon(null)
    setCouponError("")
  }

  // ── handlePayNow (POST /orders → createOrder) ──────────────────────────────
  function handlePayNow() {
    const orderNum = createOrder()
    setOrderNumber(orderNum)
    setFinalTotal(total)
    setView("processing")
  }

  // Switch to success after 2-second "processing" animation
  useEffect(() => {
    if (view !== "processing") return
    const timer = setTimeout(() => {
      clearCart()
      setView("success")
    }, 2000)
    return () => clearTimeout(timer)
  }, [view, clearCart])

  if (view === "processing") return <ProcessingView />

  if (view === "success")
    return (
      <SuccessView
        orderNumber={orderNumber}
        totalPaid={finalTotal}
        onReturnToShop={onBackToHome}
      />
    )

  // ── Payment view ─────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-[#f4ece3] flex flex-col">
      <NavBar />

      <main className="flex-1 max-w-5xl mx-auto w-full px-4 py-8">
        {/* Back to Home */}
        <button
          onClick={onBackToHome}
          className="flex items-center gap-1.5 text-[#A66858] hover:underline mb-8 font-['Cormorant_Garamond'] text-base cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Home
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">

          {/* ── Coupon Card ─────────────────────────────────────────────────── */}
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
                className="bg-[#2F241F] hover:bg-[#3A2F2A] text-white font-bold px-6 py-3 rounded-xl transition-colors font-['Playfair_Display'] cursor-pointer whitespace-nowrap"
              >
                Apply
              </button>
            </div>

            {appliedCoupon && (
              <p className="text-green-600 text-sm mt-3 font-['Cormorant_Garamond'] text-base">
                ✓ Coupon &quot;{appliedCoupon.code}&quot; applied — {appliedCoupon.description}
              </p>
            )}
            {couponError && (
              <p className="text-red-500 text-sm mt-3 font-['Cormorant_Garamond'] text-base">
                {couponError}
              </p>
            )}
          </div>

          {/* ── Order Summary Card ───────────────────────────────────────────── */}
          <div className="bg-white rounded-2xl p-7 shadow-sm">
            <h2 className="text-xl font-bold font-['Playfair_Display'] text-[#2F241F] mb-5">
              Order Summary
            </h2>

            {/* Cart items */}
            {cartItems.length === 0 ? (
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

            {/* Price breakdown */}
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

            <button
              onClick={handlePayNow}
              disabled={cartItems.length === 0}
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

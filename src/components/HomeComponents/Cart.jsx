
import { Minus, Plus, ShoppingCart, Trash2, X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../../context/CartContext";
import { useAuth } from "../../context/AuthContext";

function formatPrice(price) {
  const numberPrice = Number(price ?? 0);
  return `$${numberPrice.toFixed(2)}`;
}

export default function Cart() {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  const {
    cartItems,
    isCartOpen,
    removeFromCart,
    setIsCartOpen,
    totalItems,
    totalPrice,
    updateQuantity,
  } = useCart();

  // Guard rails for unauthenticated states
  const displayItems = isAuthenticated ? cartItems : [];
  const displayTotalItems = isAuthenticated ? totalItems : 0;
  const displayTotalPrice = isAuthenticated ? totalPrice : 0;



  return (
    <>
      {/* Backdrop overlay */}
      {isCartOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/20 backdrop-blur-[1px]"
          onClick={() => setIsCartOpen(false)}
        />
      )}

      {/* Cart Container Positioning */}
      <div className="fixed bottom-5 right-5 z-50 flex flex-col items-end">
        {isCartOpen && (
          <div className="mb-4 w-[calc(100vw-2rem)] max-w-[430px] rounded-[28px] border border-white/70 bg-gradient-to-br from-[#fffaf7] via-[#fff4ee] to-[#f9ebe2] p-6 shadow-[0_25px_80px_rgba(166,104,88,0.18)]">
            {/* Header */}
            <div className="mb-6 flex items-start justify-between gap-3">
              <h2 className="text-[2rem] font-semibold text-[#2F241F]">
                Your Cart
              </h2>
              <div className="flex items-center gap-3">
                <span className="rounded-full bg-[#B77B68] px-4 py-2 text-sm font-semibold text-white whitespace-nowrap">
                  {displayTotalItems}{" "}
                  {displayTotalItems === 1 ? "Item" : "Items"}
                </span>
                <button
                  onClick={() => setIsCartOpen(false)}
                  className="rounded-full p-1 text-[#6E5C54] transition hover:bg-white/70 hover:text-[#2F241F]"
                  aria-label="Close cart"
                >
                  <X size={22} />
                </button>
              </div>
            </div>

            {/* Scrollable Items List */}
            <div className="max-h-[280px] space-y-4 overflow-y-auto pr-2 custom-scrollbar">
              {displayItems.length === 0 ? (
                <div className="rounded-3xl bg-white/70 px-6 py-12 text-center text-[#7D6A62]">
                  <p className="text-lg font-medium">Your cart is empty</p>
                  <p className="mt-2 text-sm">
                    Add a few books and they will stay here after refresh.
                  </p>
                </div>
              ) : (
                displayItems.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center gap-4 rounded-[24px] bg-white/70 p-4 shadow-sm"
                  >
                    <img
                      src={item.img}
                      alt={item.name}
                      className="h-20 w-16 flex-shrink-0 rounded-xl object-cover"
                    />

                    <div className="min-w-0 flex-1">
                      <h3 className="line-clamp-2 text-base font-medium text-[#3A2F2A]">
                        {item.name}
                      </h3>
                      <p className="mt-1 truncate text-sm text-[#7D6A62]">
                        {item.author}
                      </p>
                      <p className="mt-2 text-lg font-semibold text-[#3A2F2A]">
                        {formatPrice(item.price)}
                      </p>
                    </div>

                    {/* Quantity Controls & Actions */}
                    <div className="flex flex-col items-end gap-3 flex-shrink-0">
                      <div className="flex items-center overflow-hidden rounded-xl border border-[#E9D8CF] bg-white">
                        <button
                          onClick={() =>
                            item.quantity <= 1
                              ? removeFromCart(item.id, item.cartId)
                              : updateQuantity(item.id, item.quantity - 1)
                          }
                          className="px-3 py-2 text-[#7D6A62] transition hover:bg-[#F7E4DA]"
                          aria-label={`Decrease quantity of ${item.name}`}
                        >
                          <Minus size={16} />
                        </button>
                        <span className="min-w-10 border-x border-[#E9D8CF] px-2 py-2 text-center text-sm font-medium text-[#3A2F2A]">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() =>
                            updateQuantity(item.id, item.quantity + 1)
                          }
                          className="px-3 py-2 text-[#7D6A62] transition hover:bg-[#F7E4DA]"
                          aria-label={`Increase quantity of ${item.name}`}
                        >
                          <Plus size={16} />
                        </button>
                      </div>

                      <button
                        onClick={() => removeFromCart(item.id, item.cartId)}
                        className="rounded-full p-2 text-[#8F7B73] transition hover:bg-[#F7E4DA] hover:text-[#A66858]"
                        aria-label={`Remove ${item.name} from cart`}
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Footer / Totaling */}
            <div className="mt-6 border-t border-[#E7D5CC] pt-5">
              <div className="mb-4 flex items-center justify-between text-[#3A2F2A]">
                <span className="text-2xl font-medium">Total</span>
                <span className="text-3xl font-bold">
                  {formatPrice(displayTotalPrice)}
                </span>
              </div>

              <button
                className="w-full rounded-2xl bg-[#B77B68] px-6 py-4 text-lg font-semibold text-white transition hover:bg-[#A66858] disabled:cursor-not-allowed disabled:opacity-60"
                disabled={displayItems.length === 0}
                onClick={() => {
                  setIsCartOpen(false);
                  navigate("/paymentPage");
                }}
              >
                Checkout
              </button>
            </div>
          </div>
        )}

        {/* Floating Cart Trigger Floating Action Button */}
        <button
          onClick={() => setIsCartOpen((open) => !open)}
          className="relative flex h-16 w-16 items-center justify-center rounded-full bg-[#B77B68] text-white shadow-[0_15px_35px_rgba(166,104,88,0.35)] transition hover:scale-105 hover:bg-[#A66858]"
          aria-label="Toggle cart"
        >
          <ShoppingCart size={28} />
          {displayTotalItems > 0 && (
            <span className="absolute -right-1 -top-1 flex h-7 min-w-7 items-center justify-center rounded-full bg-[#F04646] px-1 text-xs font-bold text-white">
              {displayTotalItems}
            </span>
          )}
        </button>
      </div>
    </>
  );
}

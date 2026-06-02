import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { createCart, getCartByUserId } from "../Api/CartApi";

const CART_STORAGE_KEY = "readly-cart-items";
const FALLBACK_BOOK_OBJECT_ID = "685abc123456789012345679";

const CartContext = createContext(null);

function readStoredCart() {
  if (typeof window === "undefined") {
    return [];
  }

  try {
    const storedCart = window.localStorage.getItem(CART_STORAGE_KEY);
    return storedCart ? JSON.parse(storedCart) : [];
  } catch {
    return [];
  }
}

function mapBackendCartToCartItems(cartFromBackend) {
  return cartFromBackend.flatMap((cart) =>
    cart.cart_item.map((item) => ({
      id: item.book_id,
      cartId: cart._id,
      name: item.book_name,
      author: item.author,
      price: Number(item.price),
      img: item.img_link,
      quantity: item.quantity,
    })),
  );
}

function buildCartData(book, userId) {
  return {
    user_id: userId,
    total_amount: Number(book.price),
    status: "pending",
    cart_item: [
      {
        book_id: book._id || book.book_id || FALLBACK_BOOK_OBJECT_ID,
        book_name: book.name,
        author: book.author,
        quantity: 1,
        price: Number(book.price),
        img_link: book.img,
      },
    ],
  };
}

function addBookToLocalCart(currentItems, book) {
  const existingItem = currentItems.find((item) => item.id === book.id);

  if (existingItem) {
    return currentItems.map((item) =>
      item.id === book.id ? { ...item, quantity: item.quantity + 1 } : item,
    );
  }

  return [
    ...currentItems,
    {
      id: book.id,
      name: book.name,
      author: book.author,
      price: book.price,
      img: book.img,
      quantity: 1,
    },
  ];
}

export function CartProvider({ children }) {
  const [cartItems, setCartItems] = useState(readStoredCart);
  const [isCartOpen, setIsCartOpen] = useState(false);

  useEffect(() => {
    async function loadCart() {
      const userId = localStorage.getItem("userId");

      if (!userId) {
        return;
      }

      const cartFromBackend = await getCartByUserId(userId);

      console.log(cartFromBackend);
    }

    loadCart();
  }, []);

  useEffect(() => {
    window.localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cartItems));
  }, [cartItems]);

  const addToCart = async (book) => {
    const userId = localStorage.getItem("userId");

    if (!userId) {
      console.error("Please login before adding items to cart.");
      setIsCartOpen(true);
      return;
    }

    try {
      await createCart(buildCartData(book, userId));

      const cartFromBackend = await getCartByUserId(userId);
      console.log(cartFromBackend);

      setCartItems((currentItems) => addBookToLocalCart(currentItems, book));
      setIsCartOpen(true);
    } catch (error) {
      console.error(error);
    }
  };

  const updateQuantity = (bookId, nextQuantity) => {
    if (nextQuantity <= 0) {
      setCartItems((currentItems) =>
        currentItems.filter((item) => item.id !== bookId),
      );
      return;
    }

    setCartItems((currentItems) =>
      currentItems.map((item) =>
        item.id === bookId ? { ...item, quantity: nextQuantity } : item,
      ),
    );
  };

  const removeFromCart = (bookId) => {
    setCartItems((currentItems) =>
      currentItems.filter((item) => item.id !== bookId),
    );
  };

  const clearCart = () => {
    setCartItems([]);
  };

  const totalItems = useMemo(
    () => cartItems.reduce((sum, item) => sum + item.quantity, 0),
    [cartItems],
  );

  const totalPrice = useMemo(
    () => cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0),
    [cartItems],
  );

  const value = {
    addToCart,
    cartItems,
    clearCart,
    isCartOpen,
    removeFromCart,
    setIsCartOpen,
    totalItems,
    totalPrice,
    updateQuantity,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);

  if (!context) {
    throw new Error("useCart must be used inside CartProvider");
  }

  return context;
}

import { createContext, useContext, useEffect, useMemo, useState } from "react";

import {
  createCart,
  deleteCart,
  getCartByUserId,
  updateCart,
} from "../Api/CartApi";

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

function toNumber(value) {
  if (value == null) return 0;
  if (typeof value === "number") return value;
  if (typeof value === "object" && "$numberDecimal" in value) {
    return Number(value.$numberDecimal);
  }
  return Number(value) || 0;
}

function mapBackendCartToCartItems(cartFromBackend) {
  return cartFromBackend.flatMap((cart) =>
    cart.cart_item.map((item) => ({
      id: item.book_id,
      cartId: cart._id,
      name: item.book_name,
      author: item.author,
      price: toNumber(item.price),
      img: item.img_link,
      quantity: item.quantity,
    })),
  );
}

function buildCartData(book, userId) {
  return {
    user_id: userId,
    total_amount: toNumber(book.price),
    status: "pending",
    cart_item: [
      {
        book_id: book._id || book.book_id || book.id || FALLBACK_BOOK_OBJECT_ID,
        book_name: book.name,
        author: book.author,
        quantity: 1,
        price: toNumber(book.price),
        img_link: book.img,
      },
    ],
  };
}

function mapCartItemsToBackendCartItems(items) {
  return items.map((item) => ({
    book_id: item.id,
    book_name: item.name,
    author: item.author,
    quantity: item.quantity,
    price: toNumber(item.price),
    img_link: item.img,
  }));
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
      price: toNumber(book.price),
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
      const mappedItems = mapBackendCartToCartItems(cartFromBackend);

      setCartItems(mappedItems);
      console.log(mappedItems);
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
      const mappedItems = mapBackendCartToCartItems(cartFromBackend);

      setCartItems(mappedItems);
      setIsCartOpen(true);
    } catch (error) {
      console.error(error);
    }
  };

  const updateQuantity = async (bookId, nextQuantity) => {
    const userId = localStorage.getItem("userId");

    if (!userId) {
      console.error("Please login before updating cart.");
      return;
    }

    const targetItem = cartItems.find((item) => item.id === bookId);

    if (!targetItem) {
      return;
    }

    const cartId = targetItem.cartId;

    const itemsInSameCart = cartItems.filter((item) => item.cartId === cartId);

    const nextItems = itemsInSameCart
      .map((item) =>
        item.id === bookId ? { ...item, quantity: nextQuantity } : item,
      )
      .filter((item) => item.quantity > 0);

    const totalAmount = nextItems.reduce(
      (sum, item) => sum + toNumber(item.price) * item.quantity,
      0,
    );

    try {
      await updateCart(cartId, {
        total_amount: totalAmount,
        cart_item: mapCartItemsToBackendCartItems(nextItems),
      });

      const cartFromBackend = await getCartByUserId(userId);
      const mappedItems = mapBackendCartToCartItems(cartFromBackend);

      setCartItems(mappedItems);
    } catch (error) {
      console.error(error);
    }
  };

  const removeFromCart = async (bookId, cartId) => {
    const userId = localStorage.getItem("userId");

    if (!userId) {
      console.error("Please login before removing cart items.");
      return;
    }

    const itemsInSameCart = cartItems.filter((item) => item.cartId === cartId);

    const nextItems = itemsInSameCart.filter((item) => item.id !== bookId);

    try {
      if (nextItems.length === 0) {
        await deleteCart(cartId);
      } else {
        const totalAmount = nextItems.reduce(
          (sum, item) => sum + toNumber(item.price) * item.quantity,
          0,
        );

        await updateCart(cartId, {
          total_amount: totalAmount,
          cart_item: mapCartItemsToBackendCartItems(nextItems),
        });
      }

      const cartFromBackend = await getCartByUserId(userId);
      const mappedItems = mapBackendCartToCartItems(cartFromBackend);

      setCartItems(mappedItems);
    } catch (error) {
      console.error(error);
    }
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

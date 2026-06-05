import { createContext, useContext, useEffect, useMemo, useState } from "react";

import {
  createCart,
  deleteCart,
  getCartByUserId,
  updateCart,
} from "../Api/CartApi";

import { useAuth } from "./AuthContext";

const FALLBACK_BOOK_OBJECT_ID = "685abc123456789012345679";

const CartContext = createContext(null);

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

export function CartProvider({ children }) {
  const [cartItems, setCartItems] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const { user } = useAuth();
  
  useEffect(() => {
    async function loadCart() {
      const userId = user?.id || user?._id;

      if (!userId) {
        return;
      }

      const cartFromBackend = await getCartByUserId(userId);
      const mappedItems = mapBackendCartToCartItems(cartFromBackend);

      setCartItems(mappedItems);
      console.log(mappedItems);
    }

    loadCart();
  }, [user]);

  const addToCart = async (book) => {
    const userId = user?.id || user?._id;

    if (!userId) {
      console.error("Please login before adding items to cart.");
      setIsCartOpen(true);
      return;
    }

    try {
      const cartFromBackend = await getCartByUserId(userId);

      if (cartFromBackend && cartFromBackend.length > 0) {
        const existingCart = cartFromBackend[0];
        const cartId = existingCart._id;

        const itemsInSameCart = cartItems.filter(
          (item) => item.cartId === cartId,
        );

        const bookId =
          book._id || book.book_id || book.id || FALLBACK_BOOK_OBJECT_ID;
        const existingItem = itemsInSameCart.find((item) => item.id === bookId);

        let nextItems;
        if (existingItem) {
          nextItems = itemsInSameCart.map((item) =>
            item.id === bookId
              ? { ...item, quantity: item.quantity + 1 }
              : item,
          );
        } else {
          nextItems = [
            ...itemsInSameCart,
            {
              id: bookId,
              name: book.name,
              author: book.author,
              price: toNumber(book.price),
              img: book.img,
              quantity: 1,
            },
          ];
        }

        const totalAmount = nextItems.reduce(
          (sum, item) => sum + toNumber(item.price) * item.quantity,
          0,
        );

        await updateCart(cartId, {
          total_amount: totalAmount,
          cart_item: mapCartItemsToBackendCartItems(nextItems),
        });
      } else {
        await createCart(buildCartData(book, userId));
      }

      const updatedCartFromBackend = await getCartByUserId(userId);
      const mappedItems = mapBackendCartToCartItems(updatedCartFromBackend);

      setCartItems(mappedItems);
      setIsCartOpen(true);
    } catch (error) {
      console.error("Failed to add to cart:", error);
    }
  };

  const updateQuantity = async (bookId, nextQuantity) => {
    const userId = user?.id || user?._id;

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
    const userId = user?.id || user?._id;

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

  const clearCart = async () => {
    const userId = user?.id || user?._id;

    if (!userId) {
      console.error("Please login before clearing the cart.");
      return;
    }

    try {
      const uniqueCartIds = [...new Set(cartItems.map((item) => item.cartId))];
      await Promise.all(uniqueCartIds.map((cartId) => deleteCart(cartId)));
      setCartItems([]);
    } catch (error) {
      console.error("Failed to clear cart in the database:", error);
    }
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
    setCartItems,
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

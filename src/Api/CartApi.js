const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:3000/api";

export async function createCart(cartData) {
  const response = await fetch(`${API_BASE_URL}/cart`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify(cartData),
  });

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.message || "Create cart failed");
  }

  return result.data;
}

export async function updateCart(cartId, cartData) {
  const response = await fetch(`${API_BASE_URL}/cart/${cartId}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify(cartData),
  });

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.message || "Update cart failed");
  }

  return result.data;
}

export async function deleteCart(cartId) {
  const response = await fetch(`${API_BASE_URL}/cart/${cartId}`, {
    method: "DELETE",
    credentials: "include",
  });

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.message || "Delete cart failed");
  }

  return result.data;
}

export async function getCartByUserId(userId) {
  const response = await fetch(`${API_BASE_URL}/cart/${userId}`, {
    method: "GET",
    credentials: "include",
  });

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.message || "Get cart failed");
  }

  return result.data;
}

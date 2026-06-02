const API_URL = "http://localhost:3000/api";

export async function createCart(cartData) {
  const response = await fetch(`${API_URL}/cart`, {
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

export async function getCartByUserId(userId) {
  const response = await fetch(`${API_URL}/cart/${userId}`, {
    method: "GET",
    credentials: "include",
  });

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.message || "Get cart failed");
  }

  return result.data;
}

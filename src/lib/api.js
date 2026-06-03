// ตัวกลางเรียก backend API ทุก request ของแอป
// - รวม base URL จาก env กับ path ที่ส่งเข้ามา
// - ใส่ Content-Type: application/json
// - ส่ง cookie auth ไปด้วย credentials: "include"
// - แปลง response เป็น JSON
// - throw error เมื่อ backend ตอบ status ไม่ใช่ 2xx

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:3000/api";

export async function apiFetch(path, options = {}) {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    method: options.method || "GET",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
    body: options.body ? JSON.stringify(options.body) : undefined,
  });

  const data = await response.json().catch(() => null);

  if (!response.ok) {
    throw new Error(data?.message || data?.error || "API request failed");
  }

  return data;
}

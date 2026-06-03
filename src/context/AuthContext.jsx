import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { apiFetch } from "../lib/api";

// base URL ของ backend ที่ใช้กับ auth ทั้ง login / logout / get profile
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
// key นี้ใช้เก็บ email ล่าสุดใน localStorage แบบช่วยจำ ไม่ใช่ token หลัก
const AUTH_EMAIL_KEY = "readlyUserEmail";

// สร้าง context กลางสำหรับเก็บสถานะ user ทั้งแอป
const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  // user = ข้อมูล profile ปัจจุบันของคนที่ login อยู่
  const [user, setUser] = useState(null);
  // isLoading = ใช้บอกว่าตอนเปิดแอป เรายังเช็ก session ไม่เสร็จ
  const [isLoading, setIsLoading] = useState(true);

  const getMe = async () => {
    try {
      // route นี้ใช้เช็ก session จาก cookie ที่ backend เซ็ตไว้หลัง login
      // ถ้า cookie ยัง valid backend จะส่งข้อมูล user กลับมา
      const result = await apiFetch("/users/auth/me");

      // เก็บ email ล่าสุดไว้เผื่อใช้เติมค่าเริ่มต้นในฟอร์มหรือ debug session
      window.localStorage.setItem(AUTH_EMAIL_KEY, result.data?.email ?? "");
      setUser(result.data);
      return result.data;
    } catch {
      // ถ้า session ไม่ผ่าน ให้ถือว่ายังไม่มี user login อยู่
      setUser(null);
      return null;
    }
  };

  const login = async (email, password) => {
    // trim + toLowerCase ช่วยให้ค่า email สะอาดก่อนส่งให้ backend
    const trimmedEmail = email.trim().toLowerCase();

    // route นี้ตรวจ email/password และสร้าง cookie session ให้ฝั่ง browser
    const result = await apiFetch("/users/login", {
      method: "POST",
      body: {
        email: trimmedEmail,
        password,
      },
    });

    // เก็บ email ล่าสุดไว้แบบช่วยจำ
    window.localStorage.setItem(AUTH_EMAIL_KEY, trimmedEmail);
    // หลัง login สำเร็จ ให้ดึง profile จริงของ user มาเก็บใน context ทันที
    await getMe();
    return result;
  };

  const logout = async () => {
    try {
      // route นี้ให้ backend ลบ cookie session ฝั่ง server/client
      await apiFetch("/users/auth/logout", { method: "POST" });
    } finally {
      // ถึง backend จะ error ก็ยังล้างข้อมูล local ฝั่ง frontend ไว้ก่อน
      window.localStorage.removeItem(AUTH_EMAIL_KEY);
      setUser(null);
    }
  };

  useEffect(() => {
    const initializeAuth = async () => {
      // ตอนเปิดแอปใหม่ให้ลองดึง profile ก่อน เพื่อคืน session เดิมอัตโนมัติ
      const currentUser = await getMe();

      if (!currentUser) {
        // ถ้าคืน session ไม่ได้ ให้ล้าง email ที่เคยจำไว้
        window.localStorage.removeItem(AUTH_EMAIL_KEY);
      }

      // บอกทั้งแอปว่าเช็ก auth ครั้งแรกเสร็จแล้ว
      setIsLoading(false);
    };

    initializeAuth();
  }, []);

  const value = useMemo(
    () => ({
      user,
      isLoading,
      // แปลง user เป็น true/false ที่หน้าอื่นเอาไปใช้ได้ง่าย
      isAuthenticated: Boolean(user),
      // alias สำหรับ BookDetail.jsx ที่ destructure ชื่อนี้
      isLoggedIn: Boolean(user),
      // เพิ่ม isAdmin โดยใช้ Optional Chaining (?.) เพื่อป้องกันแอปพังกรณีที่ user เป็น null
      // (สามารถเปลี่ยนค่า "admin" เป็นค่าอื่นตามที่ backend กำหนดไว้ได้ เช่น "ADMIN" หรือ 1)
      isAdmin: user?.role === "admin",
      login,
      logout,
      getMe,
    }),
    [user, isLoading],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  // custom hook ตัวนี้ช่วยให้ component อื่นเรียกใช้ auth context ได้ง่าย
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used inside AuthProvider");
  }

  return context;
}

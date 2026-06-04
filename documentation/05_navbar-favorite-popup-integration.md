# แนวทางการพัฒนา Favorite Popup ใน NavBar
---

เอกสารนี้ระบุรายละเอียดการออกแบบและแนวทางการพัฒนาเพื่อเชื่อมต่อระบบ Favorite (Liked) เข้ากับปุ่มหัวใจใน NavBar โดยให้มี Badge แสดงจำนวนรายการที่กด Like และเมื่อคลิกแล้วจะปรากฏ Popup รายการโปรดที่ผู้ใช้สามารถลบรายการออกได้ทันทีตามดีไซน์ที่ระบุในภาพ

---

## 1. การทำงานและ Flow ของระบบ (Feature & User Flow)

1. **Badge ตัวเลขบนปุ่มหัวใจ**:
   - เมื่อผู้ใช้ทำการกด Like หรือ Unlike หนังสือ (ไม่ว่าจะทำจากหน้า `BookDetail` หรือ Popup บน NavBar) ตัวเลข Badge บนปุ่มหัวใจจะอัปเดตทันที
   - หากไม่มีหนังสือที่ Like ตัว Badge จะต้องซ่อนไป
2. **การเปิด-ปิด Popup รายการโปรด (เฉพาะเมื่อ Logged In เท่านั้น)**:
   - **การจำกัดสิทธิ์การเข้าถึง**: ผู้ใช้สามารถกดดูไอคอนหัวใจและเปิด Popup ได้ต่อเมื่อเข้าสู่ระบบ (Logged in) เรียบร้อยแล้วเท่านั้น
   - **กรณีที่ยังไม่ได้ Log in**: เมื่อกดที่ไอคอนรูปหัวใจ ระบบจะเปลี่ยนเส้นทางผู้ใช้ไปยังหน้าล็อกอิน (`/login`) เพื่อให้เข้าสู่ระบบก่อน
   - **กรณีที่ Log in แล้ว**: เมื่อกดที่ไอคอนรูปหัวใจบน NavBar จะปรากฏ Popup ด้านล่างเยื้องไปทางซ้ายของไอคอนหัวใจ
   - หากมี Popup อื่นเปิดอยู่ (เช่น เมนู Profile) จะต้องปิด Popup อื่นก่อน และเปิด Popup รายการโปรดขึ้นมา
3. **ข้อมูลใน Popup**:
   - แสดงหัวข้อ "Your Likes" และ Badge แสดงจำนวนชิ้น เช่น "2 Items"
   - แสดงรายการหนังสือที่ถูกใจ: ภาพหน้าปก, ชื่อหนังสือ, ชื่อผู้แต่ง, และราคา (สกุลเงิน THB)
   - มีปุ่มปิด (X) เพื่อปิด Popup
4. **การลบหนังสือออกจากรายการ (Trash Icon)**:
   - แต่ละรายการหนังสือจะมีปุ่มถังขยะ (Trash Icon)
   - เมื่อกดปุ่มถังขยะ จะทำการเรียก API สำหรับลบ และอัปเดต UI ทันทีโดยไม่ต้องโหลดหน้าเว็บใหม่

---

## 2. การจัดสไตล์และดีไซน์ (UI & Aesthetics)

เพื่อให้ได้ผลลัพธ์ที่สวยงามและพรีเมียมตามภาพอ้างอิง:
- **Card Container**: ใช้ดีไซน์โค้งมนสูง (`rounded-3xl` หรือ `border-radius: 24px`), พื้นหลังสีครีมอ่อน/นวล (`bg-[#FAF6F4]`), ขอบมนพร้อมกับเงาที่ดูนุ่มนวล (`shadow-2xl`)
- **Badge Items**: ตัวบอกจำนวนชิ้นเด่นชัดด้วยพื้นหลังสีน้ำตาลอบอุ่น ขอบมนเด่นชัด (`bg-[#A66858]/80 text-white px-3 py-1 rounded-full text-xs font-semibold`)
- **Book Item Card**: การ์ดแสดงหนังสือด้านในมีพื้นหลังสีขาว (`bg-white`), มีระยะห่างที่พอดี และขอบโค้งมน (`rounded-2xl`)
- **Cover Image**: หน้าปกหนังสือต้องสัดส่วนสวยงาม มีเงาเล็กน้อย (`shadow-sm`) และขอบโค้งมนเล็กน้อย
- **Typography**: หัวข้อใช้ฟอนต์ Serif ที่หรูหรา เช่น `Playfair Display` หรือ `Cormorant Garamond` สีน้ำตาลเข้มเกือบดำ (`#2C1810`) ส่วนรายละเอียดหนังสือใช้สีน้ำตาลปานกลาง (`#8B7355`) และราคากำหนดเป็นตัวหนา
- **Responsive**: บนหน้าจอเล็ก (< 640px) Popup ใช้ความกว้าง `90vw` พร้อม `max-width: 420px` เพื่อไม่ให้ล้นหน้าจอ, padding ลดลงเป็น `p-4` และปรับเป็น `p-6` ตั้งแต่ขนาด `sm` (640px) ขึ้นไป

---

## 3. การจัดการ State ใน `NavBar.jsx`

เพื่อไม่ให้เกิดการชนกันของการเปิด Popup (เช่น เมนู Profile และรายการโปรดเปิดซ้อนกัน) แนะนำให้ใช้ State **`activePopup`** ในการควบคุมสถานะใน `NavBar.jsx` ดังนี้:

```javascript
// สถานะสำหรับควบคุมว่า Popup ไหนเปิดอยู่:
// null = ปิดทั้งหมด
// 'likes' = เปิด Popup รายการโปรด
// 'profile' = เปิดเมนูโปรไฟล์
const [activePopup, setActivePopup] = useState(null);

// ฟังก์ชัน Toggle สำหรับรูปหัวใจ
const handleHeartClick = () => {
  if (!isAuthenticated) {
    navigate("/login");
    return;
  }
  setActivePopup((prev) => (prev === "likes" ? null : "likes"));
};

// ฟังก์ชันสำหรับเมนู Profile (แก้จากเดิม)
const handleProfileClick = () => {
  if (!isAuthenticated) {
    navigate("/login");
    return;
  }
  setActivePopup((prev) => (prev === "profile" ? null : "profile"));
};
```

และเพิ่ม Event Handler เพื่อปิด Popup เมื่อคลิกนอกขอบเขต (Click Outside) เพื่อประสบการณ์ใช้งานที่ราบรื่น:

```javascript
useEffect(() => {
  const handleClickOutside = (event) => {
    if (!event.target.closest(".navbar-popup-trigger") && !event.target.closest(".navbar-popup-content")) {
      setActivePopup(null);
    }
  };
  document.addEventListener("mousedown", handleClickOutside);
  return () => document.removeEventListener("mousedown", handleClickOutside);
}, []);
```

---

## 4. สถาปัตยกรรมการจัดการข้อมูล (Data Flow & Context Sync)

เนื่องจากหน้า `BookDetail` และ `NavBar` รันแยกคนละ Component แต่อ้างอิงรายการโปรด (Favorites) ร่วมกัน การอัปเดตแบบเรียลไทม์จำเป็นต้องใช้ **Global Context** เข้ามาจัดการ (เหมือนระบบตะกร้าสินค้า `CartContext`)

### วิธีแก้ปัญหาที่ดีที่สุด: สร้าง `FavoriteContext.jsx`

สร้างไฟล์ `src/context/FavoriteContext.jsx` เพื่อแชร์รายการโปรดไปทั่วแอป

```jsx
// src/context/FavoriteContext.jsx
import { createContext, useContext, useState, useEffect, useCallback } from "react";
import { apiFetch } from "../lib/api";
import { useAuth } from "./AuthContext";

const FavoriteContext = createContext(null);

export function FavoriteProvider({ children }) {
  const [favoriteItems, setFavoriteItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { isLoggedIn } = useAuth();

  // ดึงรายการโปรดจาก Backend API
  const fetchFavorites = useCallback(async () => {
    if (!isLoggedIn) {
      setFavoriteItems([]);
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const data = await apiFetch("/favorites");
      setFavoriteItems(data.data?.favorite_items || []);
    } catch (err) {
      console.error("Failed to fetch favorites:", err.message);
      setError(err.message);
      setFavoriteItems([]);
    } finally {
      setLoading(false);
    }
  }, [isLoggedIn]);

  // โหลดรายการโปรดครั้งแรกเมื่อ User ล็อกอิน
  useEffect(() => {
    fetchFavorites();
  }, [fetchFavorites]);

  // ฟังก์ชัน Toggle Favorite สำหรับใช้งานทุกที่ในแอป
  const toggleFavorite = useCallback(async (bookId) => {
    if (!isLoggedIn) return false;
    try {
      await apiFetch(`/favorites/${bookId}`, { method: "POST" });
      // ทำการดึงข้อมูลล่าสุดหลังจากเปลี่ยนสถานะ
      await fetchFavorites();
      return true;
    } catch (err) {
      console.error("Toggle favorite failed:", err);
      return false;
    }
  }, [isLoggedIn, fetchFavorites]);

  // ฟังก์ชันเช็คว่าหนังสือนี้ถูก Like หรือยัง
  const isBookLiked = useCallback((bookId) => {
    return favoriteItems.some((item) => item.book_id === bookId);
  }, [favoriteItems]);

  const value = {
    favoriteItems,
    loading,
    error,
    toggleFavorite,
    isBookLiked,
    refetchFavorites: fetchFavorites,
  };

  return <FavoriteContext.Provider value={value}>{children}</FavoriteContext.Provider>;
}

export function useFavorites() {
  const context = useContext(FavoriteContext);
  if (!context) {
    throw new Error("useFavorites must be used within a FavoriteProvider");
  }
  return context;
}
```

> **ขั้นตอนถัดไป**: นำ `FavoriteProvider` ไปหุ้มครอบระบบที่ `src/main.jsx`
> ```jsx
> <AuthProvider>
>   <BookProvider>
>     <FavoriteProvider>
>       <CartProvider>
>         <App />
> </CartProvider> ...
> ```

---

## 5. แผนการแก้ไขโค้ดแต่ละหน้า (Implementation Details)

### 5.1 ปรับปรุงหน้า `BookDetail.jsx` ให้เรียกใช้งานผ่าน Context

ย้าย State `liked` ของหน้า BookDetail ไปดึงจาก `useFavorites` แทนการดึงเอง ทำให้หน้านี้สะอาดขึ้นและ Sync ข้อมูลกับ NavBar ได้ทันที:

```diff
- // ลบ state เดิมออก
- const [liked, setLiked] = useState(false);
- const [favoriteLoading, setFavoriteLoading] = useState(false);

+ // เรียกใช้จาก context แทน
+ const { toggleFavorite, isBookLiked, loading: favoriteLoading } = useFavorites();
+ const liked = isBookLiked(id);

- // ลบ useEffect สำหรับดึง favorite ออก
- useEffect(() => { ... checkFavorite() ... }, [id]);

- // ปรับปรุง handleToggleLike
- const handleToggleLike = useCallback(async () => {
-   if (!isLoggedIn) { navigate("/login"); return; }
-   setFavoriteLoading(true);
-   try {
-     await apiFetch(`/favorites/${id}`, { method: "POST" });
-     setLiked((prev) => !prev);
-   } catch (err) { ... }
- }, [id, isLoggedIn]);

+ const handleToggleLike = async () => {
+   if (!isLoggedIn) {
+     navigate("/login");
+     return;
+   }
+   await toggleFavorite(id);
+ };
```

---

### 5.2 ปรับปรุง `src/components/HomeComponents/NavBar.jsx`

1. นำเข้า `useFavorites` และ `useBooks` เพื่อดึงข้อมูลหนังสือโปรดมาแสดงผล
2. เพิ่ม State `activePopup`
3. เขียน JSX สำหรับแสดง Badge ตัวเลขของไอคอนหัวใจ
4. ฝังตัว Favorite Popup ในจุดแสดงผลด้านล่างของปุ่มหัวใจ

**ตัวอย่างการปรับปรุงโค้ดใน `NavBar.jsx`**:

```jsx
// 1. นำเข้า Hook ที่ต้องใช้งาน
import { useFavorites } from "../../context/FavoriteContext";
import { useBooks } from "../../context/BookContext";
import { Trash2, X } from "lucide-react"; // เพิ่มไอคอนสำหรับถังขยะและปุ่มปิด

export default function NavBar() {
  const { user, isAuthenticated, isLoading, logout } = useAuth();
  const { favoriteItems, toggleFavorite, loading: favoriteLoading, error: favoriteError, refetchFavorites } = useFavorites();
  const { books } = useBooks();

  // State สำหรับควบคุม Popup
  const [activePopup, setActivePopup] = useState(null);

  // ดึงรายละเอียดข้อมูลหนังสือของแต่ละ Favorite item จาก BookContext
  const likedBooks = favoriteItems
    .map((fav) => {
      // ค้นหาข้อมูลหนังสือตัวเต็มจาก books ใน Context
      const bookDetail = books.find((b) => b.id === fav.book_id);
      return bookDetail ? bookDetail : null;
    })
    .filter(Boolean);

  const handleHeartClick = () => {
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }
    setActivePopup((prev) => (prev === "likes" ? null : "likes"));
  };

  // ... ส่วนหัวและโครงสร้างอื่นๆ ของ NavBar ...

  return (
    <nav className="bg-[#EEE1DB] border-b border-[#A66858] relative">
      {/* ... โค้ดเดิม ... */}
      
      {/* ส่วนปุ่มแสดง Favorite (รูปหัวใจ) */}
      <div className="relative navbar-popup-trigger">
        <button 
          onClick={handleHeartClick}
          className="relative text-black hover:text-gray-700 transition-colors"
        >
          <Heart size={18} className="md:hidden" />
          <Heart size={24} className="hidden md:block" />
          
          {/* Badge แสดงจำนวนรายการโปรด */}
          {favoriteItems.length > 0 && (
            <span className="absolute -right-2 -top-2 flex h-5 min-w-5 items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-bold text-white md:h-6 md:min-w-6 md:text-xs animate-pulse">
              {favoriteItems.length}
            </span>
          )}
        </button>

        {/* 5.3 โครงสร้าง Favorite Popup (แสดงเมื่อ activePopup === 'likes') */}
        {activePopup === "likes" && (
          <div className="absolute right-0 mt-3 z-[100] w-[90vw] max-w-[420px] sm:w-[360px] md:w-[420px] rounded-3xl bg-[#FAF6F4] border border-[#EBE3DE] shadow-2xl p-4 sm:p-6 font-sans navbar-popup-content">
            {/* Header ของ Popup */}
            <div className="flex justify-between items-center mb-5">
              <h3 className="text-xl font-bold font-['Playfair_Display'] text-[#2C1810]">
                Your Likes
              </h3>
              <div className="flex items-center gap-3">
                <span className="bg-[#A66858] text-white px-3 py-1 rounded-full text-xs font-semibold">
                  {likedBooks.length} Items
                </span>
                <button 
                  onClick={() => setActivePopup(null)}
                  className="text-gray-400 hover:text-gray-700 transition-colors"
                >
                  <X size={18} />
                </button>
              </div>
            </div>

            {/* ส่วนรายการหนังสือโปรด (Loading → Error → Book List → Empty) */}
            {favoriteLoading ? (
              // Loading State — แสดงขณะกำลังโหลดข้อมูลรายการโปรด
              <div className="text-center py-8">
                <div className="w-8 h-8 border-3 border-[#A66858] border-t-transparent rounded-full animate-spin mx-auto" />
                <p className="text-sm text-[#8B7355] mt-3">Loading your favorites...</p>
              </div>
            ) : favoriteError ? (
              // Error State — แสดงเมื่อโหลดข้อมูลไม่สำเร็จ
              <div className="text-center py-8">
                <p className="text-sm text-red-400">ไม่สามารถโหลดรายการโปรดได้</p>
                <button
                  onClick={refetchFavorites}
                  className="mt-2 text-xs text-[#A66858] underline hover:text-[#8B5A3C]"
                >
                  ลองใหม่อีกครั้ง
                </button>
              </div>
            ) : likedBooks.length > 0 ? (
              <div className="max-h-[320px] overflow-y-auto pr-1 space-y-3 scrollbar-thin">
                {likedBooks.map((book) => (
                  <div 
                    key={book.id} 
                    className="flex gap-4 p-3 bg-white rounded-2xl border border-[#F2ECE8] shadow-sm relative group hover:border-[#A66858]/30 transition-all duration-300"
                  >
                    {/* รูปหน้าปกหนังสือ */}
                    <img 
                      src={book.img} 
                      alt={book.name} 
                      className="w-14 h-20 object-cover rounded-xl shadow-sm bg-gray-100 flex-shrink-0"
                    />
                    
                    {/* รายละเอียดหนังสือ */}
                    <div className="flex flex-col justify-center flex-1 min-w-0 pr-6">
                      <h4 className="text-sm font-bold text-[#2C1810] truncate">
                        {book.name}
                      </h4>
                      <p className="text-xs text-[#8B7355] mt-1 truncate">
                        {book.author}
                      </p>
                      <p className="text-sm font-bold text-[#A66858] mt-2">
                        {book.price.toLocaleString("th-TH", { minimumFractionDigits: 2 })} THB
                      </p>
                    </div>

                    {/* ปุ่มถังขยะสำหรับลบออกจาก Favorite */}
                    <button 
                      onClick={() => toggleFavorite(book.id)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 p-2 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all duration-200"
                      title="Remove from favorites"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              // Empty State เมื่อไม่มีข้อมูล Like
              <div className="text-center py-8 text-[#8B7355]">
                <p className="text-sm">You haven't liked any books yet.</p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* ... โค้ดเดิม ... */}
    </nav>
  );
}
```

---

## 6. แผนการทดสอบระบบ (Verification Plan)

### การทดสอบความถูกต้องของ UI และ Actions
1. **การแสดงผลขั้นต้น**:
   - เมื่อ Log in แล้ว หากมีรายการ Like ในระบบ จะต้องเห็นตัวเลขสีแดงบน Badge รูปหัวใจ
   - เมื่อกดที่รูปหัวใจ Popup จะต้องปรากฏขึ้นอย่างมีสไตล์ ข้อมูลหน้าปก ชื่อเรื่อง ผู้แต่ง ราคา ถูกต้องครบถ้วน
2. **การลบรายการผ่าน Popup**:
   - เมื่อกดรูปถังขยะใน Popup รายการนั้นต้องหายไปทันที ตัวเลขที่ Badge ต้องลดลง
   - หากผู้ใช้กำลังเปิดหน้า `BookDetail` ของหนังสือที่กดลบอยู่ สถานะของปุ่ม Like ในหน้า `BookDetail` จะต้องเปลี่ยนจาก `Liked` กลับมาเป็น `Like` ทันทีด้วย
3. **การเปิด-ปิด Popup ซ้อน**:
   - เมื่อเปิด Popup "Your Likes" อยู่ แล้วกดปุ่มโปรไฟล์ Popup "Your Likes" จะต้องปิดลง และเมนูโปรไฟล์เปิดขึ้นมาแทน (และในทางกลับกัน)
   - เมื่อคลิกนอกขอบเขต Popup (Click Outside) ตัว Popup จะต้องปิดลงอัตโนมัติ
4. **การตรวจสอบสิทธิ์การเข้าใช้งาน (Auth Restriction)**:
   - เมื่อผู้ใช้ยังไม่ได้ล็อกอิน จะต้องไม่สามารถเปิดดูรายการโปรดได้ โดยเมื่อกดที่ไอคอนหัวใจระบบจะต้องเปลี่ยนเส้นทางไปยังหน้า `/login` ทันที
   - หากล็อกอินแล้ว จึงจะสามารถกดเปิดดู Popup และใช้งานปุ่มลบ (ถังขยะ) ได้ปกติ

---

## 7. ลำดับขั้นตอนการ Implement (Implementation Checklist)

ให้ทำตามลำดับต่อไปนี้เพื่อป้องกัน Import Error และให้ทุกส่วน Sync กันถูกต้อง:

- [ ] **ขั้นตอนที่ 1**: สร้างไฟล์ `src/context/FavoriteContext.jsx` (ตามโค้ดใน Section 4)
- [ ] **ขั้นตอนที่ 2**: แก้ไข `src/main.jsx` — เพิ่ม `FavoriteProvider` ครอบ `CartProvider`
  ```diff
  + import { FavoriteProvider } from "./context/FavoriteContext.jsx";
  
    <AuthProvider>
      <BookProvider>
  +     <FavoriteProvider>
          <CartProvider>
            <App />
          </CartProvider>
  +     </FavoriteProvider>
      </BookProvider>
    </AuthProvider>
  ```
- [ ] **ขั้นตอนที่ 3**: แก้ไข `src/components/HomeComponents/NavBar.jsx`
  - [ ] ลบ `const [isProfileOpen, setIsProfileOpen] = useState(false);`
  - [ ] เพิ่ม `const [activePopup, setActivePopup] = useState(null);`
  - [ ] แก้ `handleProfileClick` ให้ใช้ `setActivePopup` แทน `setIsProfileOpen`
  - [ ] แก้ `handleLogout` เปลี่ยนจาก `setIsProfileOpen(false)` → `setActivePopup(null)`
  - [ ] เปลี่ยน `{isProfileOpen && (...)}` → `{activePopup === "profile" && (...)}`
  - [ ] เพิ่มปุ่มหัวใจพร้อม Badge + Favorite Popup JSX (ตาม Section 5.2-5.3)
  - [ ] เพิ่ม `useEffect` สำหรับ Click Outside ปิด Popup (ตาม Section 3)
- [ ] **ขั้นตอนที่ 4**: แก้ไข `src/pages/BookDetail.jsx` — ย้าย Favorite logic ไปใช้ `useFavorites()` จาก Context (ตาม Section 5.1)
- [ ] **ขั้นตอนที่ 5**: ทดสอบระบบตาม Verification Plan (Section 6)

# BookDetail API Integration Checklist

เอกสารนี้สรุปสิ่งที่ต้องทำเพิ่มเติมเพื่อให้ `src/pages/BookDetail.jsx` ใช้งานได้จริงกับ backend API โดยเรียงจากขั้นที่ควรทำก่อน ไปจนถึงขั้นทดสอบ flow ทั้งหน้า

> สถานะหลังเริ่มทำตาม checklist: เพิ่ม `src/lib/api.js` แล้ว, `AuthContext.jsx` ใช้ `apiFetch`, เช็ค session ผ่าน `/users/auth/me`, expose `isLoggedIn` ให้ `BookDetail.jsx`, และ `npm run build` ผ่านแล้ว

> จุดที่ยังต้องทดสอบกับ backend จริง: เปิด backend, login ให้ได้ cookie `accessToken`, เปิดหน้า `/bookDetail/:id`, แล้วลอง flow โหลด book/review, Like, Add to Cart, และ Submit Review ผ่าน browser DevTools Network

> อัปเดตจาก backend ที่ใช้งานจริง: backend mount API ใต้ `/api`, เปิด CORS ให้ `http://localhost:5173`, `5174`, `5175` และใช้ cookie ชื่อ `accessToken` สำหรับ auth ดังนั้น frontend ต้องเรียก fetch แบบ `credentials: "include"`

---

## 1. ยืนยันว่า backend เปิดอยู่และรู้ base URL ที่แน่นอน

ก่อนแก้ frontend ต้องรู้ก่อนว่า backend รันที่ไหน เช่น

```txt
http://localhost:<PORT>/api
```

วิธีเช็ค:

1. เปิด terminal ฝั่ง backend
2. รัน backend server
3. ดู log ว่า server listen port อะไร
4. ลองเรียก endpoint ง่าย ๆ ด้วย browser, Postman, Thunder Client หรือ `curl`

ตัวอย่าง:

```bash
curl http://localhost:<PORT>/api/producsts
```

ผลที่ต้องการคือ backend ต้องตอบ JSON กลับมา ไม่ใช่ connection refused, 404 จาก port ผิด, หรือ HTML error page

จาก backend ปัจจุบัน `server.js` ใช้:

```js
app.use('/api', apiRoutes);
```

และ `routes/index.js` mount product route แบบนี้:

```js
router.use('/producsts', productRouter);
```

ดังนั้น path รายละเอียดหนังสือที่ frontend เรียกอยู่ตอนนี้คือ path จริงของ backend:

```txt
GET /api/producsts/:id
```

---

## 2. กำหนด frontend environment variable สำหรับ API

ใน Vite ควรใช้ env ที่ขึ้นต้นด้วย `VITE_` เช่น

```txt
VITE_API_BASE_URL=http://localhost:<PORT>/api
```

แนะนำให้สร้างไฟล์ `.env.local` ไว้ที่ root ของ frontend project:

```txt
group_project_03_sprint_02/.env.local
```

ตัวอย่างเนื้อหา:

```env
VITE_API_BASE_URL=http://localhost:<PORT>/api
```

เหตุผลที่ควรทำ:

- เวลาเปลี่ยน port backend ไม่ต้องไล่แก้ทุก component
- แยก config ระหว่างเครื่อง local, staging, production ได้ง่าย
- ป้องกันการ hardcode URL ไว้ในหลายไฟล์

หลังเพิ่มหรือแก้ `.env.local` ต้อง restart `npm run dev` ใหม่ เพราะ Vite โหลด env ตอน dev server เริ่มทำงาน

---

## 3. ทำ `apiFetch` ให้มีอยู่จริง

ตอนนี้ `BookDetail.jsx` import แบบนี้:

```jsx
import { apiFetch } from "../lib/api";
```

ดังนั้นต้องมีไฟล์:

```txt
src/lib/api.js
```

หน้าที่ของ `apiFetch` คือเป็นตัวกลางเรียก backend API เช่น:

- รวม `VITE_API_BASE_URL` กับ path ที่ส่งเข้ามา
- ใส่ `Content-Type: application/json`
- แปลง `body` จาก object เป็น JSON string
- ส่ง cookie auth ไปกับ request ด้วย `credentials: "include"`
- แปลง response เป็น JSON
- throw error เมื่อ backend ตอบ status ไม่ใช่ 2xx

ตัวอย่างแนวทาง:

```jsx
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

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
```

เหตุผลที่ต้องใช้ `credentials: "include"`: backend login เก็บ JWT ไว้ใน HTTP-only cookie ชื่อ `accessToken` ไม่ได้ส่ง token ให้ frontend เก็บใน localStorage และ protected routes เช่น `/favorites`, `/cart`, `/reviews` ใช้ `authUser` อ่าน token จาก `req.cookies.accessToken`

---

## 4. ทำ auth state ให้ `BookDetail.jsx` ใช้ได้และชื่อ field ตรงกัน

ตอนนี้ `BookDetail.jsx` ใช้:

```jsx
const { user, isLoggedIn, isLoading: authLoading } = useAuth();
```

ตอนนี้ repo มี `src/context/AuthContext.jsx` แล้ว แต่ต้องให้ contract ตรงกับที่ `BookDetail.jsx` ใช้ โดยต้องมีค่าอย่างน้อย 3 ตัว:

| ค่า | ใช้ทำอะไรใน `BookDetail.jsx` |
|---|---|
| `user` | ใช้ `user._id` ตอน add to cart และ submit review |
| `isLoggedIn` | เช็คว่ากด Like, Add to Cart, Review ได้ไหม |
| `isLoading` | กันหน้า render ก่อนเช็คสถานะ login เสร็จ |

ไฟล์ที่ต้องมี:

```txt
src/context/AuthContext.jsx
```

สถานะ repo ปัจจุบัน:

- `src/context/AuthContext.jsx` มีแล้ว
- `src/main.jsx` wrap `<AuthProvider>` ครอบ `<CartProvider>` แล้ว
- `AuthContext.jsx` expose ทั้ง `isAuthenticated` และ `isLoggedIn`
- `AuthContext.jsx` ใช้ `apiFetch` กลาง ซึ่งอ่าน `VITE_API_BASE_URL` และ fallback เป็น `http://localhost:3000/api`
- `AuthContext.jsx` เรียก `GET /users/auth/me` ตอนเช็ค session ตรงกับ backend จริง

ทางเลือกที่เลือกใช้แล้ว:

1. แก้ `AuthContext.jsx` ให้ expose alias `isLoggedIn: Boolean(user)` เพิ่ม เพื่อให้ `BookDetail.jsx` ใช้ต่อได้
2. คง `BookDetail.jsx` ให้ destructure `isLoggedIn` เหมือนเดิม เพื่อลดการเปลี่ยน behavior ของหน้าอื่น

ใน `src/main.jsx` ต้อง wrap app ด้วย provider เช่นนี้ ซึ่ง repo ปัจจุบันทำแล้ว:

```jsx
<AuthProvider>
  <CartProvider>
    <App />
  </CartProvider>
</AuthProvider>
```

หรือถ้าต้องการใช้ `CartProvider` เป็นตัวนอกก็ได้ แต่ต้องแน่ใจว่า `BookDetail` อยู่ข้างใน `AuthProvider`

สิ่งที่ `AuthContext` ทำแล้ว:

1. ใช้ base URL กลางจาก `VITE_API_BASE_URL` หรือ `apiFetch` แทน hardcode port
2. ตอน app โหลด ให้เรียก `GET /users/auth/me` เพราะ backend route จริงคือ `router.get('/auth/me', authUser, ...)`
3. ถ้า cookie `accessToken` ยัง valid backend จะตอบ user กลับมาใน `data`
4. ถ้าได้ user ให้ set `user` และ `isLoggedIn: true`
5. ถ้า request fail ให้ set `user: null` และ `isLoggedIn: false`
6. expose `login()` และ `logout()` ให้หน้า Login/NavBar ใช้ต่อได้

จาก backend ปัจจุบัน `authUser` อ่าน token จาก cookie:

```js
let token = req.cookies.accessToken;
```

และ set user id ไว้ที่:

```js
req.user = { users: { _id: decodedToken.userId } };
```

หมายเหตุ: ใน `auth.js` มี bypass สำหรับ testing ถ้าไม่มี cookie โดย set user id คงที่ให้ backend เอง แต่ฝั่ง frontend ไม่ควรใช้ bypass นี้แทนระบบ login เพราะ `BookDetail.jsx` ยังต้องใช้ `isLoggedIn` และ `user._id` เพื่อควบคุม UI

---

## 5. ตรวจหน้า Login ให้ได้ cookie session และ user จริง

ตอนนี้ `src/pages/Login.jsx` ไม่ใช่ mock localStorage-only แล้ว เพราะเรียก `login()` จาก `AuthContext` และ `AuthContext.login()` ยิง `POST /users/login` พร้อม `credentials: "include"` แล้ว

แต่ `BookDetail.jsx` ยังต้องการ `user._id` และสถานะ login จริงเพื่อยิง API ที่ต้อง login เช่น favorite, cart, review ดังนั้นต้องตรวจต่อว่า session ที่ login ได้ถูก set กลับมาใน `AuthContext` จริงไหม

สิ่งที่ต้องทำ:

1. ยืนยันว่า `AuthContext.login()` เรียก backend `POST /users/login` ผ่าน base URL ที่ถูกต้อง
2. request ต้องส่ง `credentials: "include"` เสมอ จะผ่าน `apiFetch` หรือ fetch ตรงใน `AuthContext` ก็ได้ แต่ควรใช้ base URL กลางเดียวกัน
3. backend จะ set HTTP-only cookie ชื่อ `accessToken`
4. backend จะตอบข้อมูล user กลับมาใน field `user`
5. `AuthContext` ต้อง set `user` จาก response นี้ หรือเรียก endpoint เช็ค session ซ้ำเพื่อยืนยัน session
6. NavBar ควรเปลี่ยนจากเช็ค `readlyUserEmail` เป็นเช็คจาก `useAuth()`

หมายเหตุจาก backend route จริง: `AuthContext.login()` login แล้วเรียก `getMe()` ต่อได้ และตอนนี้ `getMe()` เปลี่ยนมาใช้ `/users/auth/me` แล้ว เพราะ backend มี route `router.get('/auth/me', authUser, ...)` และไม่มี route `/users/me`

ตัวอย่าง response ที่ frontend ใช้ง่าย:

```json
{
  "success": true,
  "message": "login successful",
  "user": {
    "_id": "user-id",
    "username": "jay",
    "email": "jay@example.com",
    "role": "user"
  }
}
```

ตอน logout ให้เรียก:

```txt
POST /users/auth/logout
```

backend จะ clear cookie `accessToken` ให้เอง

---

## 6. ทำ endpoint ให้ตรงกันระหว่าง frontend กับ backend

จุดนี้สำคัญมาก เพราะในเอกสาร API เดิมกับ backend จริงมี path บางจุดไม่ตรงกัน หลังดู backend แล้ว route ที่ใช้งานจริงสำหรับ `BookDetail.jsx` คือชุดนี้

| Flow | Path ที่ `BookDetail.jsx` ควรเรียกผ่าน `apiFetch` | Backend route จริง | สถานะ |
|---|---|---|---|
| โหลดหนังสือ 1 เล่ม | `GET /producsts/:id` | `GET /api/producsts/:id` | ตรงกับ backend จริง แม้สะกดเป็น `producsts` |
| โหลด review | `GET /reviews/:id` | `GET /api/reviews/:book_id` | ตรงกับ backend จริง |
| สร้าง review | `POST /reviews` | `POST /api/reviews` | ตรงกับ backend จริง |
| โหลด favorite | `GET /favorites` | `GET /api/favorites` | ตรงกับ backend จริง |
| toggle favorite | `POST /favorites/:bookId` | `POST /api/favorites/:id` | ตรงกับ backend จริง |
| เพิ่ม cart | `POST /cart` | `POST /api/cart` | ตรงกับ backend จริง |
| login | `POST /users/login` | `POST /api/users/login` | ต้องใช้สำหรับ `AuthContext` |
| เช็ค session | `GET /users/auth/me` | `GET /api/users/auth/me` | ตรงกับ backend จริงแล้ว |
| logout | `POST /users/auth/logout` | `POST /api/users/auth/logout` | ใช้ clear cookie |

คำแนะนำ:

- ตอนนี้ frontend ควรใช้ `/producsts` ตาม backend จริงไปก่อน ไม่อย่างนั้นจะ 404
- ถ้าอยากแก้ typo ในอนาคต ให้แก้ backend route และทุก frontend caller พร้อมกัน
- หลีกเลี่ยงการมี route ซ้ำหลายแบบ เพราะจะ debug ยาก

---

## 7. ตรวจ contract ของข้อมูลหนังสือ

`BookDetail.jsx` ต้องการ field เหล่านี้จาก API:

```txt
_id
book_name
author
category
rating
price
img_link
description
page
language
publisher
```

ตัวอย่าง response ที่ใช้กับหน้าปัจจุบันได้:

```json
{
  "success": true,
  "data": {
    "_id": "book-id",
    "book_name": "Atomic Habits",
    "author": "James Clear",
    "category": "Self-Help",
    "rating": 4.8,
    "price": 450,
    "img_link": "https://example.com/cover.jpg",
    "description": "Book description",
    "page": 320,
    "language": "English",
    "publisher": "Avery"
  }
}
```

ข้อควรระวัง:

- `book.rating.toFixed(1)` จะ error ถ้า `rating` เป็น `undefined`, `null`, หรือ string ที่ไม่ใช่ number
- `price` ตอนนี้รองรับทั้ง number และ MongoDB Decimal128 แบบ `{ "$numberDecimal": "450.00" }`
- ถ้า `img_link` ไม่มี หน้า fallback เป็นกล่องชื่อหนังสือแทนได้แล้ว
- ถ้า `description` ไม่มี หน้า generate description จาก field อื่นให้เอง

---

## 8. ตรวจ contract ของ review

backend ปัจจุบันใช้:

```txt
GET /api/reviews/:book_id
```

และ controller ตอบ review list ใน field `message` ดังนั้น `BookDetail.jsx` ที่อ่าน `data.message` ถือว่าตรงกับ backend จริง

```json
{
  "success": true,
  "message": [
    {
      "_id": "review-id",
      "user_id": {
        "username": "reader01"
      },
      "createdAt": "2026-06-02T10:00:00.000Z",
      "rating": 4.5,
      "review": "Good book"
    }
  ]
}
```

ข้อควรระวังจาก backend จริง:

- `Review.find({ book_id }).exec()` จะคืน array ว่าง `[]` ถ้าไม่มี review ดังนั้น frontend จะแสดง empty state ได้
- backend ยังไม่ได้ `.populate("user_id")` ดังนั้น `user_id` ที่ส่งกลับมาอาจเป็น ObjectId ไม่ใช่ object ที่มี `username`
- ถ้าไม่ได้ populate user, mapping นี้ใน `BookDetail.jsx` จะได้ชื่อเป็น `Anonymous`

```jsx
name: r.user_id?.username || "Anonymous"
```

- `review.model.js` มี unique index `{ book_id: 1, user_id: 1 }` แปลว่าหนึ่ง user review หนังสือเล่มเดิมได้ครั้งเดียว ถ้า submit ซ้ำ backend อาจตอบ error จาก MongoDB duplicate key

ตอน submit review ตอนนี้ frontend ส่ง:

```json
{
  "rating": 5,
  "review": "Review text",
  "user_id": "user-id",
  "book_id": "book-id"
}
```

backend ปัจจุบันยัง require `user_id` ใน body แม้ route จะผ่าน `authUser` แล้ว ดังนั้น `BookDetail.jsx` ต้องมี `user._id` จริงก่อน submit review

---

## 9. ตรวจ favorite flow

ตอนโหลดหน้า ถ้า login แล้ว `BookDetail.jsx` จะเช็คว่าเล่มนี้อยู่ใน favorite ไหม

ตอนนี้เรียก:

```txt
GET /favorites
```

และคาด response ประมาณนี้:

```json
{
  "success": true,
  "data": {
    "favorite_items": [
      {
        "book_id": "book-id"
      }
    ]
  }
}
```

ตอนกด Like เรียก:

```txt
POST /favorites/:bookId
```

สิ่งที่ต้องทำให้ครบ:

1. endpoint favorite ต้อง require auth
2. `apiFetch` ต้องส่ง cookie ไปด้วย `credentials: "include"`
3. backend ต้องรู้ user จาก cookie `accessToken`
4. response หลัง toggle ควรส่ง favorite list ล่าสุดกลับมา เพื่อให้ frontend set ปุ่ม `Liked` ได้ตรง

backend ปัจจุบันตอบ `404` และ `{ success: false, message: "No favorites found" }` ถ้า user ยังไม่เคยมี favorite document มาก่อน ซึ่ง `BookDetail.jsx` catch แล้ว set `liked` เป็น `false` ได้ ถือว่า flow นี้รับได้

หมายเหตุ: `auth.js` มี testing bypass เมื่อไม่มี cookie แต่ frontend ยังควรทำ login state ให้ถูก เพราะปุ่ม Like ใน `BookDetail.jsx` จะ redirect ไป `/login` ถ้า `isLoggedIn` เป็น false

---

## 10. ตรวจ add to cart flow

ตอนกด Add to Cart, `BookDetail.jsx` ส่ง body ไป backend:

```json
{
  "user_id": "user-id",
  "total_amount": 450,
  "status": "active",
  "cart_item": [
    {
      "book_id": "book-id",
      "book_name": "Book name",
      "author": "Author",
      "quantity": 1,
      "price": 450,
      "img_link": "https://example.com/cover.jpg"
    }
  ]
}
```

สิ่งที่ต้องเช็ค:

- backend route จริงคือ `POST /api/cart`
- backend รับ field ชื่อ `cart_item`
- backend ต้องการ `user_id` จาก body
- backend controller require `status` ใน body ด้วย แม้ `cart.model.js` ตอนนี้ไม่ได้ประกาศ field `status`
- ถ้า book เดิมมีอยู่ใน cart แล้ว backend ปัจจุบันจะสร้าง cart document ใหม่ ไม่ได้ merge quantity ให้อัตโนมัติ
- หลัง add สำเร็จ frontend จะ update `CartContext` local เพื่อให้ badge ที่ navbar เพิ่มทันที

คำแนะนำ:

- ถ้าใช้ backend ปัจจุบันต่อไป `BookDetail.jsx` ส่ง body ถูกทิศแล้ว เพราะมี `user_id`, `total_amount`, `status`, และ `cart_item`
- `CartContext` ตอนนี้ยังเก็บ cart ใน `localStorage` เพื่อ badge/navbar ดังนั้นควรกำหนดให้ชัดว่า backend cart กับ local cart จะ sync กันตอนไหน
- ถ้าต้องการ cart ที่ไม่ซ้ำ ควรปรับ backend ให้ค้นหา active cart เดิมแล้วเพิ่ม quantity แทนการ create document ใหม่ทุกครั้ง

---

## 11. ตรวจ route และ link ไปหน้า BookDetail

ใน `src/App.jsx` มี route แล้ว:

```jsx
{
  path: "/bookDetail/:id",
  element: <BookDetail />,
}
```

สิ่งที่ต้องเช็คต่อ:

1. การ์ดหนังสือจากหน้า Home/ProductList ต้อง link มาที่ `/bookDetail/${book._id}`
2. `id` ที่ส่งใน URL ต้องเป็น id ที่ backend ใช้ค้นหาได้จริง
3. ถ้า backend ใช้ `id` คนละ field เช่น `book_id` หรือ slug ต้องปรับ route/link ให้ตรง

ถ้าเปิด URL โดยตรง เช่น:

```txt
http://localhost:5173/bookDetail/BOOK_ID_HERE
```

แล้ว backend มี book id นี้จริง หน้าควรโหลดข้อมูลได้

---

## 12. เปิด CORS ฝั่ง backend

ถ้า frontend รันที่:

```txt
http://localhost:5173
```

และ backend รันคนละ port เช่น:

```txt
http://localhost:4000
```

backend ต้องเปิด CORS ให้ origin ของ Vite dev server และต้องเปิด credentials เพราะ auth ใช้ cookie

backend ปัจจุบันทำไว้แล้วใน `server.js`:

```js
const corsOptions = {
  origin: [
    'http://localhost:5173',
    'http://localhost:5174',
    'http://localhost:5175',
    'https://jsd-12-full-stack-frontend.vercel.app'
  ],
  credentials: true
};

app.use(cors(corsOptions));
```

สิ่งที่ frontend ต้องทำให้ตรงกันคือทุก request ที่ต้องใช้ auth ต้องใส่:

```js
credentials: "include"
```

อาการที่บอกว่าเป็น CORS:

- ใน browser console เห็นข้อความ `Access to fetch at ... has been blocked by CORS policy`
- ใน Network tab request อาจ fail ก่อนถึง controller
- Postman เรียกได้ แต่ browser เรียกไม่ได้

---

## 13. จัดการ loading, error, และ empty state ให้ชัด

ใน `BookDetail.jsx` มี state พื้นฐานแล้ว:

- `bookLoading`
- `bookError`
- `reviewsLoading`
- `reviewSubmitting`
- `favoriteLoading`

สิ่งที่ควรตรวจ:

1. ถ้า book id ไม่มีจริง จะ redirect กลับ `/`
2. ถ้า backend ล่ม ควรเห็น error ที่ debug ได้ใน console หรือ UI
3. ถ้าไม่มี review ควรแสดง `No reviews yet...`
4. ถ้า user ไม่ login แล้วกด Like/Add to Cart/Review ควรพาไป `/login`
5. ถ้า token หมดอายุ ควร logout หรือ redirect login อย่างชัดเจน

---

## 14. ลำดับการทำงานที่แนะนำ

ให้ทำตามลำดับนี้จะ debug ง่ายที่สุด:

1. เปิด backend ให้เรียก API ผ่าน Postman/curl ได้ก่อน
2. เพิ่ม `.env.local` พร้อม `VITE_API_BASE_URL`
3. สร้าง `src/lib/api.js` และใส่ `credentials: "include"`
4. ตรวจ `src/context/AuthContext.jsx` ที่มีอยู่แล้วให้ใช้ base URL/path เช็ค session ตรงกับ backend จริง
5. ยืนยันว่า `<App />` ถูก wrap ด้วย `<AuthProvider>` แล้ว
6. ตรวจ Login ที่มีอยู่แล้วว่ายิง `POST /users/login` และ set user จาก response ได้จริง
7. ยืนยันว่า BookDetail ใช้ endpoint backend จริง: `/producsts/:id`, `/reviews/:id`, `/favorites`, `/cart`
8. เปิดหน้า `/bookDetail/:id` แล้วดูว่าโหลด book ได้
9. Login แล้วลอง Like
10. Login แล้วลอง Add to Cart
11. Login แล้วลอง Submit Review
12. รัน `npm run build` เพื่อเช็คว่า import และ bundle ผ่าน

---

## 15. Checklist สำหรับทดสอบ BookDetail

### ทดสอบแบบไม่ login

- เปิด `/bookDetail/:id` แล้วเห็นข้อมูลหนังสือ
- เห็นปุ่ม Like
- เห็นปุ่ม Add to Cart
- เห็นข้อความให้ login ก่อนเขียน review
- กด Like แล้วไปหน้า `/login`
- กด Add to Cart แล้วไปหน้า `/login`

### ทดสอบหลัง login

- เปิด `/bookDetail/:id` แล้วหน้าโหลดเสร็จโดยไม่ค้าง
- ถ้าเล่มนี้เคย like แล้ว ปุ่มต้องขึ้น `Liked`
- กด Like แล้วสถานะ toggle ได้
- กด Add to Cart แล้ว badge ใน navbar เพิ่ม
- เขียน review แล้ว review ใหม่แสดงใน list
- refresh หน้าแล้วข้อมูลยังตรงกับ backend

### ทดสอบ error case

- ปิด backend แล้วเปิดหน้า book detail ต้องไม่เกิดหน้า blank
- ใช้ book id ที่ไม่มีจริง ต้อง redirect หรือแสดง not found ตามที่ตกลงกัน
- ใช้ token หมดอายุ ต้องไม่ยิง favorite/cart/review สำเร็จแบบผิด ๆ
- backend ส่ง `rating` หรือ `price` เป็น format แปลก ต้องไม่ทำให้หน้า crash

---

## 16. คำสั่งตรวจสอบก่อนส่งงาน

รันจาก root ของ frontend project:

```bash
npm run build
```

ถ้าผ่าน แปลว่า import/module syntax ไม่มีปัญหาระดับ build

รัน dev server:

```bash
npm run dev
```

เปิด:

```txt
http://localhost:5173/bookDetail/<book-id>
```

แล้วเปิด browser DevTools:

- Console: ต้องไม่มี error แดงจาก React/fetch
- Network: request ไป backend ต้องได้ status 200/201 ตาม flow
- Application > Cookies: ต้องเห็น cookie `accessToken` หลัง login
- Application > Local Storage: ถ้าเก็บ user cache เพิ่มเอง ต้องตรงกับ state ที่ `AuthContext` ใช้

---

## 17. สถานะหลังเริ่มแก้ตาม checklist

ทำแล้วในรอบนี้:

1. เพิ่ม `src/lib/api.js` ให้ตรงกับ import `../lib/api`
2. ใน `apiFetch` ใช้ `credentials: "include"` เพราะ backend auth อ่าน cookie
3. sync `BookDetail.jsx` กับ `AuthContext.jsx` โดยเพิ่ม `isLoggedIn` alias
4. ปรับ `AuthContext.jsx` ให้ใช้ `apiFetch` ที่อ่าน `VITE_API_BASE_URL`
5. แก้ endpoint เช็ค session ใน `AuthContext.jsx` จาก `/users/me` เป็น `/users/auth/me`
6. ทำให้ `BookDetail.jsx` แปลง `rating` เป็น number ก่อนเรียก `.toFixed(1)`
7. ทำให้ review form รอผล submit ก่อนแสดงข้อความสำเร็จ
8. รัน `npm run build` แล้วผ่าน

ยังต้องทดสอบกับ backend จริง:

1. ยืนยันว่า response จาก `getMe()` มี `data._id` เพราะ `BookDetail.jsx` ใช้ `user._id` ตอน add cart และ submit review
2. ยืนยัน endpoint backend จริง: `/producsts/:id`, `/reviews/:id`, `/favorites`, `/cart`
3. เช็ค response shape ของ book/review/favorite/cart ให้ตรงกับที่ `BookDetail.jsx` map อยู่
4. ระวัง review username เพราะ backend ยังไม่ populate `user_id`
5. ระวัง cart duplicate เพราะ backend `POST /cart` create cart document ใหม่ทุกครั้ง

เมื่อรายการนี้ครบ หน้า `BookDetail.jsx` จะพร้อมต่อ API backend ได้จริงและทดสอบ flow รายละเอียดหนังสือ, review, favorite, cart ได้ครบ

---

## 18. แนวทางเริ่มทำแบบไม่กระทบงานเพื่อน

ถ้างานนี้เป็นงานกลุ่ม และต้องการให้ส่วน `BookDetail.jsx` ใช้งาน API ได้โดยไม่ไปเปลี่ยนพฤติกรรมหน้าอื่น แนะนำให้เริ่มแบบ `BookDetail-only integration` ก่อน

เป้าหมายของแนวทางนี้คือ:

- ทำให้ `BookDetail.jsx` compile ผ่าน
- ทำให้หน้า BookDetail โหลด book/review จาก backend ได้
- ทดสอบ Like, Add to Cart, Review ได้
- ลดการแก้ไฟล์ของเพื่อนให้มากที่สุด
- ยังไม่เปลี่ยนระบบ login/navbar/home/product list ทั้งแอป

### 18.1 สร้าง branch แยกก่อน

ก่อนเริ่มแก้ code ควรแยก branch เพื่อไม่ให้ปนกับงานของเพื่อน:

```bash
git checkout -b feature/bookdetail-api
```

ถ้าทีมมี naming convention อยู่แล้ว ให้ใช้ชื่อตามทีม เช่น:

```bash
git checkout -b jay/bookdetail-api
```

### 18.2 จำกัดไฟล์ที่ควรแตะ

ไฟล์ที่ควรแตะในรอบแรกจากสถานะ repo ปัจจุบัน:

```txt
src/lib/api.js
src/context/AuthContext.jsx
src/pages/BookDetail.jsx
```

เหตุผล:

- `src/lib/api.js` จำเป็น เพราะ `BookDetail.jsx` import `apiFetch`
- `src/context/AuthContext.jsx` มีอยู่แล้ว แต่ต้อง sync base URL, session path `/users/auth/me`, และชื่อ `isLoggedIn`/`isAuthenticated`
- `src/pages/BookDetail.jsx` แตะเฉพาะถ้าต้องปรับ path/response mapping เล็กน้อยให้ตรง backend
- `src/main.jsx` ไม่จำเป็นต้องแตะในรอบแรก เพราะ wrap `<AuthProvider>` แล้ว

ไฟล์ที่ควรหลีกเลี่ยงในรอบแรก:

```txt
src/components/HomeComponents/NavBar.jsx
src/pages/Home.jsx
src/pages/ProductList.jsx
src/context/CartContext.jsx
src/App.jsx
```

เหตุผล:

- หน้าเหล่านี้มีโอกาสเป็นงานของเพื่อน
- ถ้าแก้ NavBar ทันที จะกระทบ behavior ทั้งแอป
- ถ้าแก้ ProductList/Home ทันที อาจกระทบ data flow หรือ UI ที่คนอื่นรับผิดชอบ

### 18.3 ทำ `AuthContext` แบบ minimal ก่อน

`AuthContext` รอบแรกควรทำแค่ให้ `BookDetail.jsx` ใช้งานได้ โดยแก้ contract ที่ไม่ตรงกันก่อน

สิ่งที่ต้อง expose:

```txt
user
isLoggedIn
isLoading
```

แนวคิด:

1. ตอน app load ให้เรียก `GET /users/auth/me`
2. ถ้า backend ตอบ success ให้ set `user`
3. ถ้า fail ให้ถือว่า user ยังไม่ login
4. หน้าอื่นที่ไม่ได้เรียก `useAuth()` จะไม่ได้รับผลกระทบ

ข้อดี:

- ไม่ต้องแก้ `NavBar.jsx` ทันที
- `BookDetail.jsx` หยุด build fail จาก missing import
- สามารถทดสอบ BookDetail กับ backend ได้ก่อน

### 18.4 ทำ `apiFetch` ให้ใช้ cookie backend

backend ปัจจุบันใช้ cookie `accessToken` ดังนั้น `apiFetch` ต้องมี:

```js
credentials: "include"
```

ถ้าไม่มีบรรทัดนี้ request ไป `/favorites`, `/cart`, `/reviews` อาจไม่มี cookie ติดไปด้วย และ backend จะมองว่าไม่ได้ login

### 18.5 หน้า Login มี flow จริงแล้ว แต่ยังใช้ทดสอบผ่าน DevTools ได้

ถ้าต้องการทดสอบ BookDetail แบบ login แล้ว แต่ยังไม่อยากไล่ debug หน้า Login พร้อมกัน ให้ login ผ่าน browser DevTools console ได้ชั่วคราว

ตัวอย่าง:

```js
fetch("http://localhost:<PORT>/api/users/login", {
  method: "POST",
  credentials: "include",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    email: "your@email.com",
    password: "your-password"
  })
});
```

หลังยิงคำสั่งนี้:

1. backend จะ set cookie `accessToken`
2. refresh หน้า `/bookDetail/:id`
3. `AuthContext` จะเรียก endpoint เช็ค session `/users/auth/me`
4. ถ้า cookie valid หน้า BookDetail จะรู้ว่า login แล้ว

วิธีนี้ช่วยแยกการทดสอบ Like, Add to Cart, Review ออกจากปัญหาหน้า Login ได้

### 18.6 ทดสอบทีละชั้น

ลำดับทดสอบที่แนะนำ:

1. เปิด backend ให้ทำงานก่อน
2. เปิด frontend ด้วย `npm run dev`
3. เปิด `/bookDetail/<book-id>` แบบยังไม่ login
4. เช็คว่า book detail โหลดได้
5. เช็คว่า reviews โหลดได้
6. login ผ่าน DevTools console
7. refresh หน้า BookDetail
8. เช็คว่า UI เปลี่ยนเป็นสถานะ login
9. กด Like
10. กด Add to Cart
11. Submit Review
12. รัน `npm run build`

ถ้าขั้นไหนพัง ให้แก้เฉพาะขั้นนั้นก่อน อย่าข้ามไปแก้หลาย flow พร้อมกัน เพราะจะไล่ bug ยาก

### 18.7 สิ่งที่ยังไม่ควรทำจนกว่าคุยกับทีม

งานเหล่านี้ควรรอคุยกับทีมก่อน เพราะกระทบหลายหน้า:

- เปลี่ยน `NavBar.jsx` ให้ใช้ `useAuth`
- เปลี่ยน cart จาก localStorage เป็น backend cart ทั้งหมด
- เปลี่ยน route `/producsts` เป็น `/products` หรือ `/books`
- เปลี่ยน response shape ของ backend เช่น `message` เป็น `data`
- เปลี่ยน link จากหน้า Home/ProductList ถ้ายังไม่แน่ใจว่าเพื่อนใช้ field id แบบไหน

### 18.8 สรุปแนวทางที่ปลอดภัยที่สุด

เริ่มจากเพิ่มของที่ `BookDetail.jsx` ต้องใช้ให้ครบก่อน:

```txt
apiFetch + sync AuthContext + existing AuthProvider
```

จากนั้นทดสอบหน้า BookDetail ด้วย backend จริง โดยใช้ Login ปัจจุบันหรือ login ผ่าน DevTools console ชั่วคราว ถ้าทุกอย่างทำงานแล้วค่อยคุยกับทีมว่าจะเชื่อม NavBar/Cart ทั้งระบบต่ออย่างไร

แนวทางนี้จะทำให้ส่วนของ BookDetail ใช้งานได้และทดสอบได้ โดยลดโอกาสกระทบ code ของเพื่อนให้น้อยที่สุด

# 📚 Readly — Online Bookstore

> **A modern, full-featured online bookstore built with React 19 — Group Project 03, Sprint 02 (JSD12)**

Readly is a single-page application (SPA) that provides a seamless book browsing, shopping, and management experience. Customers can explore a curated catalog, add books to their cart and favorites, write reviews, apply coupon codes, and complete purchases — while administrators have access to a full dashboard for managing products, users, orders, coupons, and feedback.

---

## ✨ Features

### 🛒 Customer-Facing

| Feature | Description |
|---|---|
| **Home Page** | Hero section, promotional banners, and category-based book showcase |
| **Product List** | Browse all books with category filtering and pagination |
| **Book Detail** | View book information, rating, reviews — add to cart or favorites |
| **Shopping Cart** | Slide-out cart panel with quantity controls, synced with backend |
| **Favorites** | Toggle "Like" on books, view favorites in a popup via the NavBar |
| **Reviews & Ratings** | Authenticated users can write reviews with star ratings (MUI Rating) |
| **Coupon System** | Apply coupon codes at checkout for discounts |
| **Payment Page** | Order summary, coupon application, and checkout flow with success confirmation |
| **User Settings** | Edit profile, shipping address, payment method, and change password |
| **Authentication** | Register, login, and session-based auth with cookie credentials |

### 🔧 Admin Panel

| Feature | Description |
|---|---|
| **Dashboard** | Data overview and analytics with D3.js visualizations |
| **Product Catalog** | CRUD operations for managing books (MUI DataGrid) |
| **User Catalog** | View and manage registered users |
| **Order Management** | Track and update customer orders |
| **Coupon Code** | Create, update, and delete promotional coupons |
| **Feedbacks** | View customer feedback submissions |

---

## 🛠️ Tech Stack

### Frontend

| Technology | Version | Purpose |
|---|---|---|
| **React** | 19.x | UI library |
| **React Router DOM** | 7.x | Client-side routing (SPA) |
| **Vite** | 6.x | Build tool & dev server |
| **Tailwind CSS** | 4.x | Utility-first CSS framework |
| **MUI (Material UI)** | 9.x | UI components (Rating, Pagination, DataGrid) |
| **Radix UI** | 1.x | Headless UI primitives |
| **shadcn/ui** | 4.x | Pre-built accessible components |
| **Lucide React** | 1.x | Icon library |
| **D3.js** | 7.x | Data visualization (Admin Dashboard) |
| **Playfair Display** | — | Primary display font (Google Fonts) |
| **Geist** | — | Secondary font (@fontsource-variable) |

### Backend (External API)

The frontend communicates with a RESTful backend API via `fetch` with cookie-based session authentication (`credentials: "include"`).

- **Base URL**: Configurable via `VITE_API_BASE_URL` environment variable
- **Default**: `http://localhost:3000/api`

### Deployment

| Platform | Config |
|---|---|
| **Vercel** | SPA rewrite rules configured in `vercel.json` |

---

## 📁 Project Structure

```
group_project_03_sprint_02/
├── public/                          # Static assets
├── src/
│   ├── Api/
│   │   └── CartApi.js               # Cart CRUD API functions
│   ├── assets/
│   │   ├── banner/                  # Banner images
│   │   └── BgLoginAndRegiter/       # Auth page backgrounds
│   ├── components/
│   │   ├── AdminComponents/
│   │   │   ├── Admin.jsx            # Admin layout wrapper
│   │   │   ├── Dashboard.jsx        # Analytics dashboard (D3)
│   │   │   ├── NavBarAdmin.jsx      # Admin navigation bar
│   │   │   └── TableGrid.jsx        # Data tables (Product, User, Order, Coupon, Feedback)
│   │   ├── BookDetailComponents/
│   │   │   ├── ReviewSection.jsx    # Review list display
│   │   │   └── WriteReviewForm.jsx  # Review submission form
│   │   ├── CardComponents/
│   │   │   ├── BookCard.jsx         # Book card (grid & slider variants)
│   │   │   ├── BookItemCard.jsx     # Book item card
│   │   │   ├── ReviewCard.jsx       # Individual review card
│   │   │   └── SlideBooks.jsx       # Horizontal book slider
│   │   ├── HomeComponents/
│   │   │   ├── Banner.jsx           # Promotional banner
│   │   │   ├── Cart.jsx             # Slide-out shopping cart
│   │   │   ├── CategorySample.jsx   # Category showcase section
│   │   │   ├── Footer.jsx           # Site footer
│   │   │   ├── Hero.jsx             # Hero section
│   │   │   ├── LoginFirstPopup.jsx  # Login prompt popup
│   │   │   └── NavBar.jsx           # Main navigation (search, cart, favorites, auth)
│   │   ├── ui/                      # Reusable UI primitives (shadcn)
│   │   ├── CategoryFilter.jsx       # Category filter component
│   │   ├── PopupModal.jsx           # Generic popup modal
│   │   └── StarRating.jsx           # Star rating display
│   ├── context/
│   │   ├── AuthContext.jsx          # Authentication state (login, logout, session)
│   │   ├── BookContext.jsx          # Book catalog state (fetch & normalize products)
│   │   ├── CartContext.jsx          # Shopping cart state (CRUD, sync with backend)
│   │   └── FavoriteContext.jsx      # Favorites state (toggle, fetch liked books)
│   ├── lib/
│   │   ├── api.js                   # Centralized API fetch utility
│   │   └── utils.js                 # General utility functions
│   ├── mock-data/
│   │   ├── bookData.js              # Sample book data
│   │   ├── couponData.js            # Sample coupon data
│   │   └── reviewData.js            # Sample review data
│   ├── pages/
│   │   ├── BookDetail.jsx           # Book detail page with reviews & add to cart
│   │   ├── Home.jsx                 # Home page (customer) / Admin panel (admin)
│   │   ├── Login.jsx                # Login page
│   │   ├── PaymentPage.jsx          # Checkout & payment page
│   │   ├── ProductList.jsx          # Paginated product listing with filters
│   │   ├── Register.jsx             # Registration page
│   │   └── SettingsPage.jsx         # User settings (profile, address, payment, password)
│   ├── App.jsx                      # Router configuration
│   ├── main.jsx                     # App entry point with context providers
│   └── index.css                    # Global styles
├── documentation/
│   ├── 01_popup-modal.md            # Popup/modal design docs
│   ├── 02_component-breakdown.md    # Component architecture breakdown
│   ├── 03_api-specification.csv     # Full API endpoint specification
│   ├── 04_bookdetail-api-integration-checklist.md
│   └── 05_navbar-favorite-popup-integration.md
├── index.html                       # HTML entry point
├── vite.config.js                   # Vite configuration (React + Tailwind + alias)
├── vercel.json                      # Vercel SPA rewrite config
├── components.json                  # shadcn/ui configuration
├── package.json                     # Dependencies & scripts
└── eslint.config.js                 # ESLint configuration
```

---

## 🔗 API Endpoints

The application connects to a RESTful backend. Below is a summary of all endpoints:

### Authentication & Users

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/auth/signup` | Register a new account |
| `POST` | `/auth/login` | Login (returns session cookie) |
| `GET` | `/users/me` | Get current user profile |
| `PATCH` | `/users/me` | Update current user profile |
| `GET` | `/users` | [Admin] List all users |
| `PATCH` | `/users/:userId` | [Admin] Update a user |
| `DELETE` | `/users/:userId` | [Admin] Delete a user |

### Products (Books)

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/books` | List books (supports `?search=` and `?category=`) |
| `GET` | `/books/:id` | Get a single book's details |
| `POST` | `/books` | [Admin] Add a new book |
| `PATCH` | `/books/:id` | [Admin] Update a book |
| `DELETE` | `/books/:id` | [Admin] Delete a book |
| `GET` | `/categories` | Get all category names |

### Cart

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/cart/:userId` | Get user's cart |
| `POST` | `/cart` | Create a new cart |
| `PATCH` | `/cart/:cartId` | Update cart items |
| `DELETE` | `/cart/:cartId` | Delete a cart |

### Orders

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/orders` | Create order (checkout) |
| `GET` | `/orders/me` | Get user's order history |
| `GET` | `/orders` | [Admin] Get all orders |
| `PATCH` | `/orders/:id` | [Admin] Update order status |

### Reviews

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/reviews/:bookId` | Get reviews for a book |
| `POST` | `/reviews` | Submit a new review |
| `DELETE` | `/reviews/:id` | [Admin] Delete a review |

### Favorites

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/favorites` | Get user's favorite books |
| `POST` | `/favorites/:bookId` | Toggle favorite for a book |

### Coupons

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/coupons/validate` | Validate a coupon code |
| `POST` | `/coupons` | [Admin] Create a coupon |
| `PATCH` | `/coupons/:id` | [Admin] Update a coupon |
| `DELETE` | `/coupons/:id` | [Admin] Delete a coupon |

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** ≥ 18.x
- **npm** ≥ 9.x
- Backend API server running (or accessible via URL)

### Installation

```bash
# 1. Clone the repository
git clone https://github.com/NattagornSH/group_project_03_sprint_02.git

# 2. Navigate to the project directory
cd group_project_03_sprint_02

# 3. Install dependencies
npm install
```

### Environment Variables

Create a `.env` file in the project root:

```env
VITE_API_BASE_URL=http://localhost:3000/api
```

> Replace the URL with your backend API server address.

### Development

```bash
# Start the development server
npm run dev
```

The app will be available at `http://localhost:5173` (default Vite port).

### Build for Production

```bash
# Build optimized bundle
npm run build

# Preview the production build
npm run preview
```

### Linting

```bash
npm run lint
```

---

## 🗺️ Routing

| Path | Page | Description |
|---|---|---|
| `/` | Home | Landing page (Customer) / Admin Panel (Admin users) |
| `/productList` | Product List | Browse & filter all books with pagination |
| `/bookDetail/:id` | Book Detail | Individual book view with reviews |
| `/login` | Login | User login form |
| `/register` | Register | New user registration form |
| `/paymentPage` | Payment | Checkout & payment with coupon support |
| `/setting` | Settings | User profile, address, payment, and password management |

---

## 🏗️ Architecture

### State Management

The app uses **React Context API** with four global providers:

```
AuthProvider          → User authentication & session management
  └── BookProvider    → Book catalog data fetching & normalization
    └── FavoriteProvider → User's favorite books (toggle, check)
      └── CartProvider   → Shopping cart CRUD (synced with backend)
```

### API Layer

- **`src/lib/api.js`** — Centralized `apiFetch()` utility wrapping `fetch` with:
  - Automatic `Content-Type: application/json` headers
  - Cookie-based credentials (`credentials: "include"`)
  - JSON response parsing with error handling
- **`src/Api/CartApi.js`** — Dedicated cart API functions (`createCart`, `updateCart`, `deleteCart`, `getCartByUserId`)

### Design System

- **Color Palette**: Warm earth tones (`#A66858`, `#2c1810`, `#FAF4F1`, `#EEE1DB`)
- **Typography**: Playfair Display (headings), Cormorant Garamond (body), Geist (UI)
- **Styling**: Tailwind CSS 4 utility classes with component-level inline styles
- **Icons**: Lucide React icon library
- **UI Components**: MUI (Rating, Pagination, DataGrid) + shadcn/ui primitives

---

## 👥 Team Members

| GitHub Username | Contributions |
|---|---|
| **NattagornSH** | Project setup, repository management |
| **Sahatsawat-Wattana** | Admin panel, cart integration, debugging |
| **Nantanat-Poyomratanasin** | UI components, feature development |
| **emmikapk-bit** | Feature development |
| **jetwat** | Feature development |
| **phongphon1611** | Feature development |

---

## 📄 Documentation

Detailed documentation is available in the [`documentation/`](./documentation) directory:

- [Popup Modal Design](./documentation/01_popup-modal.md)
- [Component Breakdown](./documentation/02_component-breakdown.md)
- [API Specification](./documentation/03_api-specification.csv)
- [BookDetail API Integration Checklist](./documentation/04_bookdetail-api-integration-checklist.md)
- [NavBar & Favorite Popup Integration](./documentation/05_navbar-favorite-popup-integration.md)

---

## 📝 License

This project is developed as part of the **Generation Thailand — Junior Software Developer Bootcamp (JSD12)**.

---

<p align="center">
  Built with ❤️ by <strong>Group 03</strong> — JSD12, Generation Thailand
</p>

import { createBrowserRouter } from "react-router-dom";
import { RouterProvider } from "react-router-dom";

import Home from "./pages/Home";
import SettingsPage from "./pages/SettingsPage";
import BookDetail from "./pages/BookDetail";
import ProductList from "./pages/ProductList";
import Login from "./pages/Login";
import PaymentPage from "./pages/PaymentPage";
import Register from "./pages/Register";

const router = createBrowserRouter([
  { path: "/", element: <Home /> },
  { path: "/productList", element: <ProductList /> },
  {
    path: "/bookDetail/:id",
    element: <BookDetail />,
  },
  { path: "/setting", element: <SettingsPage /> },
  { path: "/login", element: <Login /> },
  { path: "/paymentPage", element: <PaymentPage /> },
  { path: "/register", element: <Register /> },
]);

export default function App() {
  // return <Home />;
  return <RouterProvider router={router} />;
}

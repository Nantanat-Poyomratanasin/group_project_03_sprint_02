import { NavBarAdmin } from "./NavBarAdmin";
import { Dashboard } from "./Dashboard";
import {
  ProductCatalogTable,
  UserCatalogTable,
  OrderManagementTable,
  CouponCodeTable,
  FeedbackTable
} from "./TableGrid";
import { useState } from "react";

// --- APP WRAPPER ---
export default function Admin() {
  // Set the default tab to Dashboard
  const [activeTab, setActiveTab] = useState("Dashboard");

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      {/* Pass the state and setter to the NavBar */}
      <NavBarAdmin activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* Conditionally render components based on the active tab */}
      <main className="max-w-[1600px] mx-auto w-full">
        {activeTab === "Dashboard" && <Dashboard />}
        {activeTab === "Product Catalog" && <ProductCatalogTable />}
        {activeTab === "User Catalog" && <UserCatalogTable />}
        {activeTab === "Order management" && <OrderManagementTable />}
        {activeTab === "Coupon code" && <CouponCodeTable />}
        {activeTab === "Feedbacks" && <FeedbackTable />}
      </main>
    </div>
  );
}

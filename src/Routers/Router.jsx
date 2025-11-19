// src/Routers/Router.jsx
import { Routes, Route, Navigate } from "react-router-dom";

import Layout from "../components/Layout/Layout";

// --- Các trang User ---
import HomePage from "../Pages/HomePage/HomePage";
import Tours from "../Pages/TourTab/Tours";
import TourDetailLayout from "../Pages/CityTourDetail/TourDetailLayout";
import TourBookingFlow from "../Pages/TourBookingFlow/TourBookingFlow"; // Trang Khách đặt tour
import OtherAi from "../Pages/OtherAi/OtherAi";
import Contact from "../Pages/Contact/Contact";
import Cart from "../Pages/Cart/Cart.jsx";
import MyBookingsPage from "../Pages/Booking/MyBookings.jsx";

// --- Các trang Admin (TourManagement) ---
import BookingAdminPage from "../Pages/TourManagement/BookingAdminPage.jsx";
import BookingListPage from "../Pages/TourManagement/BookingListPage.jsx";
import QuickCreatePage from "../Pages/TourManagement/QuickCreatePage.jsx";
import RevenuePage from "../Pages/TourManagement/RevenuePage.jsx";
import GuideStatusPage from "../Pages/TourManagement/GuideStatusPage.jsx";
import GuideManagerPage from "../Pages/TourManagement/GuideManagerPage.jsx";

export default function Router() {
  return (
    <Routes>
      {/* Layout chính */}
      <Route path="/" element={<Layout />}>
        
        {/* --- KHU VỰC KHÁCH HÀNG --- */}
        <Route index element={<HomePage />} />
        <Route path="tours" element={<Tours />} />
        <Route path="tours/:slug" element={<TourDetailLayout />} />
        
        {/* 🔥 SỬA LẠI: /booking sẽ trỏ vào trang Đặt Tour (Chọn HDV) */}
        <Route path="booking" element={<TourBookingFlow />} /> 
        
        <Route path="other-ai" element={<OtherAi />} />
        <Route path="contact" element={<Contact />} />
        <Route path="gio_hang" element={<Cart />} />
        <Route path="my-bookings" element={<MyBookingsPage />} />

        {/* --- KHU VỰC ADMIN --- */}
        <Route path="admin/bookings" element={<BookingAdminPage />}>
          <Route index element={<BookingListPage />} />
          <Route path="list" element={<BookingListPage />} />
          <Route path="create" element={<QuickCreatePage />} />
          <Route path="revenue" element={<RevenuePage />} />
          <Route path="guides" element={<GuideStatusPage />} />
          <Route path="guide-manager" element={<GuideManagerPage />} />
        </Route>

        {/* Redirect tất cả link lỗi về trang chủ */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  );
}
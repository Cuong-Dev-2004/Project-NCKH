import { Routes, Route, Navigate } from "react-router-dom";

import Layout from "../components/Layout/Layout.jsx";
import HomePage from "../Pages/HomePage/HomePage.jsx";
import Tours from "../Pages/TourTab/Tours.jsx";
import Booking from "../Pages/Booking/Booking.jsx";
import TourBookingFlow from "../Pages/TourBookingFlow/TourBookingFlow.jsx";
import OtherAi from "../Pages/OtherAi/OtherAi.jsx";
import Contact from "../Pages/Contact/Contact.jsx";
import Cart from "../Pages/Cart/Cart.jsx";
import TourDetailLayout from "../Pages/CityTourDetail/TourDetailLayout.jsx";

// Khách xem đơn
import MyBookingsPage from "../Pages/Booking/MyBookings.jsx";

// ADMIN
import BookingAdminPage from "../Pages/TourManagement/BookingAdminPage.jsx";
import BookingListPage from "../Pages/TourManagement/BookingListPage.jsx";
import QuickCreatePage from "../Pages/TourManagement/QuickCreatePage.jsx";
import RevenuePage from "../Pages/TourManagement/RevenuePage.jsx";

export default function Router() {
  return (
    <Routes>
      {/* Layout tổng */}
      <Route path="/" element={<Layout />}>

        {/* Trang chính */}
        <Route index element={<HomePage />} />
        <Route path="tours" element={<Tours />} />
        <Route path="tours/:slug" element={<TourDetailLayout />} />
        <Route path="booking" element={<Booking />} />
        <Route path="tour-booking-flow" element={<TourBookingFlow />} />
        <Route path="other-ai" element={<OtherAi />} />
        <Route path="contact" element={<Contact />} />
        <Route path="gio_hang" element={<Cart />} />

        {/* ⭐ NEW: Trang danh sách đơn của khách */}
        <Route path="my-bookings" element={<MyBookingsPage />} />

        {/* ADMIN */}
        <Route path="admin/bookings" element={<BookingAdminPage />}>
          <Route index element={<BookingListPage />} />
          <Route path="list" element={<BookingListPage />} />
          <Route path="create" element={<QuickCreatePage />} />
          <Route path="revenue" element={<RevenuePage />} />
        </Route>

        {/* Redirect tất cả đường dẫn lỗi */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  );
}

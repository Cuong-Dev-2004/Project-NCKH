// src/Routers/Router.jsx
import { Routes, Route, Navigate } from "react-router-dom";
import Layout from "../components/Layout/Layout";

// ... Các import trang User ...
import HomePage from "../Pages/HomePage/HomePage";
import Tours from "../Pages/TourTab/Tours";
import TourDetailLayout from "../Pages/CityTourDetail/TourDetailLayout";
import TourBookingFlow from "../Pages/TourBookingFlow/TourBookingFlow";
import OtherAi from "../Pages/OtherAi/OtherAi";
import Contact from "../Pages/Contact/Contact";
import Cart from "../Pages/Cart/Cart.jsx";
import MyBookingsPage from "../Pages/Booking/MyBookings.jsx";

// 🔥 SỬA ĐƯỜNG DẪN NÀY NẾU CHƯA SỬA (Thư mục Auth)
import LoginPage from "../Pages/Auth/LoginPage";
import RegisterPage from "../Pages/Auth/RegisterPage";

// ... Các import trang Admin ...
import BookingAdminPage from "../Pages/TourManagement/BookingAdminPage.jsx";
import BookingListPage from "../Pages/TourManagement/BookingListPage.jsx";
import QuickCreatePage from "../Pages/TourManagement/QuickCreatePage.jsx";
import RevenuePage from "../Pages/TourManagement/RevenuePage.jsx";
import GuideStatusPage from "../Pages/TourManagement/GuideStatusPage.jsx";
import GuideManagerPage from "../Pages/TourManagement/GuideManagerPage.jsx";

import { AuthProvider } from "../utils/authContext";
import ProtectedRoute from "./ProtectedRoute"; 

export default function Router() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        <Route path="/" element={<Layout />}>
          <Route index element={<HomePage />} />
          <Route path="tours" element={<Tours />} />
          <Route path="tours/:slug" element={<TourDetailLayout />} />
          <Route path="booking" element={<TourBookingFlow />} /> 
          <Route path="other-ai" element={<OtherAi />} />
          <Route path="contact" element={<Contact />} />
          <Route path="gio_hang" element={<Cart />} />

          <Route element={<ProtectedRoute />}>
             <Route path="my-bookings" element={<MyBookingsPage />} />
          </Route>

          <Route element={<ProtectedRoute requireAdmin={true} />}>
            <Route path="admin/bookings" element={<BookingAdminPage />}>
              <Route index element={<BookingListPage />} />
              <Route path="list" element={<BookingListPage />} />
              <Route path="create" element={<QuickCreatePage />} />
              <Route path="revenue" element={<RevenuePage />} />
              <Route path="guides" element={<GuideStatusPage />} />
              <Route path="guide-manager" element={<GuideManagerPage />} />
            </Route>
          </Route>

          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </AuthProvider>
  );
}
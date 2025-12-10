import { Routes, Route, Navigate } from "react-router-dom";
import Layout from "../components/Layout/Layout";

import HomePage from "../Pages/HomePage/HomePage";
import Tours from "../Pages/TourTab/index.jsx";
import TourDetailLayout from "../Pages/CityTourDetail/TourDetailLayout";
import TourBookingFlow from "../Pages/TourBookingFlow/TourBookingFlow";
import OtherAi from "../Pages/OtherAi/OtherAi";
import Contact from "../Pages/Contact/Contact";
import Cart from "../Pages/Cart/Cart.jsx";

import LoginPage from "../Pages/Auth/LoginPage";
import RegisterPage from "../Pages/Auth/RegisterPage";


export default function Router() {
  return (
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
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  );
}
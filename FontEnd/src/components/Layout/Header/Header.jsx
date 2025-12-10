import React, { useEffect, useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { getToken, removeToken } from "../../../utils/auth";
import { FaShoppingBasket, FaUser } from "react-icons/fa";
import { IoIosLogOut } from "react-icons/io";

function Header() {
  const [cartCount, setCartCount] = useState(0);

  const base =
    "inline-flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200";
  const link = base + " text-gray-700 hover:text-blue-600 hover:bg-gray-50";
  const active = base + " text-blue-600 bg-blue-50 font-bold";

  const navItems = [
    { to: "/", label: "Trang Chủ", end: true },
    { to: "/tours", label: "Tour" },
    { to: "/booking", label: "Đặt Tour" },
    { to: "/contact", label: "Liên Hệ" },
  ];

  const token = getToken();

  const loadCartCount = () => {
    const arr = JSON.parse(localStorage.getItem("ArrayProduct")) || [];
    const totalQty = arr.length;
    setCartCount(totalQty);
  };

  useEffect(() => {
    loadCartCount();

    window.addEventListener("storage", loadCartCount);

    return () => window.removeEventListener("storage", loadCartCount);
  }, []);

  useEffect(() => {
    const interval = setInterval(loadCartCount, 500);
    return () => clearInterval(interval);
  }, []);

  const handleLogout = () => {
    removeToken();
    window.location.reload();
  };

  return (
    <header className="bg-white/95 backdrop-blur shadow-sm sticky top-0 z-50 border-b border-gray-100 font-sans">
      <div className="max-w-[1400px] mx-auto px-4">
        <div className="h-16 flex items-center justify-between gap-6">

          {/* Logo */}
          <Link
            to="/"
            className="text-2xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600 whitespace-nowrap flex items-center gap-2"
          >
            TravelTour
          </Link>

          {/* Menu */}
          <nav className="hidden md:flex items-center gap-1">
            {navItems.map((it) => (
              <NavLink
                key={it.to}
                to={it.to}
                end={it.end}
                className={({ isActive }) => (isActive ? active : link)}
              >
                {it.label}
              </NavLink>
            ))}
          </nav>

          {/* User / Cart */}
          <div className="flex items-center gap-3">

            {/* Giỏ hàng */}
            <Link
              to="/gio_hang"
              className="relative p-2 rounded-full hover:bg-gray-100 text-gray-600 flex items-center gap-2 transition-colors"
              title="Xem giỏ hàng"
            >
              <FaShoppingBasket size={20} />

              {/* Badge số lượng */}
              {cartCount > 0 && (
                <span
                  className="
                    absolute -top-1 -right-1 bg-red-600 text-white 
                    text-xs font-bold rounded-full h-5 w-5 flex 
                    items-center justify-center shadow-lg
                  "
                >
                  {cartCount}
                </span>
              )}

              <span className="hidden sm:inline text-sm font-medium">Giỏ hàng</span>
            </Link>

            <div className="h-6 w-px bg-gray-200 mx-1"></div>

            {!token ? (
              <div className="flex items-center gap-2 animate-fade-in">
                <Link
                  to="/login"
                  className="px-4 py-2 text-sm font-bold text-gray-700 hover:text-blue-600 transition-colors"
                >
                  Đăng nhập
                </Link>

                <Link
                  to="/register"
                  className="px-4 py-2 text-sm font-bold bg-blue-600 text-white rounded-full 
                  hover:bg-blue-700 shadow-md hover:shadow-lg transition-all transform active:scale-95"
                >
                  Đăng ký
                </Link>
              </div>
            ) : (
              <div className="flex items-center gap-3 animate-fade-in">
                <FaUser size={22} className="text-blue-600" />

                <button
                  onClick={handleLogout}
                  className="flex items-center gap-2 px-3 py-2 text-sm font-semibold 
                  text-red-600 hover:bg-red-50 rounded-lg transition"
                >
                  <IoIosLogOut size={18} />
                  Đăng xuất
                </button>
              </div>
            )}
          </div>

        </div>
      </div>
    </header>
  );
}

export default Header;

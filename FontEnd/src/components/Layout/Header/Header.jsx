import React from "react";
import { Link, NavLink } from "react-router-dom";

function Header() {
  const base = "inline-flex items-center px-3 py-2 rounded-md text-sm font-medium";
  const link = base + " text-gray-700 hover:text-blue-600";
  const active = base + " text-blue-600";

  // Chỉ dùng những route đang có trong Router.jsx
  const navItems = [
    { to: "/", label: "Trang Chủ", end: true },
    { to: "/tours", label: "Tour" },
    { to: "/booking", label: "Đặt Tour" },
    { to: "/my-bookings", label: "Đơn của tôi" },
    { to: "/contact", label: "Liên Hệ" },
    { to: "/admin/bookings", label: "Quản lý Đặt Tour", admin: true },
  ];

  return (
    <header className="bg-white/90 backdrop-blur shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="h-16 flex items-center justify-between gap-6">
          {/* Logo */}
          <Link
            to="/"
            className="text-2xl font-bold text-blue-600 whitespace-nowrap"
          >
            TravelTour
          </Link>

          {/* Nav */}
          <nav className="flex items-center gap-2 flex-1 justify-center">
            {navItems.map((it) => (
              <NavLink
                key={it.to}
                to={it.to}
                end={it.end}
                className={({ isActive }) => (isActive ? active : link)}
              >
                {it.label}
                {it.admin && (
                  <span className="ml-2 text-[10px] px-1.5 py-0.5 rounded bg-blue-100 text-blue-700">
                    Admin
                  </span>
                )}
              </NavLink>
            ))}
          </nav>

          {/* Giỏ hàng */}
          <Link
            to="/gio_hang"
            className="inline-flex items-center px-3 py-2 rounded-md border text-sm hover:bg-gray-50 whitespace-nowrap"
          >
            🛒 <span className="ml-1">Giỏ hàng</span>
          </Link>
        </div>
      </div>
    </header>
  );
}

export default Header;

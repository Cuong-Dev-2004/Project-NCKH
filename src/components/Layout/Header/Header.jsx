import React from "react";
import { Link, NavLink } from "react-router-dom";
// 🔥 SỬA LẠI DÒNG NÀY (Thêm một dấu ../ nữa là 3 cái)
import { useAuth } from "../../../utils/authContext"; 
import { LogOut, User, ShoppingCart, LayoutDashboard } from "lucide-react";

function Header() {
  const { user, logout } = useAuth(); 

  // ... (Phần còn lại của Header giữ nguyên không cần sửa)
  const base = "inline-flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200";
  const link = base + " text-gray-700 hover:text-blue-600 hover:bg-gray-50";
  const active = base + " text-blue-600 bg-blue-50 font-bold";

  const navItems = [
    { to: "/", label: "Trang Chủ", end: true },
    { to: "/tours", label: "Tour" },
    { to: "/booking", label: "Đặt Tour" },
    { to: "/contact", label: "Liên Hệ" },
  ];

  return (
    <header className="bg-white/95 backdrop-blur shadow-sm sticky top-0 z-50 border-b border-gray-100 font-sans">
      <div className="max-w-[1400px] mx-auto px-4">
        <div className="h-16 flex items-center justify-between gap-6">
          
          <Link to="/" className="text-2xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600 whitespace-nowrap flex items-center gap-2">
            TravelTour
          </Link>

          <nav className="hidden md:flex items-center gap-1">
            {navItems.map((it) => (
              <NavLink key={it.to} to={it.to} end={it.end} className={({ isActive }) => (isActive ? active : link)}>
                {it.label}
              </NavLink>
            ))}

            {user && (
               <NavLink to="/my-bookings" className={({ isActive }) => (isActive ? active : link)}>
                 Đơn của tôi
               </NavLink>
            )}

            {user && user.role === 'admin' && (
              <NavLink to="/admin/bookings" className={({ isActive }) => (isActive ? active : link)}>
                <span className="flex items-center gap-1 text-indigo-600 font-bold">
                    <LayoutDashboard size={16}/> Quản lý (Admin)
                </span>
              </NavLink>
            )}
          </nav>

          <div className="flex items-center gap-3">
             <Link to="/gio_hang" className="relative p-2 rounded-full hover:bg-gray-100 text-gray-600 flex items-center gap-2 transition-colors" title="Xem giỏ hàng">
              <ShoppingCart size={20} />
              <span className="hidden sm:inline text-sm font-medium">Giỏ hàng</span>
            </Link>

            <div className="h-6 w-px bg-gray-200 mx-1"></div>

            {user ? (
              <div className="flex items-center gap-3 animate-fade-in">
                 <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center font-bold text-sm border border-indigo-200 uppercase">
                      {user.name ? user.name.charAt(0) : "U"}
                    </div>
                    <div className="flex flex-col">
                        <span className="text-sm font-bold text-gray-700 leading-tight max-w-[100px] truncate">
                        {user.name}
                        </span>
                        <span className="text-[10px] text-gray-400 font-medium uppercase leading-tight">
                            {user.role === 'admin' ? 'Admin' : 'Khách'}
                        </span>
                    </div>
                 </div>
                 <button onClick={logout} className="p-2 text-gray-400 hover:text-rose-600 hover:bg-rose-50 rounded-full transition-all" title="Đăng xuất">
                    <LogOut size={18} />
                 </button>
              </div>
            ) : (
              <div className="flex items-center gap-2 animate-fade-in">
                 <Link to="/login" className="px-4 py-2 text-sm font-bold text-gray-700 hover:text-blue-600 transition-colors">
                    Đăng nhập
                 </Link>
                 <Link to="/register" className="px-4 py-2 text-sm font-bold bg-blue-600 text-white rounded-full hover:bg-blue-700 shadow-md hover:shadow-lg transition-all transform active:scale-95">
                    Đăng ký
                 </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}

export default Header;
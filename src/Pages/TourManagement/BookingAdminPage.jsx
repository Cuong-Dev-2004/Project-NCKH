// src/Pages/TourManagement/BookingAdminPage.jsx
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { useMemo } from "react";
import { 
  List, 
  PlusCircle, 
  BarChart3, 
  Users, 
  LayoutDashboard,
  Contact // ✅ Import icon Contact
} from "lucide-react";

// Định nghĩa danh sách các Tab + Icon tương ứng
const tabs = [
  { value: "list",          label: "Danh sách đơn",      icon: List },
  { value: "create",        label: "Tạo đơn nhanh",      icon: PlusCircle },
  { value: "revenue",       label: "Thống kê doanh thu", icon: BarChart3 },
  { value: "guides",        label: "Trạng thái HDV",     icon: Users },
  { value: "guide-manager", label: "Quản lý Hồ sơ",      icon: Contact }, // ✅ Tab mới
];

export default function BookingAdminPage() {
  const nav = useNavigate();
  const { pathname } = useLocation();

  // Xác định tab hiện tại dựa trên URL
  const current = useMemo(() => {
    if (pathname.endsWith("/create"))        return "create";
    if (pathname.endsWith("/revenue"))       return "revenue";
    if (pathname.endsWith("/guides"))        return "guides";
    if (pathname.endsWith("/guide-manager")) return "guide-manager"; // ✅ Logic mới
    return "list";
  }, [pathname]);

  const goto = (v) => nav(`/admin/bookings/${v}`);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans">
      
      {/* HEADER ADMIN */}
      <header className="sticky top-0 z-30 bg-white/80 backdrop-blur-md border-b border-slate-200 shadow-sm">
        <div className="max-w-[1600px] mx-auto px-4 md:px-6 py-3">
          <div className="flex flex-col md:flex-row items-center gap-4 justify-between">
            
            {/* Logo / Title */}
            <div className="flex items-center gap-2">
              <div className="p-2 bg-indigo-600 rounded-lg text-white">
                <LayoutDashboard size={20} />
              </div>
              <h1 className="text-xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-sky-600">
                Quản lý Tour
              </h1>
            </div>

            {/* Navigation Tabs */}
            <div className="flex items-center bg-slate-100/50 p-1 rounded-xl border border-slate-200 overflow-x-auto max-w-full no-scrollbar">
              {tabs.map((t) => {
                const isActive = current === t.value;
                const Icon = t.icon;
                return (
                  <button
                    key={t.value}
                    onClick={() => goto(t.value)}
                    className={`
                      flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all whitespace-nowrap
                      ${isActive 
                        ? "bg-white text-indigo-600 shadow-sm border border-slate-100 scale-100" 
                        : "text-slate-500 hover:text-slate-700 hover:bg-slate-200/50"
                      }
                    `}
                  >
                    <Icon size={16} strokeWidth={isActive ? 2.5 : 2} />
                    {t.label}
                  </button>
                );
              })}
            </div>

            {/* Admin Badge */}
            <div className="hidden md:flex items-center gap-2 text-xs font-bold text-slate-400 uppercase tracking-wider bg-slate-100 px-3 py-1.5 rounded-full">
              <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
              Admin System
            </div>

          </div>
        </div>
      </header>

      {/* MAIN CONTENT */}
      <main className="max-w-[1600px] mx-auto px-4 md:px-6 py-6 animate-fade-in">
        <Outlet />
      </main>
    </div>
  );
}
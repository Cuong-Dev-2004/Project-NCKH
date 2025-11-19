import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { useMemo } from "react";

const tabs = [
  { value: "list", label: "Danh sách đơn" },
  { value: "create", label: "Tạo đơn nhanh" },
  { value: "revenue", label: "Thống kê doanh thu" },
];

export default function BookingAdminPage() {
  const nav = useNavigate();
  const { pathname } = useLocation();

  const current = useMemo(() => {
    if (pathname.endsWith("/create")) return "create";
    if (pathname.endsWith("/revenue")) return "revenue";
    return "list";
  }, [pathname]);

  const goto = (v) => nav(`/admin/bookings/${v}`);

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-50 via-indigo-50 to-white text-gray-900">
      <header className="sticky top-0 z-10 bg-white/70 backdrop-blur ring-1 ring-black/5">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center gap-3">
          <h1 className="text-2xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-sky-600 to-indigo-700">
            Quản lý Đặt Tour
          </h1>

          {/* Combobox chuyển trang */}
          <select
            value={current}
            onChange={(e) => goto(e.target.value)}
            className="rounded-xl px-3 py-2 bg-gray-50 focus:bg-white shadow-inner focus:outline-none focus:ring-2 focus:ring-sky-200"
          >
            {tabs.map((t) => (
              <option key={t.value} value={t.value}>{t.label}</option>
            ))}
          </select>

          {/* Tabs nhanh */}
          <div className="ml-2 flex items-center gap-2">
            {tabs.map((t) => (
              <button
                key={t.value}
                onClick={() => goto(t.value)}
                className={
                  "px-3 py-1.5 rounded-lg text-sm " +
                  (current === t.value
                    ? "bg-indigo-600 text-white"
                    : "bg-white text-gray-700 hover:bg-gray-100 ring-1 ring-black/5")
                }
              >
                {t.label}
              </button>
            ))}
          </div>

          <span className="ml-auto text-xs px-2 py-1 rounded-lg bg-indigo-50 text-indigo-700 border border-indigo-100">
            Admin
          </span>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-6">
        <Outlet />
      </main>
    </div>
  );
}

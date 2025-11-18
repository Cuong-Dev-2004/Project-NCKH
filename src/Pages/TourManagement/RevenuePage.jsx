import { useEffect, useMemo, useState } from "react";

const LS_KEY = "bookings_admin_demo_v1";
const vnd = (n) => (Number(n || 0)).toLocaleString("vi-VN") + "đ";

export default function RevenuePage() {
  const [data, setData] = useState([]);

  useEffect(() => {
    const raw = localStorage.getItem(LS_KEY);
    setData(raw ? JSON.parse(raw) : []);
  }, []);

  const byMonth = useMemo(() => {
    const m = {};
    for (const b of data) {
      const key = (b.checkinDate || "").slice(0, 7); // yyyy-mm
      if (!m[key]) m[key] = 0;
      m[key] += Number(b.total || 0);
    }
    return Object.entries(m).sort((a, b) => a[0].localeCompare(b[0]));
  }, [data]);

  const total = useMemo(() => data.reduce((s, x) => s + (x.total || 0), 0), [data]);

  return (
    <section className="grid lg:grid-cols-2 gap-6">
      <div className="rounded-2xl p-4 shadow-xl ring-1 ring-black/5 bg-white/90">
        <h3 className="text-lg font-semibold mb-3">Tổng quan</h3>
        <div className="space-y-2 text-sm">
          <div> Số đơn: <b>{data.length}</b></div>
          <div> Doanh thu: <b className="text-indigo-700">{vnd(total)}</b></div>
        </div>
      </div>

      <div className="rounded-2xl p-4 shadow-xl ring-1 ring-black/5 bg-white/90">
        <h3 className="text-lg font-semibold mb-3">Doanh thu theo tháng</h3>
        <div className="overflow-x-auto">
          <table className="min-w-[420px] w-full text-sm">
            <thead className="bg-gradient-to-r from-sky-100 to-indigo-100">
              <tr className="text-left text-gray-700">
                <th className="p-3">Tháng</th>
                <th className="p-3 text-right">Doanh thu</th>
              </tr>
            </thead>
            <tbody>
              {byMonth.length === 0 ? (
                <tr><td className="p-6 text-center" colSpan={2}>Chưa có dữ liệu</td></tr>
              ) : (
                byMonth.map(([month, money]) => (
                  <tr key={month} className="hover:bg-sky-50/60">
                    <td className="p-3">{month}</td>
                    <td className="p-3 text-right font-semibold text-indigo-700">{vnd(money)}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}

import { useMemo, useState } from "react";
import DetailPresets from "../../data/Data";
import guides from "../../data/guides";

const TOURS = Object.values(DetailPresets)
  .map((x) => ({ id: Number(x.id), name: x.name, price: Number(x.price) }))
  .sort((a, b) => a.id - b.id);

// Chuẩn hoá giá HDV theo ngày (giờ * 8)
const GUIDES = guides.map((g) => ({
  ...g,
  pricePerDay: g.priceType === "giờ" ? g.price * 8 : g.price,
}));

const LS_KEY = "bookings_admin_demo_v1";
const vnd = (n) => (Number(n || 0)).toLocaleString("vi-VN") + "đ";
const genCode = () => {
  const d = new Date();
  return `BK-${d.getFullYear()}${String(d.getMonth() + 1).padStart(2,"0")}${String(d.getDate()).padStart(2,"0")}-${Math.floor(Math.random()*9000+1000)}`;
};

export default function QuickCreatePage() {
  const [form, setForm] = useState({
    tourId: TOURS[0]?.id || 1,
    guideId: GUIDES[0]?.id || 1,
    customerName: "",
    phone: "",
    email: "",
    people: 2,
    checkinDate: new Date().toISOString().slice(0, 10),
    days: 1,
    note: "",
  });

  const tour = useMemo(() => TOURS.find((t) => t.id === Number(form.tourId)), [form.tourId]);
  const guide = useMemo(() => GUIDES.find((g) => g.id === Number(form.guideId)), [form.guideId]);

  const total = useMemo(() => {
    const base = (tour?.price || 0) * form.people * form.days;
    const guideCost = (guide?.pricePerDay || 0) * form.days;
    return base + guideCost;
  }, [tour, guide, form.people, form.days]);

  const save = (e) => {
    e.preventDefault();

    // 1) Hộp thoại xác nhận trước khi lưu
    const ok = window.confirm(
      [
        "Bạn có chắc muốn tạo đơn này?",
        `• Tour: ${tour?.name || ""} (#${tour?.id ?? "-"})`,
        `• Hướng dẫn viên: ${guide?.name || ""} (${guide?.language || ""})`,
        `• Khởi hành: ${form.checkinDate} · ${form.days} ngày · ${form.people} khách`,
        `• Khách: ${form.customerName || "Khách lẻ"} · ${form.phone || "-"} · ${form.email || "-"}`,
        `• Tổng tiền: ${vnd(total)}`,
        "",
        "Chọn OK để tạo đơn, Cancel để xem lại."
      ].join("\n")
    );

    if (!ok) return;

    // 2) Lưu vào localStorage
    const raw = localStorage.getItem(LS_KEY);
    const data = raw ? JSON.parse(raw) : [];
    const now = new Date().toISOString();

    data.push({
      _id: crypto.randomUUID(),
      code: genCode(),
      tourId: tour.id,
      tourName: tour.name,
      customerName: form.customerName || "Khách lẻ",
      phone: form.phone,
      email: form.email,
      people: Number(form.people),
      checkinDate: form.checkinDate,
      days: Number(form.days),
      note: form.note,
      total,
      status: "pending",
      createdAt: now,
      updatedAt: now,
      guideId: guide?.id,
      guideName: guide?.name,
    });

    localStorage.setItem(LS_KEY, JSON.stringify(data));
    alert("Đã tạo đơn và đưa vào Danh sách đơn!");
  };

  return (
    <section className="rounded-2xl p-4 shadow-xl ring-1 ring-black/5 bg-white/90 max-w-3xl">
      <h3 className="text-lg font-semibold mb-3">Tạo đơn nhanh</h3>
      <form onSubmit={save} className="grid grid-cols-1 gap-3">
        <div>
          <label className="text-sm font-medium">Chọn tour</label>
          <select
            value={form.tourId}
            onChange={(e) => setForm({ ...form, tourId: Number(e.target.value) })}
            className="w-full rounded-xl px-3 py-2 bg-gray-50 focus:bg-white shadow-inner focus:outline-none focus:ring-2 focus:ring-sky-200"
          >
            {TOURS.map((t) => (
              <option key={t.id} value={t.id}>
                {t.name} ({vnd(t.price)}/ngày)
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="text-sm font-medium">Chọn hướng dẫn viên</label>
          <select
            value={form.guideId}
            onChange={(e) => setForm({ ...form, guideId: Number(e.target.value) })}
            className="w-full rounded-xl px-3 py-2 bg-gray-50 focus:bg-white shadow-inner focus:outline-none focus:ring-2 focus:ring-sky-200"
          >
            {GUIDES.map((g) => (
              <option key={g.id} value={g.id}>
                {g.name} · {g.language} · {vnd(g.pricePerDay)}/ngày
              </option>
            ))}
          </select>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-sm font-medium">Ngày khởi hành</label>
            <input
              type="date"
              value={form.checkinDate}
              onChange={(e) => setForm({ ...form, checkinDate: e.target.value })}
              className="w-full rounded-xl px-3 py-2 bg-gray-50 focus:bg-white shadow-inner focus:outline-none focus:ring-2 focus:ring-sky-200"
            />
          </div>
          <div>
            <label className="text-sm font-medium">Số ngày</label>
            <input
              type="number" min={1}
              value={form.days}
              onChange={(e) => setForm({ ...form, days: Number(e.target.value) })}
              className="w-full rounded-xl px-3 py-2 bg-gray-50 focus:bg-white shadow-inner focus:outline-none focus:ring-2 focus:ring-sky-200"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-sm font-medium">Họ tên khách</label>
            <input
              value={form.customerName}
              onChange={(e) => setForm({ ...form, customerName: e.target.value })}
              className="w-full rounded-xl px-3 py-2 bg-gray-50 focus:bg-white shadow-inner focus:outline-none focus:ring-2 focus:ring-sky-200"
              placeholder="VD: Trần Văn B"
            />
          </div>
          <div>
            <label className="text-sm font-medium">Số điện thoại</label>
            <input
              value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
              className="w-full rounded-xl px-3 py-2 bg-gray-50 focus:bg-white shadow-inner focus:outline-none focus:ring-2 focus:ring-sky-200"
              placeholder="09xxxxxxx"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-sm font-medium">Email</label>
            <input
              type="email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              className="w-full rounded-xl px-3 py-2 bg-gray-50 focus:bg-white shadow-inner focus:outline-none focus:ring-2 focus:ring-sky-200"
              placeholder="email@domain.com"
            />
          </div>
          <div>
            <label className="text-sm font-medium">Số khách</label>
            <input
              type="number" min={1}
              value={form.people}
              onChange={(e) => setForm({ ...form, people: Number(e.target.value) })}
              className="w-full rounded-xl px-3 py-2 bg-gray-50 focus:bg-white shadow-inner focus:outline-none focus:ring-2 focus:ring-sky-200"
            />
          </div>
        </div>

        <div>
          <label className="text-sm font-medium">Ghi chú</label>
          <textarea
            value={form.note}
            onChange={(e) => setForm({ ...form, note: e.target.value })}
            className="w-full rounded-xl px-3 py-2 bg-gray-50 focus:bg-white shadow-inner focus:outline-none focus:ring-2 focus:ring-sky-200"
            rows={2}
            placeholder="Yêu cầu thêm..."
          />
        </div>

        <div className="flex items-center justify-between pt-2">
          <div className="text-sm text-gray-700">
            Tổng tiền tạm tính: <b className="text-indigo-700">{vnd(total)}</b>
          </div>
          <button
            type="submit"
            className="inline-flex items-center justify-center gap-2 rounded-xl px-4 py-2 text-white bg-gradient-to-r from-sky-500 to-indigo-600 shadow hover:brightness-110"
          >
            Tạo đơn
          </button>
        </div>
      </form>
    </section>
  );
}

import { useEffect, useMemo, useState } from "react";
import DetailPresets from "../../data/Data";

const LS_KEY = "bookings_admin_demo_v1";
const STATUS = ["pending", "confirmed", "completed", "cancelled"];
const STATUS_LABEL = {
  pending: "Chờ xử lý",
  confirmed: "Đã xác nhận",
  completed: "Hoàn thành",
  cancelled: "Đã hủy",
};
const vnd = (n) => (Number(n || 0)).toLocaleString("vi-VN") + "đ";

// ===== Map TOUR theo id (từ DetailPresets) =====
const TOURS = Object.values(DetailPresets).reduce((acc, t) => {
  acc[Number(t.id)] = { id: Number(t.id), name: t.name, price: Number(t.price) };
  return acc;
}, {});

/* ---------------- Toast nhỏ gọn ---------------- */
function Toast({ open, type = "info", message = "", onClose }) {
  if (!open) return null;
  const map = {
    success: { cls: "bg-emerald-600", label: "Thành công" },
    warn: { cls: "bg-amber-500", label: "Cảnh báo" },
    info: { cls: "bg-sky-600", label: "Thông báo" },
  };
  const { cls, label } = map[type] || map.info;

  return (
    <div className="fixed top-4 right-4 z-[60]">
      <div className="text-white shadow-2xl rounded-2xl overflow-hidden ring-1 ring-black/10">
        <div className={`${cls} px-4 py-2 font-semibold`}>{label}</div>
        <div className="px-4 py-3 bg-white text-gray-800 min-w-[260px]">
          <div className="text-sm">{message}</div>
          <div className="mt-3 flex justify-end">
            <button
              onClick={onClose}
              className="px-3 py-1.5 rounded-lg text-sm bg-gray-100 hover:bg-gray-200"
            >
              Đóng
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ---------------- COMPACT ROW ---------------- */
function Row({ b, active, onSelect }) {
  return (
    <tr
      onClick={() => onSelect(b)}
      className={`cursor-pointer hover:bg-sky-50/60 ${
        active ? "bg-sky-50/80" : ""
      }`}
    >
      <td className="p-3 font-mono text-xs">{b.code}</td>
      <td className="p-3">
        <div className="font-semibold">{b.tourName}</div>
        <div className="text-gray-500">#{b.tourId}</div>
      </td>
      <td className="p-3">
        <div className="font-medium">{b.customerName}</div>
        <div className="text-gray-500 text-xs">
          {b.phone}
          {b.email ? ` · ${b.email}` : ""}
        </div>
      </td>
      <td className="p-3">
        {b.checkinDate} ({b.days} ngày)
        <div className="text-gray-500 text-xs">{b.people} khách</div>
      </td>
      <td className="p-3 text-right font-semibold text-indigo-700">
        {vnd(b.total)}
      </td>
      <td className="p-3">
        <span
          className={`px-2 py-1 rounded-full text-xs shadow ${
            b.status === "pending"
              ? "bg-amber-100 text-amber-700"
              : b.status === "confirmed"
              ? "bg-sky-100 text-sky-700"
              : b.status === "completed"
              ? "bg-emerald-100 text-emerald-700"
              : "bg-rose-100 text-rose-700"
          }`}
        >
          {STATUS_LABEL[b.status] || b.status}
        </span>
      </td>
    </tr>
  );
}

export default function BookingListPage() {
  const [data, setData] = useState([]);
  const [q, setQ] = useState("");
  const [editing, setEditing] = useState(null);
  const [selected, setSelected] = useState(null); // đơn đang chọn
  const [toast, setToast] = useState({
    open: false,
    type: "info",
    message: "",
  });

  const notify = (type, message) => {
    setToast({ open: true, type, message });
    setTimeout(() => setToast((t) => ({ ...t, open: false })), 2200);
  };

  const reload = () => {
    const raw = localStorage.getItem(LS_KEY);
    const arr = raw ? JSON.parse(raw) : [];
    setData(arr);
    if (selected) {
      const found = arr.find((x) => x._id === selected._id);
      setSelected(found || null);
    }
  };

  useEffect(() => {
    reload();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const filtered = useMemo(() => {
    if (!q) return data;
    const s = q.toLowerCase();
    return data.filter(
      (b) =>
        b.code?.toLowerCase().includes(s) ||
        b.tourName?.toLowerCase().includes(s) ||
        b.customerName?.toLowerCase().includes(s) ||
        b.phone?.includes(q)
    );
  }, [data, q]);

  const total = useMemo(
    () => filtered.reduce((s, x) => s + (x.total || 0), 0),
    [filtered]
  );

  // ---------- local helpers ----------
  const saveAll = (arr) => {
    localStorage.setItem(LS_KEY, JSON.stringify(arr));
    setData(arr);
  };

  const updateOne = (id, patch) => {
    const arr = [...data];
    const idx = arr.findIndex((x) => x._id === id);
    if (idx >= 0) {
      arr[idx] = { ...arr[idx], ...patch, updatedAt: new Date().toISOString() };
      saveAll(arr);
      if (selected && selected._id === id) setSelected(arr[idx]);
    }
  };

  // ---------- actions ----------
  const changeStatus = (b, s) => {
    updateOne(b._id, { status: s });
    notify(
      "info",
      `Đã đổi trạng thái "${b.code}" ➜ ${STATUS_LABEL[s] || s}.`
    );
  };

  const remove = (b) => {
    if (!confirm(`Xoá booking ${b.code}?`)) return;
    const arr = data.filter((x) => x._id !== b._id);
    saveAll(arr);
    if (selected && selected._id === b._id) setSelected(null);
    notify("warn", "Đã xoá đơn.");
  };

  const openEdit = (b) => {
    const tourInfo = TOURS[b.tourId] || { price: 0, name: b.tourName };
    setEditing({
      ...b,
      tourPrice: tourInfo.price,
      tourName: tourInfo.name || b.tourName,
    });
  };

  const calcTotal = (tourId, people, days) => {
    const price = TOURS[tourId]?.price || 0;
    return Number(price) * Number(people) * Number(days);
  };

  const saveEdit = () => {
    if (!editing) return;
    const patch = {
      customerName: editing.customerName,
      phone: editing.phone,
      email: editing.email,
      checkinDate: editing.checkinDate,
      days: Number(editing.days),
      people: Number(editing.people),
      note: editing.note,
      total: calcTotal(editing.tourId, editing.people, editing.days),
      status: editing.status,
    };
    updateOne(editing._id, patch);
    setEditing(null);
    notify("success", "Đã lưu thay đổi.");
  };

  return (
    <>
      {/* Lưới 2 cột: trái = bảng; phải = panel chi tiết */}
      <div className="grid grid-cols-1 lg:grid-cols-[3fr,2fr] gap-8 items-start">
        {/* LEFT: bảng */}
        <section className="space-y-4">
          <div className="flex items-end gap-3">
            <div className="flex-1">
              <label className="text-sm font-medium">Tìm kiếm</label>
              <input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Mã đơn, tên tour, khách, sđt..."
                className="w-full rounded-xl px-3 py-2 bg-gray-50 focus:bg-white shadow-inner focus:outline-none focus:ring-2 focus:ring-sky-200"
              />
            </div>
            <div className="text-sm whitespace-nowrap">
              Tổng đơn: <b>{filtered.length}</b> · Doanh thu:{" "}
              <b className="text-indigo-700">{vnd(total)}</b>
            </div>
          </div>

          <div className="rounded-2xl overflow-hidden bg-white shadow-2xl ring-1 ring-black/5">
            <table className="w-full text-sm">
              <thead className="bg-gradient-to-r from-sky-100 to-indigo-100">
                <tr className="text-left text-gray-700">
                  <th className="p-3">Mã</th>
                  <th className="p-3">Tour</th>
                  <th className="p-3">Khách</th>
                  <th className="p-3">Ngày</th>
                  <th className="p-3 text-right">Tổng</th>
                  <th className="p-3">Trạng thái</th>
                </tr>
              </thead>
              <tbody>
                {filtered.length === 0 ? (
                  <tr>
                    <td className="p-6 text-center" colSpan={6}>
                      Chưa có đơn phù hợp
                    </td>
                  </tr>
                ) : (
                  filtered.map((b) => (
                    <Row
                      key={b._id}
                      b={b}
                      active={selected?._id === b._id}
                      onSelect={setSelected}
                    />
                  ))
                )}
              </tbody>
            </table>
          </div>
        </section>

        {/* RIGHT: panel chi tiết hoá đơn + thao tác */}
        <aside className="space-y-4">
          <div className="rounded-2xl p-6 lg:p-7 shadow-2xl ring-1 ring-black/5 bg-white/95 min-h-[260px]">
            {!selected ? (
              <div className="h-full flex items-center justify-center">
                <p className="text-sm text-gray-600 text-center max-w-xs">
                  Hãy chọn một đơn ở bảng bên trái để xem chi tiết hóa đơn và
                  thao tác nhanh.
                </p>
              </div>
            ) : (
              <>
                {/* Tiêu đề + mã đơn */}
                <h3 className="text-xl font-semibold mb-1">
                  Hóa đơn đặt tour
                </h3>
                <p className="text-sm text-gray-600 mb-4">
                  Mã hóa đơn:{" "}
                  <span className="font-mono font-semibold text-gray-900">
                    {selected.code}
                  </span>
                </p>

                {/* Thông tin tour */}
                <div className="border rounded-xl p-3 mb-4">
                  <h4 className="font-semibold mb-2 text-sm">Thông tin tour</h4>
                  <p className="text-sm">
                    <span className="font-medium">Tour:&nbsp;</span>
                    {selected.tourName}
                  </p>
                  <p className="text-sm">
                    <span className="font-medium">Ngày khởi hành:&nbsp;</span>
                    {selected.checkinDate}
                  </p>
                  <p className="text-sm">
                    <span className="font-medium">Thời lượng:&nbsp;</span>
                    {selected.days} ngày
                  </p>
                  <p className="text-sm">
                    <span className="font-medium">Số khách:&nbsp;</span>
                    {selected.people} khách
                  </p>
                  <p className="mt-2 text-sm">
                    <span className="font-medium">Tổng tiền:&nbsp;</span>
                    <span className="font-semibold text-indigo-700">
                      {vnd(selected.total)}
                    </span>
                  </p>
                </div>

                {/* Thông tin khách hàng */}
                <div className="border rounded-xl p-3 mb-4">
                  <h4 className="font-semibold mb-2 text-sm">
                    Thông tin khách hàng
                  </h4>
                  <p className="text-sm">
                    <span className="font-medium">Họ tên:&nbsp;</span>
                    {selected.customerName}
                  </p>
                  <p className="text-sm">
                    <span className="font-medium">SĐT:&nbsp;</span>
                    {selected.phone}
                  </p>
                  {selected.email && (
                    <p className="text-sm">
                      <span className="font-medium">Email:&nbsp;</span>
                      {selected.email}
                    </p>
                  )}
                  {selected.note && (
                    <p className="text-sm mt-1">
                      <span className="font-medium">Ghi chú:&nbsp;</span>
                      <span className="italic">{selected.note}</span>
                    </p>
                  )}
                </div>

                {/* Trạng thái đơn + nút đổi trạng thái */}
                <div className="border rounded-xl p-3 mb-4">
                  <h4 className="font-semibold mb-2 text-sm">Trạng thái đơn</h4>
                  <p className="text-sm mb-2">
                    Trạng thái hiện tại:&nbsp;
                    <span
                      className={
                        "px-3 py-1 rounded-full text-xs font-medium shadow " +
                        (selected.status === "pending"
                          ? "bg-amber-100 text-amber-700"
                          : selected.status === "confirmed"
                          ? "bg-sky-100 text-sky-700"
                          : selected.status === "completed"
                          ? "bg-emerald-100 text-emerald-700"
                          : "bg-rose-100 text-rose-700")
                      }
                    >
                      {STATUS_LABEL[selected.status] || selected.status}
                    </span>
                  </p>

                  <div className="flex flex-wrap gap-2 mt-1">
                    <button
                      onClick={() => changeStatus(selected, "pending")}
                      className="px-3 py-1.5 rounded-lg text-xs bg-amber-50 hover:bg-amber-100"
                    >
                      Chờ xử lý
                    </button>
                    <button
                      onClick={() => changeStatus(selected, "confirmed")}
                      className="px-3 py-1.5 rounded-lg text-xs bg-sky-50 hover:bg-sky-100"
                    >
                      Đã xác nhận
                    </button>
                    <button
                      onClick={() => changeStatus(selected, "completed")}
                      className="px-3 py-1.5 rounded-lg text-xs bg-emerald-50 hover:bg-emerald-100"
                    >
                      Hoàn thành
                    </button>
                    <button
                      onClick={() => changeStatus(selected, "cancelled")}
                      className="px-3 py-1.5 rounded-lg text-xs bg-rose-50 hover:bg-rose-100"
                    >
                      Hủy đơn
                    </button>
                  </div>
                </div>

                {/* Hành động khác */}
                <div className="grid grid-cols-2 gap-2 mt-1">
                  <button
                    onClick={() => openEdit(selected)}
                    className="px-3 py-2 rounded-lg text-sm bg-indigo-50 hover:bg-indigo-100"
                  >
                    Sửa thông tin
                  </button>
                  <button
                    onClick={() => remove(selected)}
                    className="px-3 py-2 rounded-lg text-sm text-rose-700 bg-rose-50 hover:bg-rose-100"
                  >
                    Xoá đơn
                  </button>
                </div>
              </>
            )}
          </div>
        </aside>
      </div>

      {/* Modal Sửa */}
      {editing && (
        <div
          className="fixed inset-0 z-50 bg-black/30 flex items-center justify-center p-4"
          onClick={() => setEditing(null)}
        >
          <div
            className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between p-4 bg-gradient-to-r from-sky-600 to-indigo-700 text-white rounded-t-2xl">
              <h3 className="text-lg font-semibold">Sửa đơn: {editing.code}</h3>
              <button
                onClick={() => setEditing(null)}
                className="p-2 hover:opacity-80"
              >
                ✕
              </button>
            </div>

            <div className="p-4 grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium">Tên khách</label>
                <input
                  className="w-full rounded-xl px-3 py-2 bg-gray-50 focus:bg-white shadow-inner focus:outline-none focus:ring-2 focus:ring-sky-200"
                  value={editing.customerName}
                  onChange={(e) =>
                    setEditing({ ...editing, customerName: e.target.value })
                  }
                />
              </div>
              <div>
                <label className="text-sm font-medium">SĐT</label>
                <input
                  className="w-full rounded-xl px-3 py-2 bg-gray-50 focus:bg-white shadow-inner focus:outline-none focus:ring-2 focus:ring-sky-200"
                  value={editing.phone}
                  onChange={(e) =>
                    setEditing({ ...editing, phone: e.target.value })
                  }
                />
              </div>
              <div>
                <label className="text-sm font-medium">Email</label>
                <input
                  className="w-full rounded-xl px-3 py-2 bg-gray-50 focus:bg-white shadow-inner focus:outline-none focus:ring-2 focus:ring-sky-200"
                  value={editing.email || ""}
                  onChange={(e) =>
                    setEditing({ ...editing, email: e.target.value })
                  }
                />
              </div>
              <div>
                <label className="text-sm font-medium">Ngày check-in</label>
                <input
                  type="date"
                  className="w-full rounded-xl px-3 py-2 bg-gray-50 focus:bg-white shadow-inner focus:outline-none focus:ring-2 focus:ring-sky-200"
                  value={editing.checkinDate}
                  onChange={(e) =>
                    setEditing({ ...editing, checkinDate: e.target.value })
                  }
                />
              </div>
              <div>
                <label className="text-sm font-medium">Số ngày</label>
                <input
                  type="number"
                  min={1}
                  className="w-full rounded-xl px-3 py-2 bg-gray-50 focus:bg-white shadow-inner focus:outline-none focus:ring-2 focus:ring-sky-200"
                  value={editing.days}
                  onChange={(e) => {
                    const days = Number(e.target.value);
                    setEditing((old) => ({
                      ...old,
                      days,
                      total:
                        (TOURS[old.tourId]?.price || 0) * old.people * days,
                    }));
                  }}
                />
              </div>
              <div>
                <label className="text-sm font-medium">Số khách</label>
                <input
                  type="number"
                  min={1}
                  className="w-full rounded-xl px-3 py-2 bg-gray-50 focus:bg-white shadow-inner focus:outline-none focus:ring-2 focus:ring-sky-200"
                  value={editing.people}
                  onChange={(e) => {
                    const people = Number(e.target.value);
                    setEditing((old) => ({
                      ...old,
                      people,
                      total:
                        (TOURS[old.tourId]?.price || 0) * people * old.days,
                    }));
                  }}
                />
              </div>
              <div className="col-span-2">
                <label className="text-sm font-medium">Ghi chú</label>
                <textarea
                  rows={2}
                  className="w-full rounded-xl px-3 py-2 bg-gray-50 focus:bg-white shadow-inner focus:outline-none focus:ring-2 focus:ring-sky-200"
                  value={editing.note || ""}
                  onChange={(e) =>
                    setEditing({ ...editing, note: e.target.value })
                  }
                />
              </div>
            </div>

            <div className="p-4 flex items-center justify-between">
              <div className="text-sm text-gray-700">
                Tổng tiền:{" "}
                <b className="text-indigo-700">{vnd(editing.total)}</b>
              </div>
              <div className="flex items-center gap-2">
                <select
                  value={editing.status}
                  onChange={(e) =>
                    setEditing({ ...editing, status: e.target.value })
                  }
                  className="rounded-xl px-3 py-2 bg-gray-50 focus:bg-white shadow-inner focus:outline-none focus:ring-2 focus:ring-sky-200 text-sm"
                >
                  {STATUS.map((s) => (
                    <option key={s} value={s}>
                      {STATUS_LABEL[s] || s}
                    </option>
                  ))}
                </select>
                <button
                  onClick={saveEdit}
                  className="px-4 py-2 rounded-xl font-medium text-white bg-gradient-to-r from-sky-500 to-indigo-600 shadow hover:brightness-110"
                >
                  Lưu
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Toast */}
      <Toast
        open={toast.open}
        type={toast.type}
        message={toast.message}
        onClose={() => setToast((t) => ({ ...t, open: false }))}
      />
    </>
  );
}

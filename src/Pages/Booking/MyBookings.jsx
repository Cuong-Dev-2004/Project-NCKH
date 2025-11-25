import { useEffect, useMemo, useState } from "react";

const LS_KEY = "bookings_admin_demo_v1";
const vnd = (n) => (Number(n || 0)).toLocaleString("vi-VN") + "đ";

const statusBadgeCls = (s) => {
  switch (s) {
    case "pending":
      return "bg-amber-100 text-amber-700";
    case "confirmed":
      return "bg-sky-100 text-sky-700";
    case "completed":
      return "bg-emerald-100 text-emerald-700";
    case "cancelled":
    default:
      return "bg-rose-100 text-rose-700";
  }
};

export default function MyBookingsPage() {
  const [all, setAll] = useState([]);
  const [field, setField] = useState("phone");
  const [value, setValue] = useState("");
  const [searchValue, setSearchValue] = useState(""); // ⬅️ giá trị dùng để tìm chính thức
  const [searched, setSearched] = useState(false); // ⬅️ đã bấm tra cứu hay chưa

  useEffect(() => {
    const raw = localStorage.getItem(LS_KEY);
    setAll(raw ? JSON.parse(raw) : []);
  }, []);

  // chỉ lọc khi đã bấm tìm kiếm
  const list = useMemo(() => {
    if (!searched || !searchValue.trim()) return [];
    const v = searchValue.trim().toLowerCase();

    return all.filter((b) => {
      if (field === "phone") return (b.phone || "").includes(v);
      if (field === "email") return (b.email || "").toLowerCase().includes(v);
      if (field === "code") return (b.code || "").toLowerCase().includes(v);
      return false;
    });
  }, [all, field, searched, searchValue]);

  const handleSearch = (e) => {
    e.preventDefault();
    setSearched(true);
    setSearchValue(value);        // ⬅️ lưu lại giá trị khi bấm nút
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-50 via-indigo-50 to-white">
      <div className="max-w-4xl mx-auto px-4 py-10">

        {/* TITLE */}
        <div className="text-center mb-8">
          <h1 className="text-3xl sm:text-4xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-sky-600 to-indigo-700">
            Đơn đặt tour của tôi
          </h1>
          <p className="mt-2 text-sm text-gray-600">
            Nhập <b>SĐT</b>, <b>Email</b> hoặc <b>Mã đơn</b> đã dùng khi đặt tour để xem đơn của bạn.
          </p>
        </div>

        {/* =================== FORM =================== */}
        <form
          onSubmit={handleSearch}
          className="mb-8 bg-white/80 backdrop-blur rounded-2xl shadow-xl ring-1 ring-black/5 p-4 sm:p-5 flex flex-col sm:flex-row gap-3"
        >
          <div className="flex-1">
            <label className="text-xs font-semibold text-gray-600 uppercase">
              Giá trị tra cứu
            </label>
            <input
              value={value}
              onChange={(e) => setValue(e.target.value)}
              placeholder={
                field === "phone"
                  ? "Nhập số điện thoại đã đặt tour..."
                  : field === "email"
                  ? "Nhập email đã đặt tour..."
                  : "Nhập mã đơn (HD-2025-001)..."
              }
              className="mt-1 w-full rounded-xl px-3 py-2 bg-gray-50 focus:bg-white shadow-inner focus:ring-2 focus:ring-sky-200"
            />
          </div>

          <div className="sm:w-40">
            <label className="text-xs font-semibold text-gray-600 uppercase">
              Tra cứu theo
            </label>
            <select
              value={field}
              onChange={(e) => setField(e.target.value)}
              className="mt-1 w-full rounded-xl px-3 py-2 bg-gray-50 focus:bg-white shadow-inner focus:ring-2 focus:ring-sky-200 text-sm"
            >
              <option value="phone">Số điện thoại</option>
              <option value="email">Email</option>
              <option value="code">Mã đơn</option>
            </select>
          </div>

          <button
            type="submit"
            className="sm:w-32 px-4 py-2.5 rounded-xl font-semibold text-white bg-gradient-to-r from-sky-500 to-indigo-600 shadow hover:brightness-110"
          >
            Tra cứu
          </button>
        </form>

        {/* =================== KẾT QUẢ =================== */}

        {/* 1 — chưa nhập gì nhưng bấm tìm */}
        {searched && !searchValue.trim() && (
          <div className="text-center text-sm text-gray-500">
            Vui lòng nhập thông tin tra cứu.
          </div>
        )}

        {/* 2 — đã tìm nhưng không có dữ liệu */}
        {searched && searchValue.trim() && list.length === 0 && (
          <div className="text-center text-sm text-gray-500">
            Không tìm thấy đơn nào phù hợp với thông tin bạn cung cấp.
          </div>
        )}

        {/* 3 — có kết quả */}
        {list.length > 0 && (
          <div className="space-y-4">
            {list.map((b) => (
              <div key={b._id} className="bg-white rounded-2xl shadow-xl ring-1 ring-black/5 p-4 sm:p-5">
                
                <div className="flex flex-col sm:flex-row sm:items-center gap-2 mb-3">
                  <div className="flex-1">
                    <div className="text-xs text-gray-500">Mã đơn</div>
                    <div className="font-mono font-semibold">{b.code}</div>
                  </div>

                  <span className={`px-3 py-1 rounded-full text-xs font-medium capitalize shadow ${statusBadgeCls(b.status)}`}>
                    {b.status === "pending" && "Chờ xử lý"}
                    {b.status === "confirmed" && "Đã xác nhận"}
                    {b.status === "completed" && "Hoàn tất"}
                    {b.status === "cancelled" && "Đã hủy"}
                  </span>
                </div>

                <div className="border-t border-dashed pt-3 mt-3 grid sm:grid-cols-2 gap-3 text-sm">
                  <div>
                    <div className="text-xs text-gray-500 uppercase mb-1">Thông tin tour</div>
                    <div className="font-semibold">{b.tourName}</div>
                    <div className="text-gray-600">Khởi hành: <b>{b.checkinDate}</b></div>
                    <div className="text-gray-600">Thời lượng: <b>{b.days}</b> ngày</div>
                    <div className="text-gray-600">Số khách: <b>{b.people}</b> khách</div>
                  </div>

                  <div>
                    <div className="text-xs text-gray-500 uppercase mb-1">Thông tin khách hàng</div>
                    <div className="font-semibold">{b.customerName}</div>
                    <div className="text-gray-600">SĐT: <b>{b.phone}</b></div>
                    {b.email && <div className="text-gray-600">Email: <b>{b.email}</b></div>}
                  </div>
                </div>

                <div className="border-t border-dashed mt-3 pt-3 flex justify-between text-sm">
                  <div className="text-gray-600">
                    Ghi chú: <span className="italic">{b.note || "Không có ghi chú."}</span>
                  </div>
                  <div className="text-right">
                    <div className="text-xs text-gray-500 uppercase">Tổng tiền</div>
                    <div className="text-lg font-bold text-indigo-700">
                      {vnd(b.total)}
                    </div>
                  </div>
                </div>

              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

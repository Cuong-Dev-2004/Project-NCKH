// src/Pages/Cart/Cart.jsx
import { useState, useMemo, useEffect } from "react";
import { Link } from "react-router-dom";
import { vnd } from "../../utils/money.js";
import { useCart } from "../../utils/cartContext.jsx";
import SePayModal from "../../components/Payment/SePayModal";
import { saveOrderAndBookings, genCode, countDaysInclusive } from "../../data/orderBooking.store";

function Row({ label, value, highlight = false }) {
  return (
    <div className={`px-6 py-4 flex justify-between border-b ${highlight ? "text-red-600 font-semibold" : ""}`}>
      <span>{label}</span>
      <span>{value}</span>
    </div>
  );
}

export default function Cart() {
  const { items, updateQty, remove, clear } = useCart();

  const [coupon, setCoupon] = useState("");
  const [note, setNote] = useState("");

  // Modal + orderId
  const [openPay, setOpenPay] = useState(false);
  const [orderId] = useState(() => "ORDER_" + Date.now());

  // --- Tính tiền an toàn ---
  const subtotal = useMemo(
    () =>
      items.reduce((s, it) => {
        const p = Number(it.price) || 0;
        const q = Math.max(1, parseInt(it.qty, 10) || 1);
        return s + p * q;
      }, 0),
    [items]
  );

  const discount = useMemo(() => {
    const ok = coupon.trim().toUpperCase() === "TOUR10";
    return ok ? Math.round(subtotal * 0.1) : 0;
  }, [coupon, subtotal]);

  const total = Math.max(0, subtotal - discount);
  const totalInt = useMemo(() => Math.round(Number(total) || 0), [total]); // dùng cho QR

  // Đóng modal nếu giỏ trống
  useEffect(() => {
    if (!items.length && openPay) setOpenPay(false);
  }, [items.length, openPay]);

  const handleCheckout = () => {
    if (!items.length) return;
    if (totalInt <= 0) {
      alert("Tổng thanh toán đang bằng 0. Vui lòng kiểm tra lại giỏ hàng/mã giảm giá.");
      return;
    }
    setOpenPay(true);
  };

  if (!items.length) {
    return (
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <h1 className="text-4xl font-extrabold mb-6">Giỏ hàng</h1>
        <div className="rounded-xl bg-white shadow-sm ring-1 ring-gray-200 p-8 text-center">
          <p className="text-gray-700">Giỏ hàng trống.</p>
          <Link to="/tours" className="inline-block mt-4 px-5 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700">
            Tiếp tục đặt tour
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <h1 className="text-4xl font-extrabold mb-6">Giỏ hàng</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* danh sách sản phẩm */}
        <div className="lg:col-span-2">
          <div className="rounded-xl bg-white shadow-sm ring-1 ring-gray-200 overflow-hidden">
            <div className="bg-sky-500 text-white font-semibold px-6 py-3 grid grid-cols-12">
              <div className="col-span-7">SẢN PHẨM</div>
              <div className="col-span-2 text-right">GIÁ</div>
              <div className="col-span-1 text-center">SỐ LƯỢNG</div>
              <div className="col-span-2 text-right">TẠM TÍNH</div>
            </div>

            {items.map((it) => (
              <div key={it.key} className="px-6 py-4 grid grid-cols-12 items-center border-b last:border-0">
                <div className="col-span-7 flex gap-4">
                  <img src={it.img} alt={it.name} className="w-20 h-20 object-cover rounded-lg" />
                  <div className="space-y-1">
                    <div className="font-semibold">{it.name}</div>
                    {!!it?.meta?.checkIn && <div className="text-sm text-gray-600">Check in: {it.meta.checkIn}</div>}
                    {!!it?.meta?.checkOut && <div className="text-sm text-gray-600">Check out: {it.meta.checkOut}</div>}
                    {!!it?.meta?.adults && <div className="text-sm text-gray-600">Người lớn: {it.meta.adults}</div>}
                    <button onClick={() => remove(it.key)} className="mt-1 text-red-600 hover:underline text-sm">
                      Xóa
                    </button>
                  </div>
                </div>

                <div className="col-span-2 text-right">{vnd(it.price)}</div>

                <div className="col-span-1 text-center">
                  <input
                    type="number"
                    min="1"
                    value={it.qty}
                    onChange={(e) => updateQty(it.key, e.target.value)}
                    className="w-16 rounded-md border border-gray-300 px-2 py-1 text-center focus:outline-none focus:ring-2 focus:ring-sky-200"
                  />
                </div>

                <div className="col-span-2 text-right font-semibold">
                  {vnd((Number(it.price) || 0) * (Math.max(1, parseInt(it.qty, 10) || 1)))}
                </div>
              </div>
            ))}
          </div>

          <div className="mt-4 flex flex-col sm:flex-row sm:items-center gap-3">
            <input
              value={coupon}
              onChange={(e) => setCoupon(e.target.value)}
              placeholder="Nhập mã giảm giá (VD: TOUR10)"
              className="w-full sm:w-72 rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-sky-200"
            />
            <button className="px-4 py-2 rounded-md bg-sky-600 text-white hover:bg-sky-700">Áp dụng</button>
            <button
              onClick={() => { clear(); setOpenPay(false); }}
              className="px-4 py-2 rounded-md border border-gray-300 hover:bg-gray-50"
            >
              Xóa giỏ hàng
            </button>
          </div>

          <textarea
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="Ghi chú cho đơn hàng (tuỳ chọn)"
            className="mt-4 w-full rounded-md border border-gray-300 px-3 py-2 h-28 focus:outline-none focus:ring-2 focus:ring-sky-200"
          />
        </div>

        {/* tổng cộng */}
        <div>
          <div className="rounded-xl bg-white shadow-sm ring-1 ring-gray-200 overflow-hidden">
            <div className="px-6 py-3 font-bold border-b">TỔNG CỘNG GIỎ HÀNG</div>
            <Row label="Tạm tính" value={vnd(subtotal)} highlight />
            <Row label="Ưu đãi" value={discount ? `- ${vnd(discount)}` : vnd(0)} />
            <div className="px-6 py-4 flex justify-between items-center">
              <span className="font-semibold">Tổng</span>
              <span className="text-red-600 font-bold text-lg">{vnd(totalInt)}</span>
            </div>
          </div>

          <button
            onClick={handleCheckout}
            disabled={totalInt <= 0}
            className={`mt-4 w-full py-3 rounded-xl text-lg font-semibold transition
              ${totalInt > 0 ? "bg-sky-600 text-white hover:bg-sky-700" : "bg-gray-200 text-gray-500 cursor-not-allowed"}`}
          >
            Thanh toán (VietQR)
          </button>

          <Link
            to="/tours"
            className="mt-3 inline-block w-full text-center py-2 rounded-lg border border-gray-300 hover:bg-gray-50"
          >
            Tiếp tục đặt tour
          </Link>
        </div>
      </div>

      {/* Modal VietQR / SePay */}
      <SePayModal
        open={openPay}
        amount={totalInt}
        orderId={orderId}
        onClose={() => setOpenPay(false)}

        // KHÔNG tạo đơn ở đây — chỉ log cho biết QR đã render OK
        onSuccess={(info) => {
          console.log("[Payment ready]", info);
        }}
        onError={(m) => console.warn(m)}

        // Nếu dùng SePay thật, truyền 2 prop dưới (tuỳ chọn):
        // sepayQrImage="https://link-qr-sepay.png"
        // sepayCheckoutUrl="https://sepay.vn/checkout/xxxx"

        // Chỉ khi KH bấm OK mới tạo order & booking
        onPaidConfirm={() => {
          // 1) Order tổng
          const order = {
            _id: crypto.randomUUID(),
            code: genCode("OD"),
            orderIdGateway: orderId,
            gatewayMeta: {},  // có thể lưu thêm info nếu muốn
            items,
            note,
            coupon: coupon.trim().toUpperCase() || null,
            subtotal,
            discount,
            total: totalInt,
            status: "paid",   // hoặc 'verifying' nếu cần duyệt tay
            createdAt: new Date().toISOString(),
          };

          // 2) Chuyển từng item → booking (đồng bộ với trang admin)
          const bookings = items.map((it) => {
            const days = countDaysInclusive(it?.meta?.checkIn, it?.meta?.checkOut);
            const qty  = Math.max(1, parseInt(it.qty, 10) || 1);
            return {
              _id: crypto.randomUUID(),
              code: genCode("BK"),
              tourId: it.tourId || it.id,
              tourName: it.name,
              customerName: it?.meta?.customerName || "Khách lẻ",
              phone: it?.meta?.phone || "",
              email: it?.meta?.email || "",
              people: it?.meta?.adults || qty,
              checkinDate: it?.meta?.checkIn || new Date().toISOString().slice(0,10),
              days,
              note: note || it?.meta?.note || "",
              total: (Number(it.price) || 0) * qty * days,
              status: "confirmed",
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
            };
          });

          // 3) Lưu LocalStorage (orders + bookings)
          saveOrderAndBookings({ order, bookings });

          // 4) Clear giỏ + đóng modal
          clear();
          setOpenPay(false);

          // 5) Thông báo cho KH
          alert("Đã ghi nhận thanh toán. Xin hãy đợi giây lát để nhân viên kiểm tra!");
        }}
      />
    </div>
  );
}

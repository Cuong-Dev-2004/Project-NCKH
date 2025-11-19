import { useState, useMemo, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
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
  const navigate = useNavigate();

  const [coupon, setCoupon] = useState("");
  const [note, setNote] = useState("");
  
  // Thông tin hiển thị ở màn hình Cart (chưa thanh toán)
  const [email, setEmail] = useState(""); 

  const [openPay, setOpenPay] = useState(false);
  const [orderId] = useState(() => "ORDER_" + Date.now());

  // Tự động điền email nếu trong giỏ hàng có sẵn
  useEffect(() => {
    if (items.length > 0) {
      const firstEmail = items.find(i => i.meta?.email)?.meta?.email;
      if (firstEmail && !email) setEmail(firstEmail);
    }
  }, [items]);

  const subtotal = useMemo(() => items.reduce((s, it) => s + (Number(it.price) || 0) * (Math.max(1, parseInt(it.qty, 10) || 1)), 0), [items]);
  const discount = useMemo(() => (coupon.trim().toUpperCase() === "TOUR10" ? Math.round(subtotal * 0.1) : 0), [coupon, subtotal]);
  const total = Math.max(0, subtotal - discount);
  const totalInt = useMemo(() => Math.round(Number(total) || 0), [total]);

  useEffect(() => {
    if (!items.length && openPay) setOpenPay(false);
  }, [items.length, openPay]);

  const handleCheckout = () => {
    if (!items.length) return;
    if (totalInt <= 0) {
      alert("Tổng thanh toán bằng 0. Vui lòng kiểm tra lại.");
      return;
    }
    setOpenPay(true);
  };

  if (!items.length) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-10 text-center">
        <h1 className="text-4xl font-extrabold mb-6">Giỏ hàng</h1>
        <div className="bg-white p-8 rounded-xl shadow-sm ring-1 ring-gray-200">
          <p className="text-gray-700">Giỏ hàng trống.</p>
          <Link to="/tours" className="inline-block mt-4 px-5 py-2 bg-blue-600 text-white rounded-lg">Tiếp tục đặt tour</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <h1 className="text-4xl font-extrabold mb-6">Giỏ hàng</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Cột trái: Danh sách */}
        <div className="lg:col-span-2">
          <div className="rounded-xl bg-white shadow-sm ring-1 ring-gray-200 overflow-hidden">
            <div className="bg-sky-500 text-white font-semibold px-6 py-3 grid grid-cols-12 text-sm">
              <div className="col-span-6">SẢN PHẨM</div>
              <div className="col-span-2 text-right">GIÁ</div>
              <div className="col-span-2 text-center">SỐ LƯỢNG</div>
              <div className="col-span-2 text-right">THÀNH TIỀN</div>
            </div>
            {items.map((it) => (
              <div key={it.key} className="px-6 py-4 grid grid-cols-12 items-center border-b last:border-0 text-sm">
                <div className="col-span-6 flex gap-4">
                  <img src={it.img} alt={it.name} className="w-16 h-16 object-cover rounded-lg" />
                  <div>
                    <div className="font-semibold">{it.name}</div>
                    <div className="text-xs text-gray-500">{it.meta?.checkIn && `Ngày đi: ${it.meta.checkIn}`}</div>
                    <button onClick={() => remove(it.key)} className="text-red-600 text-xs hover:underline">Xóa</button>
                  </div>
                </div>
                <div className="col-span-2 text-right">{vnd(it.price)}</div>
                <div className="col-span-2 text-center">
                  <input type="number" min="1" value={it.qty} onChange={(e) => updateQty(it.key, e.target.value)} className="w-14 text-center border rounded-md" />
                </div>
                <div className="col-span-2 text-right font-bold text-sky-600">{vnd((Number(it.price)||0) * (Math.max(1, parseInt(it.qty)||1)))}</div>
              </div>
            ))}
          </div>
          
          {/* Ghi chú */}
          <div className="mt-6 bg-white p-6 rounded-xl shadow-sm ring-1 ring-gray-200">
             <h3 className="font-bold mb-2">Ghi chú đơn hàng</h3>
             <textarea value={note} onChange={(e) => setNote(e.target.value)} className="w-full p-2 border rounded-lg" placeholder="Yêu cầu đặc biệt..." />
          </div>
        </div>

        {/* Cột phải: Tổng tiền */}
        <div>
          <div className="bg-white rounded-xl shadow-sm ring-1 ring-gray-200 sticky top-6">
            <div className="p-4 border-b font-bold text-lg">TỔNG CỘNG</div>
            <Row label="Tạm tính" value={vnd(subtotal)} />
            <Row label="Giảm giá" value={vnd(discount)} highlight={discount > 0} />
            <div className="p-4 flex justify-between items-center text-xl font-bold text-red-600">
              <span>Thanh toán</span>
              <span>{vnd(totalInt)}</span>
            </div>
            <div className="p-4">
              <button onClick={handleCheckout} disabled={totalInt<=0} className="w-full py-3 bg-sky-600 text-white font-bold rounded-xl hover:bg-sky-700 disabled:bg-gray-300">Thanh toán ngay</button>
            </div>
          </div>
        </div>
      </div>

      {/* --- MODAL THANH TOÁN --- */}
      <SePayModal
        open={openPay}
        amount={totalInt}
        orderId={orderId}
        // Truyền dữ liệu điền sẵn (nếu có từ form đặt tour)
        initialName={items[0]?.meta?.customerName || ""}
        initialPhone={items[0]?.meta?.phone || ""}
        initialEmail={email || items[0]?.meta?.email || ""}
        onClose={() => setOpenPay(false)}

        // 🔥 HÀM QUAN TRỌNG NHẤT: NHẬN DỮ LIỆU VÀ LƯU
        onPaidConfirm={(info) => {
          console.log("Dữ liệu khách hàng nhận được:", info);

          // 1. Tạo Order Tổng
          const order = {
            _id: crypto.randomUUID(),
            code: genCode("OD"),
            items,
            note,
            coupon: coupon || null,
            subtotal,
            discount,
            total: totalInt,
            status: "paid",
            createdAt: new Date().toISOString(),
            // Lưu thông tin khách CHÍNH XÁC từ modal
            customerName: info.customerName,
            phone: info.phone,
            email: info.email
          };

          // 2. Tạo từng Booking lẻ cho Admin
          const bookings = items.map((it) => {
            const days = it.meta?.type === 'guide' ? it.qty : (countDaysInclusive(it?.meta?.checkIn, it?.meta?.checkOut) || 1);
            return {
              _id: crypto.randomUUID(),
              code: genCode("BK"),
              tourId: it.tourId || it.id,
              tourName: it.name,
              
              // 🔥 GHI ĐÈ thông tin khách bằng info từ Modal
              customerName: info.customerName, 
              phone: info.phone,
              email: info.email,

              people: Number(it.meta?.adults || 1),
              checkinDate: it.meta?.checkIn || new Date().toISOString().slice(0,10),
              days: Number(days),
              note: note || it.meta?.note || "",
              total: (Number(it.price) || 0) * (Number(it.qty) || 1),
              status: "confirmed",
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
            };
          });

          // 3. Lưu vào LocalStorage
          saveOrderAndBookings({ order, bookings });

          // 4. Dọn dẹp
          clear();
          setOpenPay(false);
          alert(`✅ Đã lưu đơn hàng cho khách: ${info.customerName}`);
          navigate("/");
        }}
      />
    </div>
  );
}
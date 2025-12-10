import { useState, useEffect } from "react";
import { FaTrash, FaPlus, FaMinus } from "react-icons/fa";
import { vnd } from "../../utils/money";
import qr from "../../../src/assets/Qr.jpg";
import { getUserid } from "../../utils/hashToken";
import CustomuseApi from "../../Services/AxiosFetchApi";

export default function Cart() {
  // ================== CART ==================
  const [cart, setCart] = useState(() => {
    const saved = localStorage.getItem("ArrayProduct");
    return saved ? JSON.parse(saved) : [];
  });

  // ================== STATE ==================
  const [count, setCount] = useState(1);
  const [note, setNote] = useState("");
  const [dateGo, setDateGo] = useState("");
  const [showQR, setShowQR] = useState(false);
  const [time, setTime] = useState(new Date());

  // ================== EFFECTS ==================
  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (cart.length > 1) {
      localStorage.setItem("ArrayProduct", JSON.stringify([cart[0]]));
    } else {
      localStorage.setItem("ArrayProduct", JSON.stringify(cart));
    }
  }, [cart]);

  // ================== HELPERS ==================
  const removeItem = () => {
    setCart([]);
    localStorage.removeItem("ArrayProduct");
  };

  const total = cart.length > 0 ? cart[0].price * count : 0;

  // -----------------------------------------------------------
  // [SỬA 1]: CẬP NHẬT NGÀY TỐI THIỂU LÀ 3 NGÀY
  // -----------------------------------------------------------
  const minDate = new Date();
  minDate.setDate(minDate.getDate() + 3); // +3 ngày
  const minDateStr = minDate.toISOString().split("T")[0];

  // ================== HANDLE CHECKOUT ==================
  const handleCheckout = () => {
    if (!dateGo) return alert("Vui lòng chọn ngày đi!");

    const select = new Date(dateGo);
    const minAllow = new Date();

    // [SỬA 1]: KIỂM TRA LOGIC 3 NGÀY
    minAllow.setDate(minAllow.getDate() + 3);
    // Reset giờ về 0 để so sánh chính xác ngày
    select.setHours(0, 0, 0, 0);
    minAllow.setHours(0, 0, 0, 0);

    if (select < minAllow) return alert("Ngày đi phải đặt trước ít nhất 3 ngày!");
    if (cart.length === 0) return alert("Giỏ hàng đang trống!");

    setShowQR(true);
  };

  // ================== CONFIRM PAYMENT ==================
  const confirmPayment = async () => {
    try {
      if (cart.length === 0) return alert("Giỏ hàng trống!");
      const currentTour = cart[0];

      const finalGuideId = currentTour.guideId?._id || currentTour.guideId;
      if (!finalGuideId) {
        alert("Lỗi: Sản phẩm này thiếu thông tin Guide ID!");
        return;
      }

      const startDate = new Date(dateGo);
      const endDate = new Date(startDate);

      endDate.setDate(startDate.getDate() + 1);

      const payload = {
        touristId: getUserid(),
        guideId: finalGuideId,
        tourId: currentTour._id,
        dateFrom: startDate,
        dateTo: endDate,
        guests: count,
        note: note,
        paymentStatus: "Paid",
        status: "Confirmed",
        type: "private"
      };

      console.log("Payload gửi đi:", payload);

      await CustomuseApi({
        Url: "booking/create-booking",
        method: "POST",
        headers: { Authorization: `Bearer ${getUserid()}` },
        data: payload,
      });

      alert("Thanh toán thành công! Đơn hàng đã được tạo.");
      setShowQR(false);
      removeItem();

    } catch (error) {
      console.error(error);
      const msg = error.response?.data?.error || error.message;
      alert("Lỗi thanh toán: " + msg);
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 py-10 px-4">
      {/* ... (Phần Popup QR giữ nguyên) ... */}
      {showQR && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-2xl w-80 text-center shadow-xl">
            <h2 className="text-xl font-bold mb-3">Quét mã QR để thanh toán</h2>
            <img src={qr} className="w-64 h-64 mx-auto rounded-lg border" alt="QR Code" />
            <div className="mt-2 font-bold text-rose-600">{vnd(total)}</div>

            <button
              onClick={confirmPayment}
              className="mt-4 w-full bg-green-600 text-white py-2 rounded-xl font-bold hover:bg-green-700 transition"
            >
              Tôi đã thanh toán
            </button>
            <button
              onClick={() => setShowQR(false)}
              className="mt-3 w-full bg-rose-600 text-white py-2 rounded-xl font-bold hover:bg-rose-700 transition"
            >
              Đóng
            </button>
          </div>
        </div>
      )}

      {/* ... (Phần Main Layout) ... */}
      <div className="max-w-6xl mx-auto grid lg:grid-cols-[1fr_350px] gap-8">

        {/* LEFT COLUMN (Giữ nguyên) */}
        <div className="space-y-4">
          {/* ... Code hiển thị danh sách giỏ hàng giữ nguyên ... */}
          <h1 className="text-2xl font-bold text-slate-800">Giỏ Hàng</h1>
          {cart.map((item) => (
            <div
              key={item._id}
              className="bg-white rounded-2xl shadow border p-4 flex gap-4 items-center"
            >
              {/* ================== ĐÂY LÀ ẢNH CỦA BẠN ================== */}
              <img
                src={item.images?.[0]} // Lấy ảnh đầu tiên trong mảng
                alt={item.name}
                className="w-28 h-20 rounded-xl object-cover"
              />
              {/* ========================================================= */}

              <div className="flex-1">
                <h2 className="font-semibold text-slate-800 line-clamp-1">{item.name}</h2>
                <p className="text-rose-600 font-bold">{vnd(item.price)}</p>

                {/* PEOPLE COUNT */}
                <div className="flex items-center gap-3 mt-2">
                  <button
                    onClick={() => count > 1 && setCount(count - 1)}
                    className="w-7 h-7 flex items-center justify-center bg-slate-200 rounded hover:bg-slate-300"
                  >
                    <FaMinus size={12} />
                  </button>

                  <span className="font-semibold w-6 text-center">{count}</span>

                  <button
                    onClick={() => setCount(count + 1)}
                    className="w-7 h-7 flex items-center justify-center bg-slate-200 rounded hover:bg-slate-300"
                  >
                    <FaPlus size={12} />
                  </button>
                  <span className="text-sm text-slate-500">Khách</span>
                </div>
              </div>

              <div className="flex flex-col items-end gap-2">
                <div className="font-bold text-slate-700">{vnd(item.price * count)}</div>
                <button
                  onClick={removeItem}
                  className="text-rose-500 hover:text-rose-700 p-2"
                >
                  <FaTrash />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* RIGHT COLUMN (CHECKOUT) */}
        <div className="bg-white rounded-2xl shadow-xl border p-6 h-fit sticky top-10 space-y-4">
          <h2 className="text-xl font-bold text-slate-800 border-b pb-2">Thanh Toán</h2>

          {/* ... (Phần giá tiền giữ nguyên) ... */}
          <div className="space-y-2">
            <div className="flex justify-between text-sm text-slate-600"><span>Tổng cộng</span><span>{vnd(total)}</span></div>
          </div>

          {/* INPUT NGÀY ĐI */}
          <div className="flex flex-col">
            <label className="font-semibold text-slate-700 text-sm mb-1">
              Ngày khởi hành (Đặt trước 3 ngày):
            </label>
            <input
              type="date"
              min={minDateStr} // Ràng buộc ở UI
              value={dateGo}
              onChange={(e) => setDateGo(e.target.value)}
              className="border border-slate-300 rounded-lg p-2 focus:ring-2 focus:ring-rose-500 outline-none"
            />
          </div>

          {/* Note Input */}
          <div className="flex flex-col">
            <label className="font-semibold text-slate-700 text-sm mb-1">Ghi chú:</label>
            <textarea rows={3} value={note} onChange={(e) => setNote(e.target.value)} className="border rounded p-2 text-sm" />
          </div>

          <button
            onClick={handleCheckout}
            disabled={cart.length === 0}
            className="w-full py-3 rounded-xl text-white font-bold shadow-lg bg-gradient-to-r from-rose-600 to-orange-600 hover:opacity-90 transition"
          >
            Tiến Hành Thanh Toán
          </button>
        </div>
      </div>
    </div>
  );
}
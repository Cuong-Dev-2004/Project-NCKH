import { useState, useEffect } from "react";
import { FaTrash, FaPlus, FaMinus } from "react-icons/fa";
import { vnd } from "../../utils/money";
import qr from "../../assets/Qr.jpg";
import { getUserid } from "../../utils/hashToken";
import { getToken } from "../../utils/auth";
import CustomuseApi from "../../Services/AxiosFetchApi";

export default function Cart() {

  const [cart, setCart] = useState(() => {
    const saved = localStorage.getItem("ArrayProduct");
    return saved ? JSON.parse(saved) : [];
  });

  const [count, setCount] = useState(1);
  const [note, setNote] = useState("");
  const [dateGo, setDateGo] = useState("");
  const [showQR, setShowQR] = useState(false);

  // luôn đảm bảo chỉ có 1 tour
  useEffect(() => {
    if (cart.length > 1) {
      localStorage.setItem("ArrayProduct", JSON.stringify([cart[0]]));
    } else {
      localStorage.setItem("ArrayProduct", JSON.stringify(cart));
    }
  }, [cart]);

  const removeItem = () => {
    setCart([]);
    localStorage.removeItem("ArrayProduct");
  };

  const total = cart.length > 0 ? Number(cart[0].price) * count : 0;

  // ngày tối thiểu
  const minDate = new Date();
  minDate.setDate(minDate.getDate() + 3);
  const minDateStr = minDate.toISOString().split("T")[0];

  // mở popup
  const handleCheckout = () => {
    if (!dateGo) return alert("Vui lòng chọn ngày đi!");
    if (cart.length === 0) return alert("Giỏ hàng đang trống!");

    const selected = new Date(dateGo);
    const minAllow = new Date();
    minAllow.setDate(minAllow.getDate() + 3);

    selected.setHours(0, 0, 0, 0);
    minAllow.setHours(0, 0, 0, 0);

    if (selected < minAllow)
      return alert("Ngày đi phải đặt trước ít nhất 3 ngày!");

    setShowQR(true);
  };

  // confirm thanh toán
  const confirmPayment = async () => {
    try {
      if (cart.length === 0) return alert("Giỏ hàng trống!");

      const currentTour = cart[0];

      // if (!currentTour._id) return alert("Thiếu Tour ID!");
      // if (!currentTour.guideId?._id) return alert("Thiếu Guide ID!");

      const startDate = new Date(dateGo);
      startDate.setHours(0, 0, 0, 0);

      const endDate = new Date(startDate);
      endDate.setDate(startDate.getDate() + 1);

      const payload = {
        touristId: getUserid(),
        guideId: "6932984c017bab3f77c1efdf",
        tourId: currentTour._id,
        dateFrom: startDate.toISOString(),
        dateTo: endDate.toISOString(),
        price: Number(currentTour.price),
        guests: Number(count),
        note: note || "",
        paymentStatus: "Paid",
        status: "Confirmed",
        type: "private"
      };

      console.log("Payload gửi đi:", payload);

      await CustomuseApi({
        Url: "booking/create-booking",
        method: "POST",
        headers: { Authorization: `Bearer ${getToken()}` },
        data: payload,
      });

      alert("Thanh toán thành công! Booking đã được tạo.");
      setShowQR(false);
      removeItem();

    } catch (error) {
      console.error("API Error:", error);
      const msg = error?.response?.data?.error || error?.message;
      alert("Lỗi thanh toán: " + msg);
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 py-10 px-4">

      {/* POPUP QR */}
      {showQR && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-2xl w-80 text-center">
            <h3 className="text-xl font-bold mb-3">Quét mã QR để thanh toán</h3>

            <img src={qr} alt="qr" className="w-64 h-64 mx-auto rounded-xl border" />

            <div className="mt-3 font-bold text-rose-600 text-lg">
              {vnd(total)}
            </div>

            <button
              onClick={confirmPayment}
              className="w-full bg-green-600 mt-4 text-white py-2 rounded-xl font-bold hover:bg-green-700"
            >
              Tôi đã thanh toán
            </button>

            <button
              onClick={() => setShowQR(false)}
              className="w-full bg-gray-300 mt-2 py-2 rounded-xl font-bold hover:bg-gray-400"
            >
              Đóng
            </button>
          </div>
        </div>
      )}

      <div className="max-w-6xl mx-auto grid lg:grid-cols-[1fr_350px] gap-8">

        {/* LEFT */}
        <div className="space-y-4">
          <h1 className="text-2xl font-bold text-slate-800">Giỏ Hàng</h1>

          {cart.map(item => (
            <div key={item._id} className="bg-white rounded-2xl shadow border p-4 flex gap-4 items-center">
              <img src={item.images?.[0]} className="w-28 h-20 object-cover rounded-xl" />

              <div className="flex-1">
                <h2 className="font-semibold">{item.name}</h2>
                <p className="text-rose-600 font-bold">{vnd(item.price)}</p>

                <div className="flex items-center gap-3 mt-2">
                  <button onClick={() => count > 1 && setCount(count - 1)} className="bg-slate-200 rounded w-7 h-7 flex items-center justify-center">
                    <FaMinus size={12} />
                  </button>

                  <span className="font-bold">{count}</span>

                  <button onClick={() => setCount(count + 1)} className="bg-slate-200 rounded w-7 h-7 flex items-center justify-center">
                    <FaPlus size={12} />
                  </button>

                  <span>Khách</span>
                </div>
              </div>

              <div className="text-right">
                <div className="font-bold">{vnd(item.price * count)}</div>
                <button onClick={removeItem} className="text-rose-600 mt-2">
                  <FaTrash />
                </button>
              </div>
            </div>
          ))}

        </div>

        {/* RIGHT */}
        <div className="bg-white rounded-2xl shadow-xl p-6 h-fit sticky top-10">
          <h2 className="text-xl font-bold mb-3">Thanh Toán</h2>

          <div className="flex justify-between mb-2">
            <span>Tổng cộng</span>
            <span className="font-bold">{vnd(total)}</span>
          </div>

          <label className="font-semibold mt-2">Ngày khởi hành</label>
          <input
            type="date"
            min={minDateStr}
            value={dateGo}
            onChange={e => setDateGo(e.target.value)}
            className="border rounded p-2 w-full"
          />

          <label className="font-semibold mt-2">Ghi chú</label>
          <textarea
            rows={3}
            value={note}
            onChange={e => setNote(e.target.value)}
            className="border rounded p-2 w-full"
          />

          <button
            onClick={handleCheckout}
            disabled={cart.length === 0}
            className="w-full mt-4 py-3 bg-gradient-to-r from-rose-600 to-orange-600 text-white rounded-xl font-bold"
          >
            Tiến hành thanh toán
          </button>
        </div>

      </div>
    </div>
  );
}

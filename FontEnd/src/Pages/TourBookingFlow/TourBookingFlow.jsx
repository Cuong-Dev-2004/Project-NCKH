// src/pages/TourBookingFlow.jsx
import { useEffect, useState } from "react";
import { FaMapPin, FaUser } from "react-icons/fa";
import { vnd } from "../../utils/money";
import { isLoggedIn } from "../../utils/auth";
import { getUserid } from "../../utils/hashToken";
import CustomuseApi from "../../Services/AxiosFetchApi";

import NavDown from "../../components/Ui/NavDownTourBookingFlow";
import ItemViewGuilde from "../../components/Ui/ItemGuilde/ItemGuilde";
import QrBaking from "../../components/Ui/QrBaking/Qrbaking";
import Toast from "../../components/Ui/Toast/Toast";

function TourBookingFlow() {
  // DATA
  const [Data, setData] = useState([]);
  const [guides, setGuides] = useState([]);
  const [currentTour, setCurrentTour] = useState(null);

  // FORM
  const [selectedProduct, setSelectedProduct] = useState("0");

  const [form, setForm] = useState({
    tour: null,
    guide: getUserid(),
    dateFrom: "",
    dateTo: "",
    guests: 1,
    note: "",
    price: 0

  });

  // PRICE
  const [days, setDays] = useState(0);
  const [tourPrice, setTourPrice] = useState(0);
  const [guidePrice, setGuidePrice] = useState(0);
  const [serviceTax, setServiceTax] = useState(0);
  const [totalPrice, setTotalPrice] = useState(0);

  // UI
  const [showQR, setShowQR] = useState(false);
  const [toast, setToast] = useState({ open: false, type: "info", message: "" });

  // ---- LOAD DATA ----
  useEffect(() => {
    async function loadTours() {
      try {
        const result = await CustomuseApi({ Url: "staff/GetAllProdcutTour", method: "GET" });
        setData(result.products || []);

        const saved = localStorage.getItem("idProduct");
        if (saved) {
          const product = JSON.parse(saved);
          const exist = result.products.find((p) => p._id === product.id);
          if (exist) {
            setSelectedProduct(product.id);
            setCurrentTour(exist);
            setForm(prev => ({ ...prev, tour: exist._id }));
          }
        }
      } catch (error) {
        console.error("Lỗi load sản phẩm:", error);
      }
    }

    async function loadGuides() {
      try {
        const result = await CustomuseApi({ Url: "staff/Guides", method: "GET" });
        setGuides(result.guides || []);
      } catch (error) {
        console.error("Lỗi load guides:", error);
      }
    }

    loadTours();
    loadGuides();
  }, []);

  // ---- CALC DAYS ----
  const calcDays = (from, to) => {
    if (!from || !to) return setDays(0);
    const diff = (new Date(to) - new Date(from)) / (1000 * 60 * 60 * 24);
    setDays(diff > 0 ? diff : 0);
  };

  // ---- CALC TOTAL PRICE ----
  useEffect(() => {
    const tTourPrice = currentTour ? currentTour.price : 0;
    const tGuidePrice = form.guide ? (form.guide.pricePerHour || 0) * days : 0;
    const tServiceTax = Math.round((tTourPrice + tGuidePrice) * 0.1);
    const guestFee = form.guests * 300000;
    const tTotal = tTourPrice + tGuidePrice + tServiceTax + guestFee;

    setTourPrice(tTourPrice);
    setGuidePrice(tGuidePrice);
    setServiceTax(tServiceTax);
    setTotalPrice(tTotal);
    setForm(prev => ({ ...prev, price: tTotal }))
  }, [currentTour, form.guide, days, form.guests]);

  // ---- SELECT GUIDE ----
  const selectGuide = (guide) => {
    setForm(prev => ({ ...prev, guide: prev.guide?._id === guide._id ? null : guide }));
  };

  // ---- SHOW TOAST ----
  const showToast = (type, message) => {
    setToast({ open: true, type, message });
    setTimeout(() => setToast(prev => ({ ...prev, open: false })), 3000);
  };

  // ---- SUBMIT ----
  const submitBooking = () => {
    if (!isLoggedIn()) return showToast("warn", "Bạn cần đăng nhập để đặt booking!");
    if (!form.tour && !form.guide) return showToast("warn", "Chọn tour hoặc HDV trước khi tiếp tục!");
    if (!form.dateFrom || !form.dateTo) return showToast("warn", "Vui lòng chọn ngày đi và ngày về!");
    setShowQR(true); // mở QR modal
  };

  // ---- HANDLE SUCCESS PAYMENT ----
  const handlePaymentSuccess = (message) => {
    showToast("success", message || "Thanh toán thành công!");
  };

  return (
    <section className="w-full bg-slate-50 py-10 min-h-screen font-sans">
      <div className="max-w-[1400px] mx-auto px-4 md:px-6">
        {/* HEADER */}
        <div className="flex flex-col md:flex-row justify-between mb-8 gap-4 items-center">
          <h2 className="text-3xl font-bold text-slate-800">Chọn Hướng Dẫn Viên</h2>
          <div className="text-sm text-slate-500 bg-white px-4 py-2 rounded-full shadow-sm border border-slate-100">
            Tìm thấy <b>{guides.length}</b> kết quả
          </div>
        </div>

        {/* BODY */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* LEFT */}
          <div className="lg:col-span-8 space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {guides.map((item) => (
                <ItemViewGuilde
                  key={item._id}
                  props={item}
                  selectedGuide={form.guide?._id}
                  setPriceGuilde={selectGuide}
                />
              ))}
            </div>
          </div>

          {/* RIGHT */}
          <div className="lg:col-span-4">
            <div className="bg-white rounded-3xl shadow-xl border border-slate-100 sticky top-6 overflow-hidden">
              <div className="bg-slate-900 p-6 text-white">
                <h3 className="text-xl font-bold">Thông tin đặt tour</h3>
              </div>

              <div className="p-6 space-y-5">
                {/* Chọn tour */}
                <div>
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wide ml-1">
                    Gói Tour (Tùy chọn)
                  </label>
                  <select
                    value={selectedProduct}
                    onChange={(e) => {
                      const id = e.target.value;
                      setSelectedProduct(id);
                      const tourObj = Data.find((p) => p._id === id) || null;
                      setCurrentTour(tourObj);
                      setForm(prev => ({ ...prev, tour: tourObj ? tourObj._id : null }));
                    }}
                    className="w-full pl-3 pr-8 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm"
                  >
                    <option value="0">-- Chỉ thuê HDV --</option>
                    {Data.map((item) => (
                      <option value={item._id} key={item._id}>
                        {item.name} ({vnd(item.price)})
                      </option>
                    ))}
                  </select>
                </div>

                {/* Ngày đi / về */}
                <div className="grid grid-cols-2 gap-4">
                  <input
                    type="date"
                    value={form.dateFrom}
                    onChange={(e) => {
                      setForm(prev => ({ ...prev, dateFrom: e.target.value }));
                      calcDays(e.target.value, form.dateTo);
                    }}
                    className="border rounded-xl p-2"
                  />
                  <input
                    type="date"
                    value={form.dateTo}
                    onChange={(e) => {
                      setForm(prev => ({ ...prev, dateTo: e.target.value }));
                      calcDays(form.dateFrom, e.target.value);
                    }}
                    className="border rounded-xl p-2"
                  />
                </div>

                {/* Số khách */}
                <input
                  type="number"
                  min={1}
                  value={form.guests}
                  onChange={(e) => setForm(prev => ({ ...prev, guests: e.target.value }))}
                  className="w-full border rounded-xl p-2"
                />

                {/* Ghi chú */}
                <textarea
                  value={form.note}
                  onChange={(e) => setForm(prev => ({ ...prev, note: e.target.value }))}
                  placeholder="Ghi chú..."
                  className="w-full border rounded-xl p-2"
                />

                {/* Chi tiết giá */}
                <div className="bg-indigo-50/60 p-5 rounded-2xl border border-indigo-100 space-y-2.5 text-sm text-slate-700">
                  <div className="flex justify-between"><span>Tour</span><span>{vnd(tourPrice)}</span></div>
                  <div className="flex justify-between"><span>Thuê HDV ({days} ngày)</span><span>{vnd(guidePrice)}</span></div>
                  <div className="flex justify-between"><span>Phí dịch vụ 10%</span><span>{vnd(serviceTax)}</span></div>
                  <div className="flex justify-between"><span>Số khách</span><span>{form.guests}</span></div>
                  <div className="flex justify-between font-bold text-lg mt-2 border-t pt-2"><span>Tổng cộng</span><span>{vnd(totalPrice)}</span></div>
                </div>

                <button
                  onClick={submitBooking}
                  className="w-full py-3.5 rounded-xl bg-gradient-to-r from-indigo-600 to-blue-600 text-white font-bold text-lg"
                >
                  Xác nhận & Thanh toán
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* QR Modal */}
      {showQR && (
        <QrBaking
          form={form}
          currentTour={currentTour}
          setShowQR={setShowQR}
          setForm={setForm}
          onSuccess={handlePaymentSuccess}
        />
      )}

      {/* Toast */}
      <Toast
        open={toast.open}
        type={toast.type}
        message={toast.message}
        onClose={() => setToast(prev => ({ ...prev, open: false }))}
      />
    </section>
  );
}

export default TourBookingFlow;

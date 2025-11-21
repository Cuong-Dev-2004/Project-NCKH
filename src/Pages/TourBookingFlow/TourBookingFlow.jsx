// src/Pages/TourBookingFlow/TourBookingFlow.jsx
import { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { 
  User, Phone, Calendar, Users, FileText, 
  MapPin, Globe, Award, CheckCircle, Star, Calculator, PlusCircle 
} from "lucide-react";
import NavDown from "../../components/Ui/NavDownTourBookingFlow";

// ✅ SỬ DỤNG DỮ LIỆU TĨNH (KHÔNG ĐỒNG BỘ ADMIN)
import guidesAllRaw from "../../data/guides";
import { TOURS } from "../../data/tours";

import { vnd } from "../../utils/money";
import { useCart } from "../../utils/cartContext.jsx";

// --- CÁC HÀM HỖ TRỢ ---
function countDaysInclusive(startDate, endDate) {
  if (!startDate) return 1;
  const s = new Date(startDate);
  const e = new Date(endDate || startDate);
  const ONE = 24 * 60 * 60 * 1000;
  return Math.max(1, Math.round((e - s) / ONE) + 1);
}

function calcTotal({ basePrice, qty, people = 1, extraRatePerPerson = 0.1, commissionRate = 0.2, platformFee = 0, taxRate = 0, packageFee = 0 }) {
  const subtotal = (Number(basePrice) || 0) * (Number(qty) || 0);
  const extraPeopleCount = Math.max(0, Number(people || 1) - 1);
  const extraPeopleFee = subtotal * (Number(extraRatePerPerson) || 0) * extraPeopleCount;
  const commission = (subtotal + extraPeopleFee) * (Number(commissionRate) || 0);
  const pf = Number(platformFee) || 0;
  const tax = commission * (Number(taxRate) || 0);
  const totalPackageFee = (Number(packageFee) || 0) * people; 
  const total = subtotal + extraPeopleFee + commission + pf + tax + totalPackageFee;
  return { subtotal, extraPeopleFee, commission, platformFee: pf, tax, packageFee: totalPackageFee, total, extraPeopleCount };
}

const FormInput = ({ icon: Icon, label, ...props }) => (
  <div className="space-y-1.5">
    <label className="text-xs font-bold text-slate-500 uppercase tracking-wide ml-1">{label}</label>
    <div className="relative">
      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
        <Icon size={18} />
      </div>
      <input
        {...props}
        className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all shadow-sm"
      />
    </div>
  </div>
);

export default function TourBookingFlow() {
  const navigate = useNavigate();
  const locationHook = useLocation();
  const { add } = useCart();
  const qs = useMemo(() => new URLSearchParams(locationHook.search), [locationHook.search]);

  // --- 1. XỬ LÝ TOUR (Lấy từ file tours.js) ---
  const [selectedTourId, setSelectedTourId] = useState(Number(qs.get("tourId")) || 0);
  const currentTour = useMemo(() => TOURS.find(t => t.id === selectedTourId), [selectedTourId]);

  // --- 2. DỮ LIỆU HDV (Lấy trực tiếp từ file, KHÔNG qua Admin) ---
  // Chuẩn hóa dữ liệu: Thêm priceType nếu thiếu
  const guidesAll = useMemo(() => guidesAllRaw.map(g => ({ ...g, priceType: "ngày" })), []);

  const [filters, setFilters] = useState({
    location: qs.get("destination") || (currentTour?.location || ""),
    language: qs.get("language") || "",
    style: qs.get("guideStyle") || "",
    startDate: qs.get("startDate") || "",
    endDate: qs.get("endDate") || "",
    people: Number(qs.get("people") || 1),
  });

  const [miniForm, setMiniForm] = useState({
    fullName: qs.get("name") || "",
    phone: qs.get("phone") || "",
    startDate: qs.get("startDate") || "",
    endDate: qs.get("endDate") || "",
    notes: qs.get("notes") || "",
  });

  const priceCfg = { commissionRate: 0.2, platformFee: 0, taxRate: 0, extraRatePerPerson: 0.1 };
  const [renderGuides, setRenderGuides] = useState(guidesAll);
  const [selectedGuide, setSelectedGuide] = useState(null);
  const [page, setPage] = useState(1);
  const PER_PAGE = 6;

  // Lọc danh sách
  useEffect(() => {
    let filtered = guidesAll;
    if (filters.location) filtered = filtered.filter((g) => g.location === filters.location);
    if (filters.language) filtered = filtered.filter((g) => g.language === filters.language);
    if (filters.style) filtered = filtered.filter((g) => g.style === filters.style);
    setRenderGuides(filtered);
    setPage(1);
  }, [filters, guidesAll]);

  const pagedGuides = useMemo(() => renderGuides.slice((page - 1) * PER_PAGE, page * PER_PAGE), [renderGuides, page]);
  const totalPages = Math.ceil(renderGuides.length / PER_PAGE);

  const onPickGuide = (guide) => {
    // Vẫn kiểm tra trạng thái có sẵn trong file cứng
    if (!guide.available) return; 
    setSelectedGuide(guide);
    setFilters(s => ({ ...s, location: s.location || guide.location, language: s.language || guide.language, style: s.style || guide.style }));
  };

  const qty = useMemo(() => {
    if (!selectedGuide) return 0;
    return countDaysInclusive(miniForm.startDate || filters.startDate, miniForm.endDate || filters.endDate);
  }, [selectedGuide, miniForm.startDate, miniForm.endDate, filters.startDate, filters.endDate]);

  const money = useMemo(() => {
    if (!selectedGuide) return { subtotal: 0, extraPeopleFee: 0, commission: 0, platformFee: 0, tax: 0, packageFee: 0, total: 0, extraPeopleCount: 0 };
    return calcTotal({
      basePrice: selectedGuide.price,
      qty,
      people: filters.people,
      ...priceCfg,
      packageFee: currentTour?.price || 0,
    });
  }, [selectedGuide, qty, filters.people, currentTour]);

  const handleAddToCartAndCheckout = () => {
    if (!selectedGuide) return alert("Vui lòng chọn hướng dẫn viên!");
    if (!miniForm.fullName || !miniForm.phone) return alert("Vui lòng nhập họ tên và số điện thoại!");
    
    const start = miniForm.startDate || filters.startDate;
    const end = miniForm.endDate || filters.endDate;
    if (!start || !end) return alert("Vui lòng chọn ngày đi và về.");

    const keyBase = `bk-${Date.now()}`;

    // Thêm HDV
    add({
      key: `${keyBase}-guide`,
      id: selectedGuide.id,
      name: `HDV ${selectedGuide.name} (${qty} ngày)`,
      img: selectedGuide.image,
      price: selectedGuide.price, 
      qty: qty,
      meta: {
        type: 'guide',
        checkIn: start,
        checkOut: end,
        adults: filters.people,
        customerName: miniForm.fullName,
        phone: miniForm.phone,
        note: miniForm.notes,
        guideId: selectedGuide.id,
        tourId: currentTour?.id || 0,
      }
    });

    // Thêm Tour (nếu có)
    if (currentTour) {
      add({
        key: `${keyBase}-tour`,
        id: currentTour.id,
        name: `Gói Tour: ${currentTour.name}`,
        img: currentTour.img,
        price: currentTour.price,
        qty: filters.people,
        meta: {
          type: 'tour',
          tourId: currentTour.id,
          customerName: miniForm.fullName,
          checkIn: start
        }
      });
    }
    navigate("/gio_hang");
  };

  const resetFilters = () => { setFilters(s => ({ ...s, location: "", language: "", style: "" })); setPage(1); };

  return (
    <section className="w-full bg-slate-50 py-10 text-slate-800 min-h-screen font-sans">
      <div className="max-w-[1400px] mx-auto px-4 md:px-6">
        
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
          <div>
            <h2 className="text-3xl font-bold text-slate-800">Chọn Hướng Dẫn Viên</h2>
            {currentTour ? (
              <div className="flex items-center gap-2 mt-2 text-indigo-600 bg-indigo-50 px-3 py-1.5 rounded-lg w-fit border border-indigo-100">
                <MapPin size={16} />
                <span className="text-sm font-medium">Đang đặt cho: <b>{currentTour.name}</b></span>
              </div>
            ) : (
               <div className="flex items-center gap-2 mt-2 text-slate-500 bg-white px-3 py-1.5 rounded-lg w-fit border border-slate-200">
                <PlusCircle size={16} />
                <span className="text-sm">Chưa chọn tour (Thuê HDV tự do)</span>
              </div>
            )}
          </div>
          <div className="text-sm text-slate-500 bg-white px-4 py-2 rounded-full shadow-sm border border-slate-100">
            Tìm thấy <b>{renderGuides.length}</b> kết quả phù hợp
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* LEFT COLUMN: Filters & List */}
          <div className="lg:col-span-8 space-y-6">
            
            {/* Filter Bar */}
            <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 flex flex-wrap items-center gap-3">
              <NavDown data={[...new Set(guidesAll.map(g => g.location))]} type="Địa phương" onChange={v => setFilters(s => ({ ...s, location: v }))} />
              <NavDown data={[...new Set(guidesAll.map(g => g.language))]} type="Ngôn ngữ" onChange={v => setFilters(s => ({ ...s, language: v }))} />
              <NavDown data={[...new Set(guidesAll.map(g => g.style))]} type="Phong cách" onChange={v => setFilters(s => ({ ...s, style: v }))} />
              <button onClick={resetFilters} className="ml-auto text-sm px-4 py-2 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 transition-colors">
                Xóa bộ lọc
              </button>
            </div>

            {/* Guide Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {pagedGuides.map((guide) => (
                <div key={guide.id} className={`relative group bg-white rounded-2xl p-5 shadow-sm border border-slate-100 hover:shadow-md hover:-translate-y-1 transition-all duration-300 ${selectedGuide?.id === guide.id ? 'ring-2 ring-indigo-500 border-transparent' : ''} ${!guide.available ? 'opacity-60 grayscale pointer-events-none' : ''}`}>
                  
                  {/* Badge */}
                  <div className={`absolute top-4 right-4 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wide ${guide.available ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'}`}>
                    {guide.available ? "Có sẵn" : "Bận"}
                  </div>

                  {/* Info */}
                  <div className="flex flex-col items-center text-center mb-4">
                    <img src={guide.image} alt={guide.name} className="w-20 h-20 rounded-full object-cover ring-4 ring-slate-50 shadow-sm mb-3" />
                    <h3 className="font-bold text-lg text-slate-800">{guide.name}</h3>
                    <div className="flex items-center justify-center gap-2 text-xs text-slate-500 mt-1">
                      <span className="flex items-center gap-1"><MapPin size={12}/> {guide.location}</span>
                      <span>•</span>
                      <span className="flex items-center gap-1"><Globe size={12}/> {guide.language}</span>
                    </div>
                  </div>

                  {/* Specs */}
                  <div className="grid grid-cols-2 gap-2 mb-4 text-xs text-slate-600 bg-slate-50 p-3 rounded-xl">
                      <div className="flex items-center gap-1.5"><Award size={14} className="text-indigo-500"/> {guide.style}</div>
                      <div className="flex items-center gap-1.5 justify-end"><Star size={14} className="text-amber-400 fill-amber-400"/> {guide.rating}</div>
                  </div>

                  {/* Price & Action */}
                  <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                    <div>
                      <span className="text-lg font-bold text-indigo-600">{vnd(guide.price)}</span>
                      <span className="text-xs text-slate-400"> /ngày</span>
                    </div>
                    <button 
                      disabled={!guide.available} 
                      onClick={() => onPickGuide(guide)} 
                      className={`px-5 py-2 rounded-xl text-sm font-semibold shadow-sm transition-all ${guide.available ? 'bg-slate-900 text-white hover:bg-indigo-600' : 'bg-slate-100 text-slate-400 cursor-not-allowed'}`}
                    >
                      {selectedGuide?.id === guide.id ? "Đã chọn" : (guide.available ? "Chọn" : "Bận")}
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center gap-2 pt-4">
                <button disabled={page === 1} onClick={() => setPage(p => p - 1)} className="w-10 h-10 flex items-center justify-center rounded-xl border bg-white hover:bg-slate-50 disabled:opacity-50">«</button>
                <span className="h-10 px-4 flex items-center justify-center rounded-xl border bg-white font-semibold text-indigo-600">{page} / {totalPages}</span>
                <button disabled={page === totalPages} onClick={() => setPage(p => p + 1)} className="w-10 h-10 flex items-center justify-center rounded-xl border bg-white hover:bg-slate-50 disabled:opacity-50">»</button>
              </div>
            )}
          </div>

          {/* RIGHT COLUMN: Booking Form */}
          <div className="lg:col-span-4">
            <div className="bg-white rounded-3xl shadow-xl border border-slate-100 sticky top-6 overflow-hidden">
              
              {/* Form Header */}
              <div className="bg-slate-900 p-6 text-white">
                <h3 className="text-xl font-bold flex items-center gap-2">
                  <FileText className="text-indigo-400" /> Thông tin đặt tour
                </h3>
                <p className="text-slate-400 text-xs mt-1">Vui lòng điền đầy đủ thông tin bên dưới</p>
              </div>

              <div className="p-6 space-y-5">
                
                {/* Select Box Chọn Tour */}
                <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wide ml-1">Gói Tour (Tùy chọn)</label>
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400"><MapPin size={18} /></div>
                        <select 
                            className="w-full pl-10 pr-8 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all shadow-sm appearance-none cursor-pointer truncate"
                            value={selectedTourId}
                            onChange={(e) => setSelectedTourId(Number(e.target.value))}
                        >
                            <option value={0}>-- Chỉ thuê HDV (Không bao gồm tour) --</option>
                            {TOURS.map(t => (
                                <option key={t.id} value={t.id}>
                                    {t.name} ({vnd(t.price)})
                                </option>
                            ))}
                        </select>
                    </div>
                </div>

                {/* Customer Info */}
                <div className="space-y-4">
                  <FormInput icon={User} label="Họ và tên" placeholder="VD: Nguyễn Văn A" value={miniForm.fullName} onChange={e => setMiniForm(s => ({ ...s, fullName: e.target.value }))} />
                  <FormInput icon={Phone} label="Số điện thoại" placeholder="090..." value={miniForm.phone} onChange={e => setMiniForm(s => ({ ...s, phone: e.target.value }))} />
                </div>

                {/* Dates & People */}
                <div className="grid grid-cols-2 gap-4">
                  <FormInput icon={Calendar} label="Ngày đi" type="date" value={miniForm.startDate || filters.startDate} onChange={e => setMiniForm(s => ({ ...s, startDate: e.target.value }))} />
                  <FormInput icon={Calendar} label="Ngày về" type="date" value={miniForm.endDate || filters.endDate} onChange={e => setMiniForm(s => ({ ...s, endDate: e.target.value }))} />
                </div>

                <div className="space-y-1.5">
                   <label className="text-xs font-bold text-slate-500 uppercase tracking-wide ml-1">Số lượng khách</label>
                   <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400"><Users size={18} /></div>
                      <input type="number" min={1} className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all" value={filters.people} onChange={e => setFilters(s => ({ ...s, people: Math.max(1, Number(e.target.value)) }))} />
                   </div>
                </div>

                <div className="space-y-1.5">
                   <label className="text-xs font-bold text-slate-500 uppercase tracking-wide ml-1">Ghi chú</label>
                   <textarea rows={3} className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none" placeholder="Yêu cầu đặc biệt..." value={miniForm.notes} onChange={e => setMiniForm(s => ({ ...s, notes: e.target.value }))} />
                </div>

                {/* Cost Summary */}
                <div className="bg-indigo-50/60 p-5 rounded-2xl border border-indigo-100 space-y-2.5 text-sm text-slate-700">
                  <div className="flex items-center gap-2 font-bold text-indigo-800 mb-2 border-b border-indigo-200 pb-2"><Calculator size={16} /> Chi tiết tạm tính</div>
                  
                  {currentTour && (
                    <div className="flex justify-between items-center">
                      <span>Gói Tour ({filters.people} khách)</span>
                      <span className="font-bold">{vnd(money.packageFee)}</span>
                    </div>
                  )}

                  <div className="flex justify-between items-center">
                    <span>Thuê HDV ({qty} ngày)</span>
                    <span className="font-bold">{vnd(money.subtotal)}</span>
                  </div>
                  
                  {money.extraPeopleFee > 0 && (
                    <div className="flex justify-between items-center text-xs text-slate-500">
                      <span>Phụ thu khách thêm</span>
                      <span>{vnd(money.extraPeopleFee)}</span>
                    </div>
                  )}
                  
                  <div className="flex justify-between items-center text-xs text-slate-500">
                    <span>Phí dịch vụ & Thuế</span>
                    <span>{vnd(money.commission + money.tax)}</span>
                  </div>
                  
                  <div className="pt-3 mt-2 border-t border-indigo-200 flex justify-between items-center">
                    <span className="font-bold text-slate-800 text-lg">Tổng cộng</span>
                    <span className="font-extrabold text-2xl text-indigo-600">{vnd(money.total)}</span>
                  </div>
                </div>

                {/* Action Button */}
                <button 
                  onClick={handleAddToCartAndCheckout} 
                  disabled={!selectedGuide || !selectedGuide.available || qty < 1 || !miniForm.fullName || !miniForm.phone} 
                  className="w-full py-3.5 rounded-xl bg-gradient-to-r from-indigo-600 to-blue-600 text-white font-bold text-lg shadow-lg shadow-indigo-200 hover:shadow-xl hover:-translate-y-0.5 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  <CheckCircle size={20} /> Xác nhận & Thanh toán
                </button>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
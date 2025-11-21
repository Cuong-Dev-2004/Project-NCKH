import { useMemo, useState, useEffect } from "react";
import { DetailPresets } from "../../data/Data";
import guidesDefault from "../../data/guides"; 
import { 
  MapPin, User, Calendar, Clock, Users, Mail, Phone, FileText, 
  CheckCircle, PlusCircle, Calculator, RefreshCcw
} from "lucide-react";

// --- CONSTANTS ---
const LS_ORDER_KEY = "bookings_admin_demo_v1";
const LS_GUIDE_STATUS = "GUIDE_DATA_FINAL_V99"; 

const TOURS = Object.values(DetailPresets)
  .map((x) => ({ id: Number(x.id), name: x.name, price: Number(x.price) }))
  .sort((a, b) => a.id - b.id);

const vnd = (n) => (Number(n || 0)).toLocaleString("vi-VN") + "đ";
const genCode = () => {
  const d = new Date();
  return `BK-${d.getFullYear()}${String(d.getMonth() + 1).padStart(2,"0")}${String(d.getDate()).padStart(2,"0")}-${Math.floor(Math.random()*9000+1000)}`;
};

const InputField = ({ label, icon: Icon, ...props }) => (
  <div className="space-y-1.5">
    <label className="text-sm font-medium text-slate-700">{label}</label>
    <div className="relative">
      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
        <Icon size={18} />
      </div>
      <input
        {...props}
        className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent shadow-sm transition-all disabled:bg-slate-100 disabled:text-slate-400"
      />
    </div>
  </div>
);

export default function QuickCreatePage() {
  const [guides, setGuides] = useState([]);
  
  // Load dữ liệu HDV mới nhất
  const loadGuidesData = () => {
    const savedGuides = localStorage.getItem(LS_GUIDE_STATUS);
    if (savedGuides) {
      setGuides(JSON.parse(savedGuides));
    } else {
      setGuides(guidesDefault.map(g => ({ ...g, priceType: "ngày" })));
    }
  };

  useEffect(() => {
    loadGuidesData();
    const handleStorage = (e) => { if (e.key === LS_GUIDE_STATUS) loadGuidesData(); };
    window.addEventListener('storage', handleStorage);
    window.addEventListener('focus', loadGuidesData);
    
    return () => {
      window.removeEventListener('storage', handleStorage);
      window.removeEventListener('focus', loadGuidesData);
    };
  }, []);

  const availableGuides = useMemo(() => guides.filter(g => g.available), [guides]);

  const [form, setForm] = useState({
    tourId: 0, // Mặc định là 0 (Không chọn tour)
    guideId: 0, 
    customerName: "",
    phone: "",
    email: "",
    people: 2,
    checkinDate: new Date().toISOString().slice(0, 10),
    days: 1,
    note: "",
  });

  // Auto-select HDV đầu tiên nếu chưa chọn
  useEffect(() => {
    if (availableGuides.length > 0 && form.guideId === 0) {
        setForm(f => ({ ...f, guideId: availableGuides[0].id }));
    }
  }, [availableGuides]);

  const tour = useMemo(() => TOURS.find((t) => t.id === Number(form.tourId)), [form.tourId]);
  const guide = useMemo(() => guides.find((g) => g.id === Number(form.guideId)), [form.guideId, guides]);

  const total = useMemo(() => {
    // Nếu không chọn tour (tourId=0) -> tourCost = 0
    const tourCost = (tour?.price || 0) * form.people; 
    // Giá HDV * số ngày
    const guideCost = (guide?.price || 0) * form.days;
    return tourCost + guideCost;
  }, [tour, guide, form.people, form.days]);

  const save = (e) => {
    e.preventDefault();

    if (!guide) return alert("Vui lòng chọn hướng dẫn viên!");
    if (!guide.available) {
        alert(`HDV ${guide.name} hiện đang BẬN. Vui lòng chọn người khác.`);
        return;
    }
    
    const ok = window.confirm(`Xác nhận tạo đơn mới cho khách ${form.customerName}?`);
    if (!ok) return;

    const raw = localStorage.getItem(LS_ORDER_KEY);
    const data = raw ? JSON.parse(raw) : [];
    const now = new Date().toISOString();

    data.push({
      _id: crypto.randomUUID(),
      code: genCode(),
      tourId: tour ? tour.id : 0,
      tourName: tour ? tour.name : "Thuê HDV tự do (Không tour)", // Tên hiển thị khi không chọn tour
      guideId: guide?.id,
      guideName: guide?.name,
      customerName: form.customerName || "Khách lẻ",
      phone: form.phone,
      email: form.email,
      people: Number(form.people),
      checkinDate: form.checkinDate,
      days: Number(form.days),
      note: form.note,
      total,
      status: "confirmed", 
      createdAt: now,
      updatedAt: now,
    });

    localStorage.setItem(LS_ORDER_KEY, JSON.stringify(data));
    window.dispatchEvent(new Event("storage")); 
    
    alert("✅ Đã tạo đơn thành công!");
    
    setForm(prev => ({
      ...prev,
      customerName: "",
      phone: "",
      email: "",
      note: ""
    }));
  };

  return (
    <div className="flex justify-center p-6 bg-slate-50 min-h-screen">
      <section className="w-full max-w-4xl bg-white rounded-2xl shadow-xl border border-slate-100 overflow-hidden">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-indigo-600 to-blue-700 p-6 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-white/20 rounded-lg"><PlusCircle size={24} /></div>
            <div>
              <h3 className="text-xl font-bold">Tạo Đơn Tour Nhanh (Admin)</h3>
              <p className="text-indigo-100 text-sm">Hệ thống tự động tính giá theo Tour và HDV</p>
            </div>
          </div>
          <button onClick={loadGuidesData} className="p-2 bg-white/20 hover:bg-white/30 rounded-lg transition" title="Làm mới dữ liệu">
            <RefreshCcw size={18} />
          </button>
        </div>

        <form onSubmit={save} className="p-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            
            {/* CỘT TRÁI: DỊCH VỤ */}
            <div className="space-y-5">
              <h4 className="text-sm font-bold text-slate-400 uppercase tracking-wider border-b pb-2 mb-4">
                Thông tin dịch vụ
              </h4>

              <div className="space-y-1.5">
                <label className="text-sm font-medium text-slate-700">Chọn Gói Tour (Tùy chọn)</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                    <MapPin size={18} />
                  </div>
                  <select
                    value={form.tourId}
                    onChange={(e) => setForm({ ...form, tourId: Number(e.target.value) })}
                    className="w-full pl-10 pr-10 py-2.5 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 shadow-sm appearance-none cursor-pointer"
                  >
                    {/* 🔥 Tùy chọn không tour */}
                    <option value={0}>-- Chỉ thuê HDV (Không bao gồm tour) --</option>
                    {TOURS.map((t) => (
                      <option key={t.id} value={t.id}>
                        {t.name} — {vnd(t.price)}/người
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-medium text-slate-700">Hướng dẫn viên (Đang rảnh)</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                    <User size={18} />
                  </div>
                  <select
                    value={form.guideId}
                    onChange={(e) => setForm({ ...form, guideId: Number(e.target.value) })}
                    className="w-full pl-10 pr-10 py-2.5 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 shadow-sm appearance-none cursor-pointer"
                  >
                    {availableGuides.length === 0 && <option value={0}>-- Không có HDV nào rảnh --</option>}
                    {availableGuides.map((g) => (
                      <option key={g.id} value={g.id}>
                        {g.name} ({g.location}) — {vnd(g.price)}/ngày
                      </option>
                    ))}
                  </select>
                </div>
                
                {guide ? (
                  <div className="flex items-center gap-2 text-xs mt-2 p-2 rounded-lg border bg-emerald-50 border-emerald-100 text-emerald-700">
                    <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                    <span className="font-bold">Đang rảnh</span> 
                    <span>• {guide.language} • {guide.style}</span>
                  </div>
                ) : (
                  <div className="text-xs text-rose-500 mt-2 italic">Vui lòng chọn một HDV</div>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <InputField 
                  label="Ngày khởi hành" icon={Calendar} type="date"
                  value={form.checkinDate}
                  onChange={(e) => setForm({ ...form, checkinDate: e.target.value })}
                />
                <InputField 
                  label="Số ngày đi" icon={Clock} type="number" min={1}
                  value={form.days}
                  onChange={(e) => setForm({ ...form, days: Number(e.target.value) })}
                />
              </div>
              
              <div className="p-4 bg-indigo-50 rounded-xl border border-indigo-100 text-sm text-indigo-900">
                <div className="flex items-center gap-2 mb-2 font-bold">
                  <Calculator size={16} /> Chi tiết tạm tính:
                </div>
                <ul className="space-y-1 pl-5 list-disc text-xs opacity-80">
                  {tour ? (
                      <li>
                        <b>Tour:</b> {vnd(tour.price)} x {form.people} khách = 
                        <span className="font-mono font-bold ml-1">{vnd(tour.price * form.people)}</span>
                      </li>
                  ) : (
                      <li><b>Tour:</b> Không chọn (0đ)</li>
                  )}
                  <li>
                    <b>HDV:</b> {guide ? `${guide.name} (${vnd(guide.price)}/ngày)` : "Chưa chọn"} x {form.days} ngày = 
                    <span className="font-mono font-bold ml-1">{vnd((guide?.price || 0) * form.days)}</span>
                  </li>
                </ul>
              </div>
            </div>

            {/* CỘT PHẢI: KHÁCH HÀNG */}
            <div className="space-y-5">
              <h4 className="text-sm font-bold text-slate-400 uppercase tracking-wider border-b pb-2 mb-4">
                Thông tin khách hàng
              </h4>

              <InputField 
                label="Họ và tên" icon={User} placeholder="VD: Nguyễn Văn A"
                value={form.customerName}
                onChange={(e) => setForm({ ...form, customerName: e.target.value })}
              />

              <div className="grid grid-cols-2 gap-4">
                <InputField 
                  label="Số điện thoại" icon={Phone} placeholder="090..."
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                />
                 <InputField 
                  label="Số lượng khách" icon={Users} type="number" min={1}
                  value={form.people}
                  onChange={(e) => setForm({ ...form, people: Number(e.target.value) })}
                />
              </div>

              <InputField 
                label="Email liên hệ" icon={Mail} type="email" placeholder="email@example.com"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
              />

              <div className="space-y-1.5">
                <label className="text-sm font-medium text-slate-700">Ghi chú thêm</label>
                <div className="relative">
                  <div className="absolute top-3 left-3 pointer-events-none text-slate-400">
                    <FileText size={18} />
                  </div>
                  <textarea
                    rows={3}
                    value={form.note}
                    onChange={(e) => setForm({ ...form, note: e.target.value })}
                    className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 shadow-sm resize-none"
                    placeholder="Yêu cầu đặc biệt (ăn chay, đón sân bay...)"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Footer Tổng tiền & Nút bấm */}
          <div className="mt-8 pt-6 border-t border-slate-100 flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="text-right">
                <span className="block text-xs text-slate-500 font-bold uppercase tracking-wider">Tổng thành tiền</span>
                <span className="block text-3xl font-extrabold text-indigo-600 tracking-tighter">{vnd(total)}</span>
              </div>
            </div>
            
            <button
              type="submit"
              disabled={!guide}
              className={`w-full md:w-auto px-8 py-3.5 text-white font-bold rounded-xl shadow-lg flex items-center justify-center gap-2 transition-all transform active:scale-95 ${
                  guide
                    ? "bg-indigo-600 hover:bg-indigo-700 shadow-indigo-200" 
                    : "bg-slate-300 cursor-not-allowed"
              }`}
            >
              <CheckCircle size={20} />
              Xác nhận tạo đơn
            </button>
          </div>

        </form>
      </section>
    </div>
  );
}
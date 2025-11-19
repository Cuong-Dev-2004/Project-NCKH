import { useMemo, useState } from "react";
import DetailPresets from "../../data/Data";
import guidesList from "../../data/guides"; 
import { 
  MapPin, User, Calendar, Clock, Users, Mail, Phone, FileText, 
  CheckCircle, PlusCircle, Calculator
} from "lucide-react";

// --- DATA & HELPER ---
const TOURS = Object.values(DetailPresets)
  .map((x) => ({ id: Number(x.id), name: x.name, price: Number(x.price) }))
  .sort((a, b) => a.id - b.id);

const GUIDES = guidesList;
const LS_KEY = "bookings_admin_demo_v1";
const vnd = (n) => (Number(n || 0)).toLocaleString("vi-VN") + "đ";
const genCode = () => {
  const d = new Date();
  return `BK-${d.getFullYear()}${String(d.getMonth() + 1).padStart(2,"0")}${String(d.getDate()).padStart(2,"0")}-${Math.floor(Math.random()*9000+1000)}`;
};

// 🔥 QUAN TRỌNG: Đưa component InputField ra ngoài để không bị mất focus khi gõ
const InputField = ({ label, icon: Icon, ...props }) => (
  <div className="space-y-1.5">
    <label className="text-sm font-medium text-slate-700">{label}</label>
    <div className="relative">
      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
        <Icon size={18} />
      </div>
      <input
        {...props}
        className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-sm transition-all"
      />
    </div>
  </div>
);

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
    const tourCost = (tour?.price || 0) * form.people * form.days;
    const guideCost = (guide?.price || 0) * form.days;
    return tourCost + guideCost;
  }, [tour, guide, form.people, form.days]);

  const save = (e) => {
    e.preventDefault();
    // ... (Logic lưu giữ nguyên như cũ)
    const ok = window.confirm(`Xác nhận tạo đơn cho khách ${form.customerName}?`);
    if (!ok) return;

    const raw = localStorage.getItem(LS_KEY);
    const data = raw ? JSON.parse(raw) : [];
    const now = new Date().toISOString();

    data.push({
      _id: crypto.randomUUID(),
      code: genCode(),
      tourId: tour.id,
      tourName: tour.name,
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
      status: "pending",
      createdAt: now,
      updatedAt: now,
    });

    localStorage.setItem(LS_KEY, JSON.stringify(data));
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
        <div className="bg-gradient-to-r from-blue-600 to-indigo-700 p-6 text-white flex items-center gap-3">
          <div className="p-2 bg-white/20 rounded-lg"><PlusCircle size={24} /></div>
          <div>
            <h3 className="text-xl font-bold">Tạo Đơn Tour Nhanh</h3>
            <p className="text-blue-100 text-sm">Nhập thông tin để tạo đơn hàng mới</p>
          </div>
        </div>

        <form onSubmit={save} className="p-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* CỘT TRÁI: DỊCH VỤ */}
            <div className="space-y-5">
              <h4 className="text-sm font-bold text-slate-400 uppercase tracking-wider border-b pb-2 mb-4">Thông tin dịch vụ</h4>
              {/* ... (Giữ nguyên phần chọn Tour/HDV/Ngày) ... */}
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-slate-700">Chọn Tour</label>
                <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400"><MapPin size={18} /></div>
                    <select 
                        value={form.tourId} 
                        onChange={(e) => setForm({ ...form, tourId: Number(e.target.value) })}
                        className="w-full pl-10 pr-10 py-2.5 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none shadow-sm"
                    >
                        {TOURS.map((t) => (<option key={t.id} value={t.id}>{t.name} — {vnd(t.price)}/người/ngày</option>))}
                    </select>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-medium text-slate-700">Hướng dẫn viên</label>
                <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400"><User size={18} /></div>
                    <select 
                        value={form.guideId} 
                        onChange={(e) => setForm({ ...form, guideId: Number(e.target.value) })}
                        className="w-full pl-10 pr-10 py-2.5 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none shadow-sm"
                    >
                        {GUIDES.map((g) => (<option key={g.id} value={g.id}>{g.name} ({g.location}) — {vnd(g.price)}/ngày</option>))}
                    </select>
                </div>
                {guide && (
                  <div className="flex items-center gap-2 text-xs text-slate-500 mt-1 ml-1">
                    <span className={`w-2 h-2 rounded-full ${guide.available ? 'bg-emerald-500' : 'bg-rose-500'}`}></span>
                    {guide.available ? 'Đang rảnh' : 'Đang bận'} • {guide.language} • {guide.style}
                  </div>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <InputField label="Ngày khởi hành" icon={Calendar} type="date" value={form.checkinDate} onChange={(e) => setForm({ ...form, checkinDate: e.target.value })} />
                <InputField label="Số ngày đi" icon={Clock} type="number" min={1} value={form.days} onChange={(e) => setForm({ ...form, days: Number(e.target.value) })} />
              </div>
              
              <div className="p-4 bg-blue-50 rounded-xl border border-blue-100 text-sm text-blue-800">
                <div className="flex items-center gap-2 mb-2 font-semibold"><Calculator size={16} /> Chi tiết tạm tính:</div>
                <ul className="space-y-1 text-blue-700/80 pl-5 list-disc text-xs">
                  <li><b>Tour:</b> {vnd(tour?.price)} x {form.people} khách x {form.days} ngày = <span className="font-mono font-bold">{vnd((tour?.price || 0) * form.people * form.days)}</span></li>
                  <li><b>HDV:</b> {guide?.name} ({vnd(guide?.price)}/ngày) x {form.days} ngày = <span className="font-mono font-bold">{vnd((guide?.price || 0) * form.days)}</span></li>
                </ul>
              </div>
            </div>

            {/* CỘT PHẢI: KHÁCH HÀNG */}
            <div className="space-y-5">
              <h4 className="text-sm font-bold text-slate-400 uppercase tracking-wider border-b pb-2 mb-4">Thông tin khách hàng</h4>
              
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
                  <div className="absolute top-3 left-3 pointer-events-none text-slate-400"><FileText size={18} /></div>
                  <textarea
                    rows={3}
                    value={form.note}
                    onChange={(e) => setForm({ ...form, note: e.target.value })}
                    className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm"
                    placeholder="Yêu cầu đặc biệt..."
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="mt-8 pt-6 border-t border-slate-100 flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="text-right">
                <span className="block text-xs text-slate-500 font-medium uppercase">Tổng thành tiền (Dự kiến)</span>
                <span className="block text-3xl font-bold text-indigo-600 tracking-tight">{vnd(total)}</span>
            </div>
            <button type="submit" className="px-8 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl shadow-lg shadow-indigo-200 transition-all flex items-center justify-center gap-2">
              <CheckCircle size={20} /> Xác nhận tạo đơn
            </button>
          </div>
        </form>
      </section>
    </div>
  );
}
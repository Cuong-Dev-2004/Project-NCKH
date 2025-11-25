// src/Pages/Booking/Booking.jsx
import { useEffect, useMemo, useState } from "react";
import { 
  Search, Filter, MoreVertical, Edit3, Trash2, X, CheckCircle, 
  Clock, User, MapPin, Phone, Mail, Calendar, FileText, 
  ArrowRight, AlertCircle
} from "lucide-react";
import BookingActions from "../../components/Booking/BookingActions"; // Import component nút bấm
import DetailPresets from "../../data/Data"; // Dữ liệu Tour để lấy tên/giá gốc nếu cần

const LS_KEY = "bookings_admin_demo_v1";
const STATUS_CONFIG = {
  pending: { label: "Chờ xử lý", color: "bg-amber-50 text-amber-700 border-amber-100", icon: Clock },
  confirmed: { label: "Đã xác nhận", color: "bg-blue-50 text-blue-700 border-blue-100", icon: CheckCircle },
  completed: { label: "Hoàn thành", color: "bg-emerald-50 text-emerald-700 border-emerald-100", icon: CheckCircle },
  cancelled: { label: "Đã hủy", color: "bg-rose-50 text-rose-700 border-rose-100", icon: X },
};

const vnd = (n) => (Number(n || 0)).toLocaleString("vi-VN") + "đ";

export default function BookingPage() {
  const [data, setData] = useState([]);
  const [q, setQ] = useState("");
  const [selected, setSelected] = useState(null);
  const [toast, setToast] = useState({ open: false, type: "info", message: "" });

  // --- LOAD DỮ LIỆU ---
  const reload = () => {
    const raw = localStorage.getItem(LS_KEY);
    const arr = raw ? JSON.parse(raw) : [];
    // Sắp xếp mới nhất lên đầu
    arr.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    setData(arr);
    
    // Cập nhật lại item đang chọn nếu dữ liệu thay đổi
    if (selected) {
      const found = arr.find((x) => x._id === selected._id);
      setSelected(found || null);
    }
  };

  useEffect(() => { reload(); }, []);

  // --- FILTER ---
  const filtered = useMemo(() => {
    if (!q) return data;
    const s = q.toLowerCase();
    return data.filter(
      (b) =>
        b.code?.toLowerCase().includes(s) ||
        b.customerName?.toLowerCase().includes(s) ||
        b.phone?.includes(q)
    );
  }, [data, q]);

  // --- ACTIONS (Dùng chung cho BookingActions) ---
  const notify = (type, message) => {
    setToast({ open: true, type, message });
    setTimeout(() => setToast((t) => ({ ...t, open: false })), 3000);
  };

  const saveAll = (arr) => {
    localStorage.setItem(LS_KEY, JSON.stringify(arr));
    setData(arr);
  };

  const handleChangeStatus = (booking, status) => {
    const arr = [...data];
    const idx = arr.findIndex(x => x._id === booking._id);
    if (idx >= 0) {
      arr[idx] = { ...arr[idx], status, updatedAt: new Date().toISOString() };
      saveAll(arr);
      if (selected?._id === booking._id) setSelected(arr[idx]);
      notify("success", `Đã đổi trạng thái sang: ${STATUS_CONFIG[status].label}`);
    }
  };

  const handleRemove = (booking) => {
    if (!window.confirm(`Xoá đơn ${booking.code}?`)) return;
    const arr = data.filter(x => x._id !== booking._id);
    saveAll(arr);
    if (selected?._id === booking._id) setSelected(null);
    notify("warn", "Đã xóa đơn hàng.");
  };

  // (Tạm thời chưa làm chức năng sửa chi tiết, chỉ làm nút Sửa placeholder)
  const handleEdit = (booking) => {
    alert(`Tính năng sửa cho đơn ${booking.code} đang phát triển!`);
  };

  // --- UI COMPONENTS ---
  const Avatar = ({ name }) => (
    <div className="w-9 h-9 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center text-sm font-bold shrink-0 border border-indigo-200">
      {name ? name.charAt(0).toUpperCase() : "K"}
    </div>
  );

  const StatusBadge = ({ status }) => {
    const cfg = STATUS_CONFIG[status] || STATUS_CONFIG.pending;
    const Icon = cfg.icon;
    return (
      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${cfg.color}`}>
        <Icon size={12} /> {cfg.label}
      </span>
    );
  };

  return (
    <div className="p-6 bg-slate-50 min-h-screen font-sans text-slate-800">
      <div className="grid grid-cols-1 lg:grid-cols-[1fr,380px] gap-6 items-start max-w-[1600px] mx-auto">
        
        {/* --- CỘT TRÁI: DANH SÁCH --- */}
        <div className="space-y-4">
          {/* Header & Search */}
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4 bg-white p-4 rounded-2xl shadow-sm border border-slate-100">
            <div className="relative w-full sm:w-96">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                <Search size={18} />
              </div>
              <input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Tìm mã đơn, tên khách, SĐT..."
                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
              />
            </div>
            <div className="text-sm text-slate-500">
              <b>{filtered.length}</b> đơn hàng
            </div>
          </div>

          {/* Table */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden min-h-[600px]">
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="bg-slate-50 text-slate-600 font-medium border-b border-slate-200">
                  <tr>
                    <th className="p-4">Khách hàng</th>
                    <th className="p-4">Tour / Dịch vụ</th>
                    <th className="p-4 text-right">Tổng tiền</th>
                    <th className="p-4 text-center">Trạng thái</th>
                    <th className="p-4 w-10"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filtered.length === 0 ? (
                    <tr><td colSpan={5} className="p-10 text-center text-slate-400">Không tìm thấy đơn hàng nào</td></tr>
                  ) : (
                    filtered.map((b) => (
                      <tr
                        key={b._id}
                        onClick={() => setSelected(b)}
                        className={`group cursor-pointer transition-colors ${selected?._id === b._id ? "bg-indigo-50/60" : "hover:bg-slate-50"}`}
                      >
                        <td className="p-4">
                          <div className="flex items-center gap-3">
                            <Avatar name={b.customerName} />
                            <div>
                              <div className="font-bold text-slate-800">{b.customerName}</div>
                              <div className="text-xs text-slate-500 font-mono">{b.code}</div>
                            </div>
                          </div>
                        </td>
                        <td className="p-4">
                          <div className="font-medium text-slate-700 mb-0.5 line-clamp-1">{b.tourName}</div>
                          <div className="flex items-center gap-2 text-xs text-slate-500">
                            <Calendar size={12} /> {b.checkinDate}
                          </div>
                        </td>
                        <td className="p-4 text-right font-bold text-indigo-600">{vnd(b.total)}</td>
                        <td className="p-4 text-center"><StatusBadge status={b.status} /></td>
                        <td className="p-4 text-slate-400">
                          <ArrowRight size={16} className={`transition-transform ${selected?._id === b._id ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-2 group-hover:opacity-50'}`} />
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* --- CỘT PHẢI: CHI TIẾT (QUAN TRỌNG: HIỂN THỊ THÔNG TIN KHÁCH) --- */}
        <div className="sticky top-6">
          {selected ? (
            <div className="bg-white rounded-2xl shadow-xl border border-slate-100 overflow-hidden animate-fade-in-right">
              {/* Header Panel */}
              <div className="p-6 bg-slate-900 text-white">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-slate-400 text-[10px] uppercase font-bold tracking-widest mb-1">Chi tiết đơn hàng</p>
                    <h2 className="text-2xl font-bold font-mono">{selected.code}</h2>
                  </div>
                  <button className="p-2 bg-white/10 rounded-lg hover:bg-white/20 transition" onClick={() => setSelected(null)}>
                    <X size={18} />
                  </button>
                </div>
                <div className="mt-4 flex items-center gap-3">
                   <div className={`px-3 py-1 rounded-md text-xs font-bold uppercase tracking-wide ${STATUS_CONFIG[selected.status]?.color.replace('border', '')} bg-white text-slate-800`}>
                      {STATUS_CONFIG[selected.status]?.label}
                   </div>
                   <span className="text-xs text-slate-400">Ngày đặt: {selected.createdAt?.slice(0,10)}</span>
                </div>
              </div>

              <div className="p-6 space-y-6">
                {/* THÔNG TIN KHÁCH HÀNG (Lấy từ form thanh toán) */}
                <div>
                  <h4 className="text-xs font-bold text-slate-400 uppercase mb-3 flex items-center gap-2">
                    <User size={14} /> Khách hàng
                  </h4>
                  <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                    <div className="font-bold text-slate-800 text-lg mb-1">{selected.customerName}</div>
                    <div className="space-y-2 mt-3">
                        <div className="flex items-center gap-3 text-sm text-slate-600">
                           <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center shadow-sm border border-slate-100"><Phone size={14} className="text-emerald-500"/></div>
                           <span className="font-medium">{selected.phone || "Chưa có SĐT"}</span>
                        </div>
                        <div className="flex items-center gap-3 text-sm text-slate-600">
                           <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center shadow-sm border border-slate-100"><Mail size={14} className="text-sky-500"/></div>
                           <span className="truncate">{selected.email || "Chưa có Email"}</span>
                        </div>
                    </div>
                  </div>
                </div>

                {/* THÔNG TIN TOUR */}
                <div>
                  <h4 className="text-xs font-bold text-slate-400 uppercase mb-3 flex items-center gap-2">
                    <MapPin size={14} /> Dịch vụ
                  </h4>
                  <div className="space-y-3 text-sm border-l-2 border-slate-100 pl-4">
                    <div>
                      <div className="text-slate-500 text-xs">Tên dịch vụ</div>
                      <div className="font-bold text-slate-800">{selected.tourName}</div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <div className="text-slate-500 text-xs">Ngày đi</div>
                            <div className="font-medium">{selected.checkinDate}</div>
                        </div>
                        <div>
                            <div className="text-slate-500 text-xs">Thời lượng</div>
                            <div className="font-medium">{selected.days} ngày</div>
                        </div>
                    </div>
                    <div>
                        <div className="text-slate-500 text-xs">Số lượng khách</div>
                        <div className="font-medium">{selected.people} người</div>
                    </div>
                    {selected.note && (
                       <div className="pt-2">
                          <div className="text-slate-500 text-xs mb-1">Ghi chú từ khách:</div>
                          <div className="text-slate-700 italic bg-yellow-50 p-2 rounded border border-yellow-100 text-xs">{selected.note}</div>
                       </div>
                    )}
                  </div>
                </div>

                {/* TỔNG TIỀN */}
                <div className="pt-4 border-t border-dashed border-slate-200">
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-slate-700">Tổng thanh toán</span>
                    <span className="text-2xl font-extrabold text-indigo-600">{vnd(selected.total)}</span>
                  </div>
                </div>

                {/* NÚT THAO TÁC (Import component BookingActions) */}
                <div className="pt-2 border-t border-slate-100">
                    <p className="text-xs text-center text-slate-400 mb-3">Thao tác xử lý đơn hàng</p>
                    <BookingActions 
                        booking={selected}
                        onChangeStatus={handleChangeStatus}
                        onEdit={handleEdit}
                        onRemove={handleRemove}
                    />
                </div>

              </div>
            </div>
          ) : (
            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-10 text-center min-h-[400px] flex flex-col items-center justify-center">
              <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mb-4 text-slate-300">
                 <FileText size={40} />
              </div>
              <h3 className="text-lg font-bold text-slate-700">Chưa chọn đơn hàng</h3>
              <p className="text-slate-500 text-sm mt-2 max-w-[200px]">
                Chọn một đơn hàng từ danh sách bên trái để xem chi tiết.
              </p>
            </div>
          )}
        </div>

      </div>

      {/* Toast */}
      {toast.open && (
        <div className={`fixed top-6 right-6 z-[70] px-4 py-3 rounded-xl shadow-2xl flex items-center gap-3 animate-bounce-in text-white ${
          toast.type === 'success' ? 'bg-emerald-600' : toast.type === 'warn' ? 'bg-rose-600' : 'bg-slate-800'
        }`}>
           {toast.type === 'success' ? <CheckCircle size={18}/> : <AlertCircle size={18}/>}
           <span className="font-bold text-sm">{toast.message}</span>
        </div>
      )}
    </div>
  );
}
import { useEffect, useMemo, useState } from "react";
import DetailPresets from "../../data/Data";
import { 
  Search, 
  Filter, 
  MoreVertical, 
  Edit3, 
  Trash2, 
  X, 
  CheckCircle, 
  Clock, 
  User, 
  MapPin, 
  Phone, 
  Mail, 
  Calendar, 
  FileText, 
  CreditCard,
  AlertCircle,
  ArrowRight
} from "lucide-react";

const LS_KEY = "bookings_admin_demo_v1";
const STATUS_CONFIG = {
  pending: { label: "Chờ xử lý", color: "bg-amber-50 text-amber-700 border-amber-100", icon: Clock },
  confirmed: { label: "Đã xác nhận", color: "bg-blue-50 text-blue-700 border-blue-100", icon: CheckCircle },
  completed: { label: "Hoàn thành", color: "bg-emerald-50 text-emerald-700 border-emerald-100", icon: CheckCircle },
  cancelled: { label: "Đã hủy", color: "bg-rose-50 text-rose-700 border-rose-100", icon: X },
};

const vnd = (n) => (Number(n || 0)).toLocaleString("vi-VN") + "đ";

// Map TOUR để tra cứu nhanh giá tiền khi sửa
const TOURS = Object.values(DetailPresets).reduce((acc, t) => {
  acc[Number(t.id)] = { id: Number(t.id), name: t.name, price: Number(t.price) };
  return acc;
}, {});

export default function BookingListPage() {
  const [data, setData] = useState([]);
  const [q, setQ] = useState("");
  const [editing, setEditing] = useState(null);
  const [selected, setSelected] = useState(null);
  const [toast, setToast] = useState({ open: false, type: "info", message: "" });

  // --- LOGIC (Giữ nguyên logic cũ) ---
  const notify = (type, message) => {
    setToast({ open: true, type, message });
    setTimeout(() => setToast((t) => ({ ...t, open: false })), 3000);
  };

  const reload = () => {
    const raw = localStorage.getItem(LS_KEY);
    const arr = raw ? JSON.parse(raw) : [];
    setData(arr);
    // Cập nhật lại selected item nếu dữ liệu thay đổi
    if (selected) {
      const found = arr.find((x) => x._id === selected._id);
      setSelected(found || null);
    }
  };

  useEffect(() => { reload(); }, []);

  const filtered = useMemo(() => {
    if (!q) return data;
    const s = q.toLowerCase();
    return data.filter(
      (b) =>
        b.code?.toLowerCase().includes(s) ||
        b.tourName?.toLowerCase().includes(s) ||
        b.customerName?.toLowerCase().includes(s) ||
        b.phone?.includes(q)
    );
  }, [data, q]);

  const saveAll = (arr) => {
    localStorage.setItem(LS_KEY, JSON.stringify(arr));
    setData(arr);
  };

  const updateOne = (id, patch) => {
    const arr = [...data];
    const idx = arr.findIndex((x) => x._id === id);
    if (idx >= 0) {
      arr[idx] = { ...arr[idx], ...patch, updatedAt: new Date().toISOString() };
      saveAll(arr);
      if (selected && selected._id === id) setSelected(arr[idx]);
    }
  };

  const changeStatus = (b, s) => {
    updateOne(b._id, { status: s });
    notify("info", `Đã đổi trạng thái sang: ${STATUS_CONFIG[s].label}`);
  };

  const remove = (b) => {
    if (!window.confirm(`Xoá booking ${b.code}? Hành động này không thể hoàn tác.`)) return;
    const arr = data.filter((x) => x._id !== b._id);
    saveAll(arr);
    if (selected && selected._id === b._id) setSelected(null);
    notify("warn", "Đã xoá đơn hàng thành công.");
  };

  const openEdit = (b) => {
    const tourInfo = TOURS[b.tourId] || { price: 0, name: b.tourName };
    setEditing({
      ...b,
      tourPrice: tourInfo.price, // Lưu giá gốc để tính lại tổng tiền
    });
  };

  const saveEdit = () => {
    if (!editing) return;
    const patch = {
      customerName: editing.customerName,
      phone: editing.phone,
      email: editing.email,
      checkinDate: editing.checkinDate,
      days: Number(editing.days),
      people: Number(editing.people),
      note: editing.note,
      total: (editing.tourPrice || 0) * Number(editing.people) * Number(editing.days), // Tính lại tổng
      status: editing.status,
    };
    updateOne(editing._id, patch);
    setEditing(null);
    notify("success", "Cập nhật thông tin thành công.");
  };

  // Component Avatar nhỏ
  const Avatar = ({ name }) => (
    <div className="w-9 h-9 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center text-sm font-bold shrink-0">
      {name ? name.charAt(0).toUpperCase() : "K"}
    </div>
  );

  // Component Badge Trạng thái
  const StatusBadge = ({ status }) => {
    const cfg = STATUS_CONFIG[status] || STATUS_CONFIG.pending;
    const Icon = cfg.icon;
    return (
      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${cfg.color}`}>
        <Icon size={12} />
        {cfg.label}
      </span>
    );
  };

  return (
    <div className="p-6 bg-slate-50 min-h-screen">
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
                placeholder="Tìm theo mã, tên khách, SĐT..."
                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
              />
            </div>
            <div className="text-sm text-slate-500 flex gap-4">
              <span><b>{filtered.length}</b> Tour</span>
            </div>
          </div>

          {/* Table Card */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden min-h-[600px]">
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="bg-slate-50 text-slate-600 font-medium border-b border-slate-200">
                  <tr>
                    <th className="p-4">Khách hàng</th>
                    <th className="p-4">Tour & Thời gian</th>
                    <th className="p-4 text-right">Tổng tiền</th>
                    <th className="p-4 text-center">Trạng thái</th>
                    <th className="p-4 w-10"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filtered.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="p-10 text-center text-slate-400">
                        <div className="flex flex-col items-center gap-2">
                          <Search size={32} className="opacity-20" />
                          <p>Không tìm thấy tour nao</p>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    filtered.map((b) => (
                      <tr
                        key={b._id}
                        onClick={() => setSelected(b)}
                        className={`group cursor-pointer transition-colors ${
                          selected?._id === b._id ? "bg-indigo-50/60" : "hover:bg-slate-50"
                        }`}
                      >
                        <td className="p-4">
                          <div className="flex items-center gap-3">
                            <Avatar name={b.customerName} />
                            <div>
                              <div className="font-semibold text-slate-800">{b.customerName}</div>
                              <div className="text-xs text-slate-500 font-mono">{b.code}</div>
                            </div>
                          </div>
                        </td>
                        <td className="p-4">
                          <div className="font-medium text-slate-700 mb-0.5">{b.tourName}</div>
                          <div className="flex items-center gap-2 text-xs text-slate-500">
                            <Calendar size={12} /> {b.checkinDate}
                            <span>•</span>
                            <Clock size={12} /> {b.days} ngày
                          </div>
                        </td>
                        <td className="p-4 text-right font-bold text-indigo-600">
                          {vnd(b.total)}
                        </td>
                        <td className="p-4 text-center">
                          <StatusBadge status={b.status} />
                        </td>
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

        {/* --- CỘT PHẢI: CHI TIẾT (STICKY) --- */}
        <div className="sticky top-6">
          {selected ? (
            <div className="bg-white rounded-2xl shadow-xl border border-slate-100 overflow-hidden">
              {/* Header Panel */}
              <div className="p-6 bg-gradient-to-br from-indigo-600 to-blue-700 text-white">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-indigo-100 text-xs uppercase font-bold tracking-wider mb-1">Chi tiết tour của khách hàng </p>
                    <h2 className="text-2xl font-bold">{selected.code}</h2>
                  </div>
                  <div className="p-2 bg-white/10 rounded-lg backdrop-blur-sm cursor-pointer hover:bg-white/20 transition-colors" onClick={() => setSelected(null)}>
                    <X size={18} />
                  </div>
                </div>
                <div className="mt-6 flex items-center gap-3">
                   <div className="px-3 py-1 rounded-lg bg-white/20 backdrop-blur text-sm font-medium flex items-center gap-2">
                      {STATUS_CONFIG[selected.status]?.label}
                   </div>
                   <span className="text-xs text-indigo-200">{selected.createdAt?.slice(0,10)}</span>
                </div>
              </div>

              {/* Body Content */}
              <div className="p-6 space-y-6">
                
                {/* Thông tin khách */}
                <div>
                  <h4 className="text-xs font-bold text-slate-400 uppercase mb-3 flex items-center gap-2">
                    <User size={14} /> Khách hàng
                  </h4>
                  <div className="bg-slate-50 p-4 rounded-xl space-y-3 border border-slate-100">
                    <div className="font-semibold text-slate-800 text-lg">{selected.customerName}</div>
                    <div className="flex items-center gap-2 text-sm text-slate-600">
                      <Phone size={14} className="text-slate-400" /> {selected.phone || "Không có SĐT"}
                    </div>
                    {selected.email && (
                      <div className="flex items-center gap-2 text-sm text-slate-600">
                        <Mail size={14} className="text-slate-400" /> {selected.email}
                      </div>
                    )}
                  </div>
                </div>

                {/* Thông tin Tour */}
                <div>
                  <h4 className="text-xs font-bold text-slate-400 uppercase mb-3 flex items-center gap-2">
                    <MapPin size={14} /> Dịch vụ Tour
                  </h4>
                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between">
                      <span className="text-slate-500">Tour:</span>
                      <span className="font-medium text-slate-800 text-right w-2/3">{selected.tourName}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Ngày đi:</span>
                      <span className="font-medium text-slate-800">{selected.checkinDate}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Thời lượng:</span>
                      <span className="font-medium text-slate-800">{selected.days} ngày</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Số khách:</span>
                      <span className="font-medium text-slate-800">{selected.people} người</span>
                    </div>
                    {selected.note && (
                       <div className="pt-2 border-t border-slate-100 mt-2">
                          <span className="text-slate-500 block mb-1 text-xs">Ghi chú:</span>
                          <p className="text-slate-700 italic bg-amber-50 p-2 rounded border border-amber-100">{selected.note}</p>
                       </div>
                    )}
                  </div>
                </div>

                {/* Tổng tiền */}
                <div className="pt-4 border-t border-dashed border-slate-200">
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-slate-700">Tổng thanh toán</span>
                    <span className="text-xl font-bold text-indigo-600">{vnd(selected.total)}</span>
                  </div>
                </div>

                {/* Actions Buttons */}
                <div className="grid grid-cols-2 gap-3 pt-2">
                  <button 
                    onClick={() => openEdit(selected)}
                    className="flex items-center justify-center gap-2 px-4 py-2.5 bg-white border border-slate-200 text-slate-700 font-medium rounded-xl hover:bg-slate-50 hover:border-slate-300 transition-all"
                  >
                    <Edit3 size={16} /> Sửa
                  </button>
                  <button 
                    onClick={() => remove(selected)}
                    className="flex items-center justify-center gap-2 px-4 py-2.5 bg-white border border-rose-100 text-rose-600 font-medium rounded-xl hover:bg-rose-50 hover:border-rose-200 transition-all"
                  >
                    <Trash2 size={16} /> Xóa
                  </button>
                </div>
                
                {/* Status Actions */}
                <div className="space-y-2 pt-2">
                   <p className="text-xs text-center text-slate-400">Cập nhật trạng thái tour</p>
                   <div className="flex justify-center gap-2">
                      {Object.keys(STATUS_CONFIG).map(status => (
                        <button
                          key={status}
                          onClick={() => changeStatus(selected, status)}
                          className={`w-8 h-8 rounded-full flex items-center justify-center transition-transform hover:scale-110 ${
                             selected.status === status ? 'ring-2 ring-offset-2 ring-indigo-500' : 'opacity-50 hover:opacity-100'
                          } ${STATUS_CONFIG[status].color}`}
                          title={STATUS_CONFIG[status].label}
                        >
                          {(() => {
                             const I = STATUS_CONFIG[status].icon;
                             return <I size={14} />;
                          })()}
                        </button>
                      ))}
                   </div>
                </div>

              </div>
            </div>
          ) : (
            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-10 text-center min-h-[400px] flex flex-col items-center justify-center">
              <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mb-4 text-slate-300">
                 <FileText size={40} />
              </div>
              <h3 className="text-lg font-medium text-slate-700">Chưa chọn tour</h3>
              <p className="text-slate-500 text-sm mt-2 max-w-[200px]">
                Chọn một đơn hàng từ danh sách bên trái để xem chi tiết và thao tác.
              </p>
            </div>
          )}
        </div>

      </div>

      {/* --- MODAL EDIT (Style mới) --- */}
      {editing && (
        <div className="fixed inset-0 z-[60] bg-black/40 backdrop-blur-sm flex items-center justify-center p-4" onClick={() => setEditing(null)}>
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden" onClick={(e) => e.stopPropagation()}>
            <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
              <h3 className="font-bold text-lg text-slate-700">Cập nhật đơn hàng</h3>
              <button onClick={() => setEditing(null)} className="text-slate-400 hover:text-slate-600"><X size={20} /></button>
            </div>
            
            <div className="p-6 space-y-4 max-h-[80vh] overflow-y-auto">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-500 uppercase">Tên khách</label>
                  <input 
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                    value={editing.customerName} 
                    onChange={e => setEditing({...editing, customerName: e.target.value})}
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-500 uppercase">Số điện thoại</label>
                  <input 
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                    value={editing.phone} 
                    onChange={e => setEditing({...editing, phone: e.target.value})}
                  />
                </div>
              </div>

              <div className="space-y-1">
                 <label className="text-xs font-bold text-slate-500 uppercase">Email</label>
                 <input 
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                    value={editing.email} 
                    onChange={e => setEditing({...editing, email: e.target.value})}
                  />
              </div>

              <div className="grid grid-cols-3 gap-4">
                 <div className="col-span-1 space-y-1">
                    <label className="text-xs font-bold text-slate-500 uppercase">Ngày đi</label>
                    <input type="date"
                      className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                      value={editing.checkinDate} 
                      onChange={e => setEditing({...editing, checkinDate: e.target.value})}
                    />
                 </div>
                 <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-500 uppercase">Số ngày</label>
                    <input type="number" min={1}
                      className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                      value={editing.days} 
                      onChange={e => setEditing({...editing, days: e.target.value})}
                    />
                 </div>
                 <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-500 uppercase">Số khách</label>
                    <input type="number" min={1}
                      className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                      value={editing.people} 
                      onChange={e => setEditing({...editing, people: e.target.value})}
                    />
                 </div>
              </div>
              
              <div className="space-y-1">
                 <label className="text-xs font-bold text-slate-500 uppercase">Ghi chú</label>
                 <textarea rows={2}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                    value={editing.note} 
                    onChange={e => setEditing({...editing, note: e.target.value})}
                  />
              </div>
            </div>

            <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex justify-end gap-3">
               <button onClick={() => setEditing(null)} className="px-4 py-2 text-slate-600 text-sm font-medium hover:bg-slate-200 rounded-lg transition-colors">Hủy</button>
               <button onClick={saveEdit} className="px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-200">Lưu thay đổi</button>
            </div>
          </div>
        </div>
      )}

      {/* Toast Notification */}
      {toast.open && (
        <div className={`fixed top-6 right-6 z-[70] px-4 py-3 rounded-xl shadow-2xl flex items-center gap-3 animate-fade-in-down text-white ${
          toast.type === 'success' ? 'bg-emerald-600' : toast.type === 'warn' ? 'bg-rose-600' : 'bg-slate-800'
        }`}>
           {toast.type === 'success' ? <CheckCircle size={18}/> : <AlertCircle size={18}/>}
           <span className="font-medium text-sm">{toast.message}</span>
        </div>
      )}
    </div>
  );
}
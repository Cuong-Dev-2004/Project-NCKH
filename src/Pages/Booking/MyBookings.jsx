// src/Pages/Booking/MyBookings.jsx
import { useEffect, useMemo, useState } from "react";
import { useAuth } from "../../utils/authContext"; // ✅ Import AuthContext để lấy user
import { Search, Calendar, User, MapPin, FileText, AlertCircle } from "lucide-react";

const LS_KEY = "bookings_admin_demo_v1";
const vnd = (n) => (Number(n || 0)).toLocaleString("vi-VN") + "đ";

const STATUS_CONFIG = {
  pending: { label: "Chờ xử lý", color: "bg-amber-50 text-amber-700 border-amber-100" },
  confirmed: { label: "Đã xác nhận", color: "bg-sky-50 text-sky-700 border-sky-100" },
  completed: { label: "Hoàn tất", color: "bg-emerald-50 text-emerald-700 border-emerald-100" },
  cancelled: { label: "Đã hủy", color: "bg-rose-50 text-rose-700 border-rose-100" },
};

export default function MyBookingsPage() {
  const { user } = useAuth(); // Lấy thông tin user đang đăng nhập
  const [allBookings, setAllBookings] = useState([]);

  // Load dữ liệu đơn hàng từ LocalStorage
  useEffect(() => {
    const raw = localStorage.getItem(LS_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      // Sắp xếp mới nhất lên đầu
      parsed.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      setAllBookings(parsed);
    }
  }, []);

  // 🔥 LỌC ĐƠN HÀNG THEO USER ĐANG ĐĂNG NHẬP
  const myBookings = useMemo(() => {
    if (!user) return [];
    
    // Lọc theo Email (Ưu tiên) hoặc Số điện thoại (nếu có trong user object)
    // Lưu ý: Cần chuẩn hóa về chữ thường để so sánh chính xác
    const userEmail = user.email ? user.email.toLowerCase().trim() : "";
    
    return allBookings.filter(b => {
       const bookingEmail = b.email ? b.email.toLowerCase().trim() : "";
       // So sánh email
       return bookingEmail === userEmail;
    });
  }, [allBookings, user]);

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
         <p className="text-slate-500">Vui lòng đăng nhập để xem đơn hàng của bạn.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-800 py-10 px-4">
      <div className="max-w-4xl mx-auto">
        
        <div className="mb-8 text-center">
           <h1 className="text-3xl font-extrabold text-slate-900 mb-2">Đơn hàng của tôi</h1>
           <p className="text-slate-500 text-sm">Xin chào, <span className="font-bold text-indigo-600">{user.name}</span> ({user.email})</p>
        </div>

        {/* Danh sách đơn hàng */}
        {myBookings.length === 0 ? (
           <div className="bg-white p-10 rounded-2xl shadow-sm border border-slate-200 text-center">
              <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-400">
                 <FileText size={32}/>
              </div>
              <h3 className="font-bold text-lg text-slate-700">Chưa có đơn hàng nào</h3>
              <p className="text-slate-500 text-sm mt-1">Bạn chưa đặt tour nào với email này.</p>
           </div>
        ) : (
           <div className="space-y-6">
              {myBookings.map((b) => (
                 <div key={b._id} className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden hover:shadow-md transition-shadow">
                    
                    {/* Header Card */}
                    <div className="bg-slate-50/50 p-4 border-b border-slate-100 flex flex-wrap justify-between items-center gap-3">
                       <div>
                          <span className="text-xs text-slate-400 font-bold uppercase tracking-wider mr-2">Mã đơn:</span>
                          <span className="font-mono font-bold text-slate-700">{b.code}</span>
                       </div>
                       <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide border ${STATUS_CONFIG[b.status]?.color || "bg-gray-100 text-gray-600"}`}>
                          {STATUS_CONFIG[b.status]?.label || b.status}
                       </span>
                    </div>

                    {/* Body Card */}
                    <div className="p-5 grid md:grid-cols-2 gap-6">
                       {/* Cột Trái: Thông tin Tour */}
                       <div>
                          <h4 className="font-bold text-lg text-slate-800 mb-1">{b.tourName}</h4>
                          <div className="text-xs text-slate-500 mb-3">
                             {b.guideName && <span className="block mt-1">HDV: <span className="font-semibold text-indigo-600">{b.guideName}</span></span>}
                          </div>

                          <div className="space-y-2 text-sm text-slate-600">
                             <div className="flex items-center gap-2">
                                <Calendar size={16} className="text-slate-400"/> 
                                <span>Ngày đi: <b>{b.checkinDate}</b></span>
                             </div>
                             <div className="flex items-center gap-2">
                                <User size={16} className="text-slate-400"/> 
                                <span>Số khách: <b>{b.people}</b></span>
                             </div>
                             <div className="flex items-center gap-2">
                                <MapPin size={16} className="text-slate-400"/> 
                                <span>Thời lượng: <b>{b.days} ngày</b></span>
                             </div>
                          </div>
                       </div>

                       {/* Cột Phải: Thông tin Thanh toán & Ghi chú */}
                       <div className="flex flex-col justify-between border-l border-slate-100 pl-6 md:pl-6 md:border-l-0 md:border-t-0 border-t pt-4 md:pt-0">
                          <div>
                             <div className="text-xs font-bold text-slate-400 uppercase mb-1">Thông tin liên hệ</div>
                             <p className="text-sm font-semibold text-slate-800">{b.customerName}</p>
                             <p className="text-xs text-slate-500">{b.phone}</p>
                          </div>

                          <div className="mt-4">
                             <div className="flex justify-between items-end">
                                <div>
                                   <div className="text-xs text-slate-400 mb-1">Tổng tiền</div>
                                   <div className="text-xl font-extrabold text-indigo-600">{vnd(b.total)}</div>
                                </div>
                                {b.note && (
                                   <div className="text-xs text-slate-500 max-w-[150px] truncate text-right" title={b.note}>
                                      Note: {b.note}
                                   </div>
                                )}
                             </div>
                          </div>
                       </div>
                    </div>
                 </div>
              ))}
           </div>
        )}
      </div>
    </div>
  );
}
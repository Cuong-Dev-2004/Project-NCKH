// src/components/Booking/BookingTable.jsx
import React from "react";
import BookingActions from "./BookingActions";
import { 
  Clock, CheckCircle, X, AlertCircle, Calendar, ArrowRight 
} from "lucide-react";

const vnd = (n) => (Number(n || 0)).toLocaleString("vi-VN") + "đ";

const STATUS_CONFIG = {
  pending: { label: "Chờ xử lý", color: "bg-amber-50 text-amber-700 border border-amber-100", icon: Clock },
  confirmed: { label: "Đã xác nhận", color: "bg-blue-50 text-blue-700 border border-blue-100", icon: CheckCircle },
  completed: { label: "Hoàn thành", color: "bg-emerald-50 text-emerald-700 border border-emerald-100", icon: CheckCircle },
  cancelled: { label: "Đã hủy", color: "bg-rose-50 text-rose-700 border border-rose-100", icon: X },
};

// Component Avatar nhỏ
const Avatar = ({ name }) => (
  <div className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center text-xs font-bold shrink-0 border border-indigo-200">
    {name ? name.charAt(0).toUpperCase() : "K"}
  </div>
);

// Component Badge Trạng thái
const StatusBadge = ({ status }) => {
  const cfg = STATUS_CONFIG[status] || STATUS_CONFIG.pending;
  const Icon = cfg.icon;
  return (
    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-xs font-medium ${cfg.color}`}>
      <Icon size={10} /> {cfg.label}
    </span>
  );
};

export default function BookingTable({
  rows = [],
  onChangeStatus,
  onEdit,
  onRemove,
  onSelect // Thêm prop để click vào dòng
}) {
  return (
    <div className="rounded-2xl overflow-hidden bg-white shadow-sm border border-slate-100">
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left">
          <thead className="bg-slate-50 text-slate-600 font-medium border-b border-slate-200">
            <tr>
              <th className="p-4">Mã Đơn</th>
              <th className="p-4">Khách Hàng</th>
              <th className="p-4">Dịch Vụ</th>
              <th className="p-4">Lịch Trình</th>
              <th className="p-4 text-right">Tổng Tiền</th>
              <th className="p-4 text-center">Trạng Thái</th>
              <th className="p-4 text-right">Hành Động</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {rows.length === 0 ? (
              <tr>
                <td className="p-10 text-center text-slate-400" colSpan={7}>
                  <div className="flex flex-col items-center gap-2">
                    <AlertCircle size={32} className="opacity-20" />
                    <span>Chưa có đơn hàng nào</span>
                  </div>
                </td>
              </tr>
            ) : (
              rows.map((b) => (
                <tr 
                  key={b._id} 
                  className="hover:bg-slate-50/80 transition-colors cursor-pointer group"
                  onClick={() => onSelect && onSelect(b)} // Click vào dòng để xem chi tiết (nếu có prop)
                >
                  <td className="p-4 font-mono text-xs font-semibold text-slate-500">
                    {b.code}
                  </td>
                  
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <Avatar name={b.customerName} />
                      <div>
                        <div className="font-semibold text-slate-800">{b.customerName}</div>
                        <div className="text-xs text-slate-500">{b.phone || "---"}</div>
                      </div>
                    </div>
                  </td>

                  <td className="p-4">
                    <div className="font-medium text-slate-700 max-w-[200px] truncate" title={b.tourName}>
                      {b.tourName}
                    </div>
                    <div className="text-xs text-slate-400 mt-0.5">ID: {b.tourId}</div>
                  </td>

                  <td className="p-4">
                    <div className="flex items-center gap-1.5 text-slate-600">
                       <Calendar size={14} className="text-slate-400"/>
                       <span>{b.checkinDate}</span>
                    </div>
                    <div className="text-xs text-slate-400 mt-0.5 pl-5">
                       {b.days} ngày • {b.people} khách
                    </div>
                  </td>

                  <td className="p-4 text-right font-bold text-indigo-600">
                    {vnd(b.total)}
                  </td>

                  <td className="p-4 text-center">
                    <StatusBadge status={b.status} />
                  </td>

                  <td className="p-4 text-right" onClick={(e) => e.stopPropagation()}>
                    <BookingActions
                      booking={b}
                      onChangeStatus={onChangeStatus}
                      onEdit={onEdit}
                      onRemove={onRemove}
                    />
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
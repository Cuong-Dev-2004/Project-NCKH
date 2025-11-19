// src/components/Booking/BookingActions.jsx
import React from "react";
import { Check, CheckCircle2, XCircle, Edit, Trash2, Ban } from "lucide-react";

export default function BookingActions({ booking, onChangeStatus, onEdit, onRemove }) {
  return (
    <div className="flex items-center gap-2 justify-end flex-wrap">
      
      {/* Nút Xác nhận (Hiện khi đơn chưa xác nhận & chưa hoàn thành) */}
      {booking.status !== "confirmed" && booking.status !== "completed" && booking.status !== "cancelled" && (
        <button
          onClick={() => onChangeStatus(booking, "confirmed")}
          className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium bg-sky-100 text-sky-700 hover:bg-sky-200 transition-colors"
          title="Xác nhận đơn này"
        >
          <Check size={14} /> Xác nhận
        </button>
      )}

      {/* Nút Hoàn tất (Chỉ hiện khi đã Xác nhận) */}
      {booking.status === "confirmed" && (
        <button
          onClick={() => onChangeStatus(booking, "completed")}
          className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium bg-emerald-100 text-emerald-700 hover:bg-emerald-200 transition-colors"
          title="Đánh dấu đã hoàn thành tour"
        >
          <CheckCircle2 size={14} /> Hoàn tất
        </button>
      )}

      {/* Nút Hủy (Hiện khi đơn chưa Hủy và chưa Hoàn thành) */}
      {booking.status !== "cancelled" && booking.status !== "completed" && (
        <button
          onClick={() => onChangeStatus(booking, "cancelled")}
          className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium bg-rose-100 text-rose-700 hover:bg-rose-200 transition-colors"
          title="Hủy đơn hàng này"
        >
          <Ban size={14} /> Huỷ
        </button>
      )}

      {/* Nút Sửa */}
      <button
        onClick={() => onEdit(booking)}
        className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium bg-indigo-50 text-indigo-600 hover:bg-indigo-100 transition-colors"
        title="Sửa thông tin"
      >
        <Edit size={14} /> Sửa
      </button>

      {/* Nút Xóa */}
      <button
        onClick={() => onRemove(booking)}
        className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium bg-gray-100 text-gray-600 hover:bg-gray-200 hover:text-rose-600 transition-colors"
        title="Xóa vĩnh viễn"
      >
        <Trash2 size={14} />
      </button>
    </div>
  );
}
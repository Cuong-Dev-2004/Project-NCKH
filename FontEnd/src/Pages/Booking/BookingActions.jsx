// src/components/Booking/BookingActions.jsx
import React from "react";

export default function BookingActions({ booking, onChangeStatus, onEdit, onRemove }) {
  return (
    <div className="flex items-center gap-2 justify-end">
      {booking.status !== "confirmed" && booking.status !== "completed" && (
        <button
          onClick={() => onChangeStatus(booking, "confirmed")}
          className="px-2 py-1 rounded-lg text-xs bg-sky-50 hover:bg-sky-100"
        >
          Xác nhận
        </button>
      )}

      {booking.status === "confirmed" && (
        <button
          onClick={() => onChangeStatus(booking, "completed")}
          className="px-2 py-1 rounded-lg text-xs bg-emerald-50 hover:bg-emerald-100"
        >
          Hoàn tất
        </button>
      )}

      {booking.status !== "cancelled" && (
        <button
          onClick={() => onChangeStatus(booking, "cancelled")}
          className="px-2 py-1 rounded-lg text-xs bg-rose-50 hover:bg-rose-100"
        >
          Huỷ
        </button>
      )}

      <button
        onClick={() => onEdit(booking)}
        className="px-2 py-1 rounded-lg text-xs bg-indigo-50 hover:bg-indigo-100"
      >
        Sửa
      </button>

      <button
        onClick={() => onRemove(booking)}
        className="px-2 py-1 rounded-lg text-xs text-rose-700 bg-rose-50 hover:bg-rose-100"
      >
        Xoá
      </button>
    </div>
  );
}

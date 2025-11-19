// src/components/Booking/BookingTable.jsx
import React from "react";
import BookingActions from "./BookingActions";

const vnd = (n) => (Number(n || 0)).toLocaleString("vi-VN") + "đ";

export default function BookingTable({
  rows = [],
  onChangeStatus,
  onEdit,
  onRemove,
}) {
  return (
    <div className="rounded-2xl overflow-hidden bg-white shadow-2xl ring-1 ring-black/5">
      <table className="w-full text-sm">
        <thead className="bg-gradient-to-r from-sky-100 to-indigo-100">
          <tr className="text-left text-gray-700">
            <th className="p-3">Mã</th>
            <th className="p-3">Tour</th>
            <th className="p-3">Khách</th>
            <th className="p-3">Ngày</th>
            <th className="p-3 text-right">Tổng</th>
            <th className="p-3">Trạng thái</th>
            <th className="p-3 text-right">Thao tác</th>
          </tr>
        </thead>
        <tbody>
          {rows.length === 0 ? (
            <tr>
              <td className="p-6 text-center" colSpan={7}>
                Chưa có đơn phù hợp
              </td>
            </tr>
          ) : (
            rows.map((b) => (
              <tr key={b._id} className="hover:bg-sky-50/60">
                <td className="p-3 font-mono text-xs">{b.code}</td>
                <td className="p-3">
                  <div className="font-semibold">{b.tourName}</div>
                  <div className="text-gray-500">#{b.tourId}</div>
                </td>
                <td className="p-3">
                  <div className="font-medium">{b.customerName}</div>
                  <div className="text-gray-500 text-xs">
                    {b.phone}
                    {b.email ? ` · ${b.email}` : ""}
                  </div>
                </td>
                <td className="p-3">
                  {b.checkinDate} ({b.days} ngày)
                  <div className="text-gray-500 text-xs">{b.people} khách</div>
                </td>
                <td className="p-3 text-right font-semibold text-indigo-700">
                  {vnd(b.total)}
                </td>
                <td className="p-3">
                  <span
                    className={`px-2 py-1 rounded-full text-xs capitalize shadow ${
                      b.status === "pending"
                        ? "bg-amber-100 text-amber-700"
                        : b.status === "confirmed"
                        ? "bg-sky-100 text-sky-700"
                        : b.status === "completed"
                        ? "bg-emerald-100 text-emerald-700"
                        : "bg-rose-100 text-rose-700"
                    }`}
                  >
                    {b.status}
                  </span>
                </td>
                <td className="p-3">
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
  );
}

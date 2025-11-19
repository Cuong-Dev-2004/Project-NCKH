import DetailPresets from "../../data/Data";
import { vnd } from "../../data/booking.api";

// Bảng giá tour hiện tại
const TOURS = Object.values(DetailPresets).reduce((acc, t) => {
  acc[Number(t.id)] = { id: Number(t.id), name: t.name, price: Number(t.price) };
  return acc;
}, {});
const STATUS = ["pending", "confirmed", "completed", "cancelled"];

const calcTotal = (tourId, people, days) => {
  const price = TOURS[tourId]?.price || 0;
  return Number(price) * Number(people) * Number(days);
};

export default function EditBookingModal({ value, onChange, onClose, onSave }) {
  if (!value) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/30 flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between p-4 bg-gradient-to-r from-sky-600 to-indigo-700 text-white rounded-t-2xl">
          <h3 className="text-lg font-semibold">Sửa đơn: {value.code}</h3>
          <button onClick={onClose} className="p-2 hover:opacity-80">✕</button>
        </div>

        <div className="p-4 grid grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium">Tên khách</label>
            <input className="w-full rounded-xl px-3 py-2 bg-gray-50 focus:bg-white shadow-inner focus:outline-none focus:ring-2 focus:ring-sky-200"
              value={value.customerName}
              onChange={(e) => onChange({ ...value, customerName: e.target.value })}/>
          </div>
          <div>
            <label className="text-sm font-medium">SĐT</label>
            <input className="w-full rounded-xl px-3 py-2 bg-gray-50 focus:bg-white shadow-inner focus:outline-none focus:ring-2 focus:ring-sky-200"
              value={value.phone}
              onChange={(e) => onChange({ ...value, phone: e.target.value })}/>
          </div>
          <div>
            <label className="text-sm font-medium">Email</label>
            <input className="w-full rounded-xl px-3 py-2 bg-gray-50 focus:bg-white shadow-inner focus:outline-none focus:ring-2 focus:ring-sky-200"
              value={value.email || ""}
              onChange={(e) => onChange({ ...value, email: e.target.value })}/>
          </div>
          <div>
            <label className="text-sm font-medium">Ngày check-in</label>
            <input type="date" className="w-full rounded-xl px-3 py-2 bg-gray-50 focus:bg-white shadow-inner focus:outline-none focus:ring-2 focus:ring-sky-200"
              value={value.checkinDate}
              onChange={(e) => onChange({ ...value, checkinDate: e.target.value })}/>
          </div>
          <div>
            <label className="text-sm font-medium">Số ngày</label>
            <input type="number" min={1} className="w-full rounded-xl px-3 py-2 bg-gray-50 focus:bg-white shadow-inner focus:outline-none focus:ring-2 focus:ring-sky-200"
              value={value.days}
              onChange={(e) => {
                const days = Number(e.target.value);
                onChange({ ...value, days, total: calcTotal(value.tourId, value.people, days) });
              }}/>
          </div>
          <div>
            <label className="text-sm font-medium">Số khách</label>
            <input type="number" min={1} className="w-full rounded-xl px-3 py-2 bg-gray-50 focus:bg-white shadow-inner focus:outline-none focus:ring-2 focus:ring-sky-200"
              value={value.people}
              onChange={(e) => {
                const people = Number(e.target.value);
                onChange({ ...value, people, total: calcTotal(value.tourId, people, value.days) });
              }}/>
          </div>
          <div className="col-span-2">
            <label className="text-sm font-medium">Ghi chú</label>
            <textarea rows={2} className="w-full rounded-xl px-3 py-2 bg-gray-50 focus:bg-white shadow-inner focus:outline-none focus:ring-2 focus:ring-sky-200"
              value={value.note || ""}
              onChange={(e) => onChange({ ...value, note: e.target.value })}/>
          </div>
        </div>

        <div className="p-4 flex items-center justify-between">
          <div className="text-sm text-gray-700">Tổng tiền: <b className="text-indigo-700">{vnd(value.total)}</b></div>
          <div className="flex items-center gap-2">
            <select value={value.status}
              onChange={(e) => onChange({ ...value, status: e.target.value })}
              className="rounded-xl px-3 py-2 bg-gray-50 focus:bg-white shadow-inner focus:outline-none focus:ring-2 focus:ring-sky-200 text-sm">
              {STATUS.map((s) => <option key={s} value={s}>{s}</option>)}
            </select>
            <button onClick={onSave} className="px-4 py-2 rounded-xl font-medium text-white bg-gradient-to-r from-sky-500 to-indigo-600 shadow hover:brightness-110">
              Lưu
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

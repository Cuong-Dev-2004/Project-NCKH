// src/components/Toast/Toast.jsx
export default function Toast({ open, type = "info", message = "", onClose }) {
  if (!open) return null;
  const map = {
    success: { cls: "bg-emerald-600", label: "Thành công" },
    warn: { cls: "bg-amber-500", label: "Cảnh báo" },
    info: { cls: "bg-sky-600", label: "Thông báo" },
  };
  const { cls, label } = map[type] || map.info;

  return (
    <div className="fixed top-4 right-4 z-[60]">
      <div className="text-white shadow-2xl rounded-2xl overflow-hidden ring-1 ring-black/10">
        <div className={`${cls} px-4 py-2 font-semibold`}>{label}</div>
        <div className="px-4 py-3 bg-white text-gray-800 min-w-[260px]">
          <div className="text-sm">{message}</div>
          <div className="mt-3 flex justify-end">
            <button
              onClick={onClose}
              className="px-3 py-1.5 rounded-lg text-sm bg-gray-100 hover:bg-gray-200"
            >
              Đóng
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

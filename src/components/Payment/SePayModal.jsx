import { useEffect, useState } from "react";

const BANK_CODE  = import.meta.env.VITE_VIETQR_BANK    || "MB";
const ACCOUNT_NO = import.meta.env.VITE_VIETQR_ACCOUNT || "0107200322222";
const ACCOUNT_NM = import.meta.env.VITE_VIETQR_NAME    || "VO TRAN TAN PHU";

function vietQRImageURL({ bank, account, amount, content, accountName }) {
  const params = new URLSearchParams({
    amount: String(amount || 0),
    addInfo: content || "",
    accountName: accountName || "",
  });
  return `https://img.vietqr.io/image/${bank}-${account}-qr_only.png?${params.toString()}`;
}

export default function SePayModal({
  open,
  amount,
  orderId,
  onClose,
  onSuccess,
  onError,
  sepayQrImage,
  onPaidConfirm,
  initialName = "",
  initialPhone = "",
  initialEmail = ""
}) {
  const [err, setErr] = useState("");
  const [vietqrUrl, setVietqrUrl] = useState("");
  const usingSePay = !!sepayQrImage;

  // State lưu thông tin khách hàng
  const [customerName, setCustomerName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");

  // Điền sẵn dữ liệu nếu có
  useEffect(() => {
    if (open) {
      setCustomerName(initialName || "");
      setPhone(initialPhone || "");
      setEmail(initialEmail || "");
    }
  }, [open, initialName, initialPhone, initialEmail]);

  useEffect(() => {
    if (!open) return;
    if (!amount || amount <= 0) {
      setErr("Số tiền không hợp lệ.");
      return;
    }
    // Tạo QR
    const url = vietQRImageURL({
      bank: BANK_CODE,
      account: ACCOUNT_NO,
      accountName: ACCOUNT_NM,
      amount,
      content: orderId,
    });
    setVietqrUrl(url);
    setErr("");
  }, [open, amount, orderId]);

  if (!open) return null;

  const moneyFmt = (n) => Number(n).toLocaleString("vi-VN") + " đ";

  // Xử lý khi bấm nút xác nhận
  const handleConfirm = () => {
    if (!customerName.trim()) {
      alert("Vui lòng nhập Họ và tên người chuyển khoản!");
      return;
    }
    if (!phone.trim()) {
      alert("Vui lòng nhập Số điện thoại liên hệ!");
      return;
    }

    // Gửi dữ liệu ra ngoài
    onPaidConfirm({
      customerName: customerName, // Key quan trọng
      phone: phone,
      email: email,
      orderId,
      amount
    });
  };

  return (
    <div className="fixed inset-0 z-[999] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative z-10 w-full max-w-lg rounded-2xl bg-white shadow-2xl p-6 space-y-5 max-h-[90vh] overflow-y-auto">
        
        <div className="text-center">
          <h3 className="text-2xl font-bold text-gray-800">Thanh toán đơn hàng</h3>
          <p className="text-sm text-gray-500">Mã đơn: <span className="font-mono font-bold text-indigo-600">{orderId}</span></p>
        </div>

        <div className="flex justify-center">
            <div className="p-2 border-2 border-indigo-100 rounded-xl shadow-sm">
                <img src={usingSePay ? sepayQrImage : vietqrUrl} className="w-48 h-48 object-contain rounded-lg" alt="QR Code" />
            </div>
        </div>

        <div className="text-center">
            <p className="text-gray-500 text-sm">Số tiền cần thanh toán</p>
            <p className="text-3xl font-extrabold text-indigo-600">{moneyFmt(amount)}</p>
        </div>

        {/* FORM NHẬP THÔNG TIN */}
        <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 space-y-3">
            <h4 className="font-bold text-gray-700 text-sm uppercase">Thông tin người đặt</h4>
            <input type="text" placeholder="Họ và tên *" value={customerName} onChange={(e) => setCustomerName(e.target.value)} className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none text-sm" />
            <input type="text" placeholder="Số điện thoại *" value={phone} onChange={(e) => setPhone(e.target.value)} className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none text-sm" />
            <input type="email" placeholder="Email nhận vé (Tùy chọn)" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none text-sm" />
        </div>

        {err && <div className="p-3 bg-red-50 text-red-600 text-sm rounded-lg text-center">{err}</div>}

        <div className="grid grid-cols-2 gap-3 pt-2">
          <button className="px-4 py-3 rounded-xl bg-gray-100 text-gray-700 font-semibold hover:bg-gray-200 transition" onClick={onClose}>Quay lại</button>
          <button className="px-4 py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-blue-600 text-white font-bold shadow-lg shadow-indigo-200 hover:opacity-90 transition transform active:scale-95" onClick={handleConfirm}>
            Đã chuyển khoản xong
          </button>
        </div>

      </div>
    </div>
  );
}
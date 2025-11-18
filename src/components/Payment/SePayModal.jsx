// src/components/Payment/SePayModal.jsx
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
  sepayCheckoutUrl,
  sepayMeta,
  onPaidConfirm,
}) {
  const [err, setErr] = useState("");
  const [vietqrUrl, setVietqrUrl] = useState("");
  const usingSePay = !!sepayQrImage;

  // NEW user inputs
  const [customerName, setCustomerName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");

  useEffect(() => {
    if (!open) return;

    if (!amount || amount <= 0) {
      const msg = "Số tiền (amount) không hợp lệ.";
      setErr(msg);
      onError?.(msg);
      return;
    }
    if (!orderId) {
      const msg = "Thiếu mã đơn hàng (orderId).";
      setErr(msg);
      onError?.(msg);
      return;
    }

    if (usingSePay) {
      setErr("");
      onSuccess?.({
        method: "SePay",
        orderId,
        amount,
        checkoutUrl: sepayCheckoutUrl || null,
        meta: sepayMeta || {},
      });
      return;
    }

    const url = vietQRImageURL({
      bank: BANK_CODE,
      account: ACCOUNT_NO,
      accountName: ACCOUNT_NM,
      amount,
      content: orderId,
    });

    setVietqrUrl(url);
    setErr("");

    onSuccess?.({
      method: "VietQR",
      orderId,
      amount,
      bank: BANK_CODE,
      account: ACCOUNT_NO,
    });
  }, [open]);

  if (!open) return null;

  const moneyFmt = (n) => Number(n).toLocaleString("vi-VN") + " đ";

  const copy = async (t) => {
    try {
      await navigator.clipboard.writeText(t);
      alert("Đã sao chép!");
    } catch {
      alert("Không thể sao chép. Vui lòng thử lại!");
    }
  };

  return (
    <div className="fixed inset-0 z-[999] flex items-center justify-center">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />

      <div className="relative z-10 w-[92%] max-w-lg rounded-2xl bg-white shadow-2xl p-6 space-y-5">

        {/* TITLE */}
        <div>
          <h3 className="text-2xl font-bold text-gray-800">
            Thanh toán đơn hàng
          </h3>
          <p className="text-sm text-gray-500 mt-1">
            Mã đơn: <b>{orderId}</b>
          </p>
        </div>

        {/* SỐ TIỀN */}
        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-4 shadow-sm">
          <div className="flex justify-between items-center">
            <span className="text-gray-600">Số tiền cần thanh toán</span>
            <span className="text-xl font-bold text-indigo-700">{moneyFmt(amount)}</span>
          </div>
        </div>

        {/* THÔNG TIN NGÂN HÀNG */}
        <div className="bg-gray-50 rounded-xl p-4 shadow-sm space-y-2">
          <h4 className="font-semibold text-gray-700 text-sm">Thông tin chuyển khoản</h4>

          <div className="grid grid-cols-2 gap-3 text-sm">
            <div>
              <p className="text-gray-500">Ngân hàng</p>
              <p className="font-medium">{BANK_CODE}</p>
            </div>
            <div className="text-right">
              <p className="text-gray-500">Số tài khoản</p>
              <button onClick={() => copy(ACCOUNT_NO)}
                className="font-medium hover:underline">
                {ACCOUNT_NO}
              </button>
            </div>

            <div>
              <p className="text-gray-500">Chủ tài khoản</p>
              <p className="font-medium">{ACCOUNT_NM}</p>
            </div>
            <div className="text-right">
              <p className="text-gray-500">Nội dung CK</p>
              <button onClick={() => copy(orderId)}
                className="font-medium hover:underline">
                {orderId}
              </button>
            </div>
          </div>
        </div>

        {/* FORM KHÁCH HÀNG */}
        <div className="bg-gray-50 rounded-xl p-4 shadow-sm space-y-3">
          <h4 className="font-semibold text-gray-700 text-sm">Thông tin khách hàng</h4>

          <input
            type="text"
            placeholder="Họ và tên"
            value={customerName}
            onChange={(e) => setCustomerName(e.target.value)}
            className="w-full bg-white px-3 py-2 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-200 outline-none"
          />

          <input
            type="text"
            placeholder="Số điện thoại"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="w-full bg-white px-3 py-2 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-200 outline-none"
          />

          <input
            type="email"
            placeholder="Email (không bắt buộc)"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full bg-white px-3 py-2 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-200 outline-none"
          />
        </div>

        {/* QR CODE */}
        <div className="flex flex-col items-center">
          <div className="bg-white shadow-md rounded-xl p-3">
            <img
              src={usingSePay ? sepayQrImage : vietqrUrl}
              className="w-52 h-52 rounded-xl"
            />
          </div>
        </div>

        {/* ERROR */}
        {err && <p className="text-red-600 text-sm">{err}</p>}

        {/* BUTTONS */}
        <div className="flex justify-end gap-3">
          <button
            className="px-4 py-2 rounded-lg bg-gray-100 text-gray-700 hover:bg-gray-200"
            onClick={onClose}
          >
            Hủy
          </button>

          <button
            className="px-4 py-2 rounded-lg bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow hover:brightness-110"
            onClick={() => {
              if (!customerName.trim() || !phone.trim()) {
                alert("Vui lòng nhập HỌ TÊN và SỐ ĐIỆN THOẠI");
                return;
              }

              onClose?.();
              onPaidConfirm?.({
                name: customerName,
                phone,
                email,
                orderId,
                amount,
              });
            }}
          >
            Đã chuyển xong / OK
          </button>
        </div>

      </div>
    </div>
  );
}

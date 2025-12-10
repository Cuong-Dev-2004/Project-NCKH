// QrBaking.jsx
import CustomuseApi from "../../../Services/AxiosFetchApi";
import { getToken } from "../../../utils/auth";
import { getUserid } from "../../../utils/hashToken";
import qr from "../../../assets/Qr.jpg";

function QrBaking({ form, currentTour, setShowQR, setForm, onSuccess }) {

    const handleConfirmPayment = async () => {
        try {
            // Lấy ID tour từ form HOẶC từ currentTour (nếu người dùng chọn từ trang chủ)
            const finalTourId = form.tour || (currentTour ? currentTour._id : null);

            const payload = {
                touristId: getUserid(),
                guideId: form.guide?._id || null,

                // --- SỬA Ở ĐÂY: Đổi tên key thành tourId để khớp Backend ---
                tourId: finalTourId,
                // -----------------------------------------------------------

                dateFrom: form.dateFrom,
                dateTo: form.dateTo,
                guests: form.guests,
                note: form.note,
                paymentStatus: "Paid",
                status: "Confirmed",
                type: "Global"
            };

            // Log ra để kiểm tra trước khi gửi
            console.log("Payload gửi đi:", payload);

            await CustomuseApi({
                Url: "booking/create-booking",
                method: "POST",
                headers: { Authorization: `Bearer ${getToken()}` },
                data: payload,
            });

            if (onSuccess) onSuccess("Đã Đặt thành công bênh nhân viên sẽ liên hệ bạn sớm nhất!");

            setForm({
                tour: null,
                guide: getUserid(),
                dateFrom: "",
                dateTo: "",
                guests: 1,
                note: "",
            });

            localStorage.removeItem("idProduct");
            setShowQR(false);

        } catch (error) {
            alert("Lỗi khi lưu booking: " + (error.message || ""));
        }
    };

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-xl flex flex-col items-center">
                <h3 className="text-xl font-bold mb-4">Quét QR để thanh toán</h3>
                <img src={qr} alt="QR Code" className="w-[150px] h-[150px]" />
                <div className="flex gap-4 mt-4">
                    <button
                        onClick={() => setShowQR(false)}
                        className="px-4 py-2 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700"
                    >
                        Đóng
                    </button>
                    <button
                        onClick={handleConfirmPayment}
                        className="px-4 py-2 bg-green-600 text-white rounded-xl hover:bg-green-700"
                    >
                        Đã Thanh Toán
                    </button>
                </div>
            </div>
        </div>
    );
}

export default QrBaking;
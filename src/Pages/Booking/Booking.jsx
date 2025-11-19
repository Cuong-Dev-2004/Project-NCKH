import { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { TOURS } from "../../data/tours";

export default function Booking({ tours = TOURS }) {
  const navigate = useNavigate();
  const location = useLocation();

  // Ưu tiên tour được truyền bằng state (đủ id/name/price)
  const tourFromState = location.state?.tour || null;

  // Nếu có ?tourId= trên URL thì tra lại ở tours
  const params = new URLSearchParams(window.location.search);
  const tourIdQ = Number(params.get("tourId") || 0);
  const tourFromId = useMemo(
    () => tours.find(x => x.id === tourIdQ) || null,
    [tours, tourIdQ]
  );

  // Chốt tour đang chọn
  const pickedTour = tourFromState || tourFromId || null;

  const [formData, setFormData] = useState({
    tourId: "",
    tourTitle: "",
    destination: "",
    name: "",
    email: "",
    phone: "",
    nationality: "",
    startDate: "",
    endDate: "",
    language: "",
    guideStyle: "",
    people: 1,
    notes: "",
  });

  // Prefill từ tour (giữ đúng giá/id/name)
  useEffect(() => {
    setFormData(s => ({
      ...s,
      tourId: pickedTour ? String(pickedTour.id) : s.tourId,
      tourTitle: pickedTour?.name || s.tourTitle,
      destination: s.destination || pickedTour?.name || pickedTour?.location || "",
    }));
  }, [pickedTour]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "people") {
      const v = Math.max(1, Number(value || 1));
      setFormData(s => ({ ...s, [name]: v }));
    } else {
      setFormData(s => ({ ...s, [name]: value }));
    }
  };

  const inputBase =
    "w-full border border-gray-200 bg-white px-3.5 py-2.5 rounded-xl text-gray-900 placeholder:text-gray-400 " +
    "focus:outline-none focus:ring-2 focus:ring-sky-200 focus:border-sky-300 transition";
  const label = "text-[12px] font-medium text-gray-600";

  const goPickGuide = (e) => {
    e.preventDefault();

    if (!formData.destination || !formData.startDate || !formData.endDate) {
      alert("Vui lòng nhập Điểm đến và Ngày đi/kết thúc trước khi chọn hướng dẫn viên.");
      return;
    }

    // GIÁ CHUẨN luôn lấy từ object tour đã chọn
    const tourPrice = pickedTour?.price ?? 0;

    const query = new URLSearchParams({
      tab: "chooseGuide",
      tourId: formData.tourId || "",
      tourTitle: formData.tourTitle || "",
      tourPrice: String(tourPrice),
      destination: formData.destination || "",
      startDate: formData.startDate || "",
      endDate: formData.endDate || "",
      people: String(formData.people || 1),
      language: formData.language || "",
      guideStyle: formData.guideStyle || "",
      name: formData.name || "",
      email: formData.email || "",
      phone: formData.phone || "",
      nationality: formData.nationality || "",
      notes: formData.notes || "",
    }).toString();

    navigate(`/tour-booking-flow?${query}`);
  };

  return (
    <section className="w-full min-h-[70vh] bg-gradient-to-br from-blue-700 via-indigo-700 to-indigo-800 py-16 px-4">
      <div className="mx-auto w-full max-w-[720px]">
        <div className="rounded-3xl bg-white/95 backdrop-blur shadow-[0_20px_60px_rgba(0,0,0,.20)] ring-1 ring-white/60">
          <div className="px-6 md:px-8 pt-8">
            <div className="inline-flex items-center gap-2 text-xs text-sky-700 font-semibold bg-sky-50 rounded-full px-3 py-1">
              <span>💙</span> Đặt tour tùy chỉnh
            </div>
            <h2 className="mt-3 text-2xl md:text-3xl font-extrabold text-gray-900 leading-tight">
              Lên lịch cho hành trình <span className="text-sky-600">đáng nhớ</span>
            </h2>
            <p className="mt-2 text-gray-600">
              Điền thông tin ngắn gọn. Chúng tôi sẽ liên hệ trong 10 phút (giờ làm việc).
            </p>
          </div>

          <form className="px-6 md:px-8 pb-8 pt-6 grid gap-4" onSubmit={goPickGuide}>
            <div className="grid gap-1.5">
              <label className={label}>Tên tour / gợi ý điểm đến</label>
              <input
                type="text"
                name="tourTitle"
                value={formData.tourTitle}
                onChange={handleChange}
                className={inputBase}
                placeholder="Ví dụ: City Tour Đà Nẵng 1 ngày"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="grid gap-1.5">
                <label className={label}>Họ và tên *</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className={inputBase}
                  placeholder="Nguyễn Văn A"
                  required
                />
              </div>
              <div className="grid gap-1.5">
                <label className={label}>Email *</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className={inputBase}
                  placeholder="email@domain.com"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="grid gap-1.5">
                <label className={label}>Số điện thoại *</label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className={inputBase}
                  placeholder="09xx xxx xxx"
                  required
                />
              </div>
              <div className="grid gap-1.5">
                <label className={label}>Quốc tịch</label>
                <input
                  type="text"
                  name="nationality"
                  value={formData.nationality}
                  onChange={handleChange}
                  className={inputBase}
                  placeholder="Việt Nam"
                />
              </div>
            </div>

            <div className="grid gap-1.5">
              <label className={label}>Điểm đến mong muốn *</label>
              <input
                type="text"
                name="destination"
                value={formData.destination}
                onChange={handleChange}
                className={inputBase}
                placeholder="Đà Nẵng, Huế, Hội An…"
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="grid gap-1.5">
                <label className={label}>Ngày khởi hành *</label>
                <input
                  type="date"
                  name="startDate"
                  value={formData.startDate}
                  onChange={handleChange}
                  className={inputBase}
                  required
                />
              </div>
              <div className="grid gap-1.5">
                <label className={label}>Ngày kết thúc *</label>
                <input
                  type="date"
                  name="endDate"
                  value={formData.endDate}
                  onChange={handleChange}
                  className={inputBase}
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="grid gap-1.5">
                <label className={label}>Ngôn ngữ hướng dẫn viên</label>
                <select
                  name="language"
                  value={formData.language}
                  onChange={handleChange}
                  className={inputBase}
                >
                  <option value="">Chọn</option>
                  <option value="vietnamese">Tiếng Việt</option>
                  <option value="english">Tiếng Anh</option>
                  <option value="chinese">Tiếng Trung</option>
                  <option value="japanese">Tiếng Nhật</option>
                </select>
              </div>
              <div className="grid gap-1.5">
                <label className={label}>Phong cách hướng dẫn</label>
                <select
                  name="guideStyle"
                  value={formData.guideStyle}
                  onChange={handleChange}
                  className={inputBase}
                >
                  <option value="">Chọn</option>
                  <option value="culture">Văn hóa</option>
                  <option value="food">Ẩm thực</option>
                  <option value="adventure">Phiêu lưu</option>
                  <option value="relax">Nghỉ dưỡng</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="grid gap-1.5">
                <label className={label}>Số lượng khách *</label>
                <input
                  type="number"
                  name="people"
                  min="1"
                  value={formData.people}
                  onChange={handleChange}
                  className={inputBase}
                  placeholder="1"
                  required
                />
              </div>
              <div className="hidden md:block" />
            </div>

            <div className="grid gap-1.5">
              <label className={label}>Ghi chú thêm</label>
              <textarea
                name="notes"
                value={formData.notes}
                onChange={handleChange}
                rows={4}
                className={inputBase + " resize-none"}
                placeholder="Yêu cầu đặc biệt (ăn chay, có trẻ em, hoạt động đêm...)"
              />
            </div>

            <div className="pt-2 flex justify-center">
              <button
                type="submit"
                className="w-56 bg-sky-600 text-white py-3 rounded-2xl font-semibold shadow hover:bg-sky-700 hover:shadow-md active:bg-sky-800 transition"
              >
                Chọn hướng dẫn viên
              </button>
            </div>
          </form>

          <div className="px-6 md:px-8 pb-6 text-center text-[12px] text-gray-500">
            Bằng cách gửi biểu mẫu, bạn đồng ý với điều khoản & chính sách bảo mật của TravelTour.
          </div>
        </div>
      </div>
    </section>
  );
}

// src/Pages/Contact/Contact.jsx
import React, { useState } from "react";
import { FaMapMarkerAlt, FaPhoneAlt, FaEnvelope } from "react-icons/fa";

const ADDRESS = "7 Quang Trung, Hải Châu, Đà Nẵng";
const LAT = 16.07463;
const LNG = 108.22287;

export default function Contact() {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [status, setStatus] = useState(null);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.name.trim() || !form.email.trim() || !form.message.trim()) {
      setStatus({ type: "err", text: "Vui lòng điền đầy đủ các trường bắt buộc." });
      return;
    }
    const subject = encodeURIComponent(`Liên hệ từ ${form.name}`);
    const body = encodeURIComponent(`Tên: ${form.name}\nEmail: ${form.email}\n\n${form.message}`);
    window.location.href = `mailto:stours.vn@gmail.com?subject=${subject}&body=${body}`;
    setStatus({ type: "ok", text: "Mở ứng dụng email để gửi tin nhắn..." });
  };

  const embedSrc = `https://maps.google.com/maps?q=${LAT},${LNG}&z=15&output=embed`;
  const directionsUrl = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(
    ADDRESS
  )}`;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* MAP */}
      <div className="relative w-full h-64 md:h-96">{/* chỉ thêm relative */}
        <iframe
          title="map-duytan"
          src={embedSrc}
          className="w-full h-full border-0"
          allowFullScreen
          loading="lazy"
        />
      </div>

      {/* Card overlapping */}
      <div className="max-w-6xl mx-auto -mt-24 md:-mt-32 px-4 z-10 relative">{/* chỉ chỉnh margin + z-index */}
        <div className="bg-white rounded-3xl shadow-2xl p-6 md:p-10">
          <h2 className="text-center text-2xl md:text-3xl font-extrabold">LIÊN HỆ VỚI CHÚNG TÔI</h2>
          <p className="text-center text-gray-500 mt-2">Chúng tôi sẵn sàng phục vụ bạn 7 ngày một tuần!</p>

          {/* top info row */}
          <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-6">
            {/* Address */}
            <div className="flex items-start gap-4">
              <div className="flex-none bg-blue-50 p-3 rounded-lg">
                <FaMapMarkerAlt className="text-blue-600" />
              </div>
              <div>
                <div className="text-sm font-semibold text-gray-700">Địa chỉ</div>
                <div className="text-gray-600 mt-1">{ADDRESS}</div>
                <a
                  href={directionsUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="text-sm text-blue-600 hover:underline mt-2 inline-block"
                >
                  Chỉ đường trên Google Maps →
                </a>
              </div>
            </div>

            {/* Phone */}
            <div className="flex items-start gap-4">
              <div className="flex-none bg-blue-50 p-3 rounded-lg">
                <FaPhoneAlt className="text-blue-600" />
              </div>
              <div>
                <div className="text-sm font-semibold text-gray-700">Số điện thoại</div>
                <div className="text-gray-600 mt-1">0869.189.812</div>
                <div className="text-gray-600 mt-1">***</div>
              </div>
            </div>

            {/* Email */}
            <div className="flex items-start gap-4">
              <div className="flex-none bg-blue-50 p-3 rounded-lg">
                <FaEnvelope className="text-blue-600" />
              </div>
              <div>
                <div className="text-sm font-semibold text-gray-700">Email</div>
                <div className="text-gray-600 mt-1">vottanphu@dtu.edu.vn</div>
                <div className="text-gray-600 mt-1">***</div>
              </div>
            </div>
          </div>

          {/* bottom: form + side card */}
          <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Form */}
            <form onSubmit={handleSubmit} className="md:col-span-2 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Tên của bạn *</label>
                  <input
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    placeholder="Nguyễn Văn A"
                    className="mt-1 block w-full rounded-lg border border-gray-200 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-200"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Email *</label>
                  <input
                    name="email"
                    type="email"
                    value={form.email}
                    onChange={handleChange}
                    placeholder="you@example.com"
                    className="mt-1 block w-full rounded-lg border border-gray-200 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-200"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Nội dung *</label>
                <textarea
                  name="message"
                  value={form.message}
                  onChange={handleChange}
                  rows="6"
                  placeholder="Viết tin nhắn..."
                  className="mt-1 block w-full rounded-lg border border-gray-200 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-200"
                />
              </div>

              <div className="flex items-center gap-4">
                <button
                  type="submit"
                  className="inline-flex items-center justify-center px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg shadow"
                >
                  Gửi tin nhắn
                </button>

                {status && (
                  <div
                    className={`text-sm ${status.type === "ok" ? "text-green-600" : "text-red-600"}`}
                    role="status"
                  >
                    {status.text}
                  </div>
                )}
              </div>
            </form>

            {/* Side info card */}
            <aside className="rounded-lg bg-gray-50 p-6 shadow-sm">
              <h4 className="text-lg font-semibold text-gray-800">GỬI TIN NHẮN</h4>
              <p className="text-gray-600 mt-2 text-sm">
                Địa chỉ email của bạn sẽ không được công bố. Các trường bắt buộc được đánh dấu *
              </p>

              <div className="mt-6">
                <p className="font-semibold text-gray-700">Giờ làm việc</p>
                <p className="text-gray-600 mt-1">Thứ 2 - Chủ nhật: 08:00 - 18:00</p>

                <p className="mt-4 text-sm text-gray-600">Hoặc gọi ngay:</p>
                <a href="tel:0935864406" className="text-blue-600 font-medium block mt-1">
                  0935.864.406
                </a>

                <div className="mt-6 border-t pt-4">
                  <p className="text-sm text-gray-500">Địa chỉ</p>
                  <p className="text-gray-700 font-medium mt-1">{ADDRESS}</p>
                  <a
                    href={directionsUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="text-sm text-blue-600 hover:underline mt-2 inline-block"
                  >
                    Xem chỉ đường trên Google Maps →
                  </a>
                </div>
              </div>
            </aside>
          </div>
        </div>
      </div>

      <div className="h-10" />
    </div>
  );
}

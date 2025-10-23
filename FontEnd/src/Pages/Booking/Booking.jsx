import { useState } from "react";

function Booking() {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        phone: "",
        nationality: "",
        destination: "",
        startDate: "",
        endDate: "",
        language: "",
        guideStyle: "",
        people: 1,
        budget: "",
        notes: "",
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log("Booking Data:", formData);
        alert("Đặt tour thành công! Chúng tôi sẽ liên hệ sớm.");
    };

    return (
        <section className="w-full bg-gray-50 py-10">
            <div className="mx-auto max-w-2xl p-8 rounded-xl shadow">
                {/* Thay đổi text-gray-900 thành text-black */}
                <h2 className="text-2xl font-bold text-black mb-6 text-center">
                    Đặt Tour Tùy Chỉnh
                </h2>
                <form onSubmit={handleSubmit} className="space-y-5">
                    {/* Thông tin khách */}
                    <input
                        type="text"
                        name="name"
                        placeholder="Họ và tên"
                        value={formData.name}
                        onChange={handleChange}
                        // Thêm text-black và placeholder:text-black
                        className="w-full border p-3 rounded text-black placeholder:text-black"
                        required
                    />
                    <input
                        type="email"
                        name="email"
                        placeholder="Email"
                        value={formData.email}
                        onChange={handleChange}
                        // Thêm text-black và placeholder:text-black
                        className="w-full border p-3 rounded text-black placeholder:text-black"
                        required
                    />
                    <input
                        type="tel"
                        name="phone"
                        placeholder="Số điện thoại"
                        value={formData.phone}
                        onChange={handleChange}
                        // Thêm text-black và placeholder:text-black
                        className="w-full border p-3 rounded text-black placeholder:text-black"
                        required
                    />
                    <input
                        type="text"
                        name="nationality"
                        placeholder="Quốc tịch"
                        value={formData.nationality}
                        onChange={handleChange}
                        // Thêm text-black và placeholder:text-black
                        className="w-full border p-3 rounded text-black placeholder:text-black"
                    />

                    {/* Điểm đến & thời gian */}
                    <input
                        type="text"
                        name="destination"
                        placeholder="Điểm đến mong muốn"
                        value={formData.destination}
                        onChange={handleChange}
                        // Thêm text-black và placeholder:text-black
                        className="w-full border p-3 rounded text-black placeholder:text-black"
                        required
                    />
                    <div className="flex gap-3">
                        <input
                            type="date"
                            name="startDate"
                            value={formData.startDate}
                            onChange={handleChange}
                            // Thêm text-black
                            className="flex-1 border p-3 rounded text-black"
                            required
                        />
                        <input
                            type="date"
                            name="endDate"
                            value={formData.endDate}
                            onChange={handleChange}
                            // Thêm text-black
                            className="flex-1 border p-3 rounded text-black"
                            required
                        />
                    </div>

                    {/* Ngôn ngữ & phong cách hướng dẫn viên */}
                    <select
                        name="language"
                        value={formData.language}
                        onChange={handleChange}
                        // Thêm text-black
                        className="w-full border p-3 rounded text-black"
                    >
                        <option value="">Chọn ngôn ngữ hướng dẫn viên</option>
                        <option value="english">Tiếng Anh</option>
                        <option value="vietnamese">Tiếng Việt</option>
                        <option value="chinese">Tiếng Trung</option>
                        <option value="japanese">Tiếng Nhật</option>
                    </select>

                    <select
                        name="guideStyle"
                        value={formData.guideStyle}
                        onChange={handleChange}
                        // Thêm text-black
                        className="w-full border p-3 rounded text-black"
                    >
                        <option value="">Phong cách hướng dẫn</option>
                        <option value="culture">Văn hóa</option>
                        <option value="food">Ẩm thực</option>
                        <option value="adventure">Phiêu lưu</option>
                        <option value="relax">Nghỉ dưỡng</option>
                    </select>

                    {/* Số lượng người & ngân sách */}
                    <div className="flex gap-3">
                        <input
                            type="number"
                            name="people"
                            min="1"
                            value={formData.people}
                            onChange={handleChange}
                            // Thêm text-black và placeholder:text-black
                            className="flex-1 border p-3 rounded text-black placeholder:text-black"
                            placeholder="Số lượng khách"
                        />
                        <input
                            type="text"
                            name="budget"
                            value={formData.budget}
                            onChange={handleChange}
                            // Thêm text-black và placeholder:text-black
                            className="flex-1 border p-3 rounded text-black placeholder:text-black"
                            placeholder="Ngân sách dự kiến (USD)"
                        />
                    </div>

                    {/* Yêu cầu đặc biệt */}
                    <textarea
                        name="notes"
                        value={formData.notes}
                        onChange={handleChange}
                        rows="4"
                        // Thêm text-black và placeholder:text-black
                        className="w-full border p-3 rounded text-black placeholder:text-black"
                        placeholder="Yêu cầu đặc biệt (ăn chay, có trẻ em, hoạt động đêm...)"
                    ></textarea>

                    {/* Submit */}
                    <button
                        type="submit"
                        // Thay đổi text-white thành text-black
                        className="w-full bg-blue-600 text-black py-3 rounded-lg hover:bg-blue-700 transition"
                    >
                        Gửi yêu cầu đặt tour
                    </button>
                </form>
            </div>
        </section>
    );
}

export default Booking;
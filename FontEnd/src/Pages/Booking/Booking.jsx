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
            <div className="mx-auto max-w-2xl bg-white p-8 rounded-xl shadow">
                <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
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
                        className="w-full border p-3 rounded"
                        required
                    />
                    <input
                        type="email"
                        name="email"
                        placeholder="Email"
                        value={formData.email}
                        onChange={handleChange}
                        className="w-full border p-3 rounded"
                        required
                    />
                    <input
                        type="tel"
                        name="phone"
                        placeholder="Số điện thoại"
                        value={formData.phone}
                        onChange={handleChange}
                        className="w-full border p-3 rounded"
                        required
                    />
                    <input
                        type="text"
                        name="nationality"
                        placeholder="Quốc tịch"
                        value={formData.nationality}
                        onChange={handleChange}
                        className="w-full border p-3 rounded"
                    />

                    {/* Điểm đến & thời gian */}
                    <input
                        type="text"
                        name="destination"
                        placeholder="Điểm đến mong muốn"
                        value={formData.destination}
                        onChange={handleChange}
                        className="w-full border p-3 rounded"
                        required
                    />
                    <div className="flex gap-3">
                        <input
                            type="date"
                            name="startDate"
                            value={formData.startDate}
                            onChange={handleChange}
                            className="flex-1 border p-3 rounded"
                            required
                        />
                        <input
                            type="date"
                            name="endDate"
                            value={formData.endDate}
                            onChange={handleChange}
                            className="flex-1 border p-3 rounded"
                            required
                        />
                    </div>

                    {/* Ngôn ngữ & phong cách hướng dẫn viên */}
                    <select
                        name="language"
                        value={formData.language}
                        onChange={handleChange}
                        className="w-full border p-3 rounded"
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
                        className="w-full border p-3 rounded"
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
                            className="flex-1 border p-3 rounded"
                            placeholder="Số lượng khách"
                        />
                        <input
                            type="text"
                            name="budget"
                            value={formData.budget}
                            onChange={handleChange}
                            className="flex-1 border p-3 rounded"
                            placeholder="Ngân sách dự kiến (USD)"
                        />
                    </div>

                    {/* Yêu cầu đặc biệt */}
                    <textarea
                        name="notes"
                        value={formData.notes}
                        onChange={handleChange}
                        rows="4"
                        className="w-full border p-3 rounded"
                        placeholder="Yêu cầu đặc biệt (ăn chay, có trẻ em, hoạt động đêm...)"
                    ></textarea>

                    {/* Submit */}
                    <button
                        type="submit"
                        className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition"
                    >
                        Gửi yêu cầu đặt tour
                    </button>
                </form>
            </div>
        </section>
    );

}

export default Booking;
import { useEffect, useState } from "react";
import NavDown from "../../components/Ui/NavDownTourBookingFlow";
import { Link } from "react-router-dom";


const guides = [
    { id: 1, name: "Nguyễn Văn A", location: "Hà Nội", language: "Tiếng Anh", style: "Ẩm thực", price: 50, available: true, image: "https://scontent.fdad1-4.fna.fbcdn.net/v/t39.30808-6/511112703_1287679326253088_7165413382012111639_n.jpg?_nc_cat=103&ccb=1-7&_nc_sid=6ee11a&_nc_eui2=AeHF29mBIxSC0yxov6i9Cz8EVQvzoa5Qv69VC_OhrlC_r7sE8653APO6HyU8M43F8D1AWFsFppvVJpFvrENYR8Bd&_nc_ohc=31KpimGRXHkQ7kNvwGxIG0h&_nc_oc=AdmYu3Zv3d-ATP9VJZE2BXPfGXcTdjaR0rT2uLh3vVdUE1uStCFhy1ur3fW5zCLApaU&_nc_zt=23&_nc_ht=scontent.fdad1-4.fna&_nc_gid=Z1T_ZG1dUBKsjwPp5Wv7yA&oh=00_AfWv4mtT4B589oSkLx2tcnglV6xzAxf6gEnlX6FRU3dAJQ&oe=68B11389" },
    { id: 2, name: "Trần Thị B", location: "Đà Nẵng", language: "Tiếng Việt", style: "Văn hóa", price: 40, available: false, image: "https://scontent.fdad1-4.fna.fbcdn.net/v/t39.30808-6/511112703_1287679326253088_7165413382012111639_n.jpg?_nc_cat=103&ccb=1-7&_nc_sid=6ee11a&_nc_eui2=AeHF29mBIxSC0yxov6i9Cz8EVQvzoa5Qv69VC_OhrlC_r7sE8653APO6HyU8M43F8D1AWFsFppvVJpFvrENYR8Bd&_nc_ohc=31KpimGRXHkQ7kNvwGxIG0h&_nc_oc=AdmYu3Zv3d-ATP9VJZE2BXPfGXcTdjaR0rT2uLh3vVdUE1uStCFhy1ur3fW5zCLApaU&_nc_zt=23&_nc_ht=scontent.fdad1-4.fna&_nc_gid=Z1T_ZG1dUBKsjwPp5Wv7yA&oh=00_AfWv4mtT4B589oSkLx2tcnglV6xzAxf6gEnlX6FRU3dAJQ&oe=68B11389" },
    { id: 3, name: "Lê Văn C", location: "TP. Hồ Chí Minh", language: "Tiếng Nhật", style: "Phiêu lưu", price: 60, available: true, image: "https://scontent.fdad1-4.fna.fbcdn.net/v/t39.30808-6/511112703_1287679326253088_7165413382012111639_n.jpg?_nc_cat=103&ccb=1-7&_nc_sid=6ee11a&_nc_eui2=AeHF29mBIxSC0yxov6i9Cz8EVQvzoa5Qv69VC_OhrlC_r7sE8653APO6HyU8M43F8D1AWFsFppvVJpFvrENYR8Bd&_nc_ohc=31KpimGRXHkQ7kNvwGxIG0h&_nc_oc=AdmYu3Zv3d-ATP9VJZE2BXPfGXcTdjaR0rT2uLh3vVdUE1uStCFhy1ur3fW5zCLApaU&_nc_zt=23&_nc_ht=scontent.fdad1-4.fna&_nc_gid=Z1T_ZG1dUBKsjwPp5Wv7yA&oh=00_AfWv4mtT4B589oSkLx2tcnglV6xzAxf6gEnlX6FRU3dAJQ&oe=68B11389" },
    { id: 4, name: "Nguyễn Văn D", location: "Thái Bình", language: "Tiếng Ý", style: "Trải Nghiệm", price: 60, available: false, image: "https://scontent.fdad1-4.fna.fbcdn.net/v/t39.30808-6/511112703_1287679326253088_7165413382012111639_n.jpg?_nc_cat=103&ccb=1-7&_nc_sid=6ee11a&_nc_eui2=AeHF29mBIxSC0yxov6i9Cz8EVQvzoa5Qv69VC_OhrlC_r7sE8653APO6HyU8M43F8D1AWFsFppvVJpFvrENYR8Bd&_nc_ohc=31KpimGRXHkQ7kNvwGxIG0h&_nc_oc=AdmYu3Zv3d-ATP9VJZE2BXPfGXcTdjaR0rT2uLh3vVdUE1uStCFhy1ur3fW5zCLApaU&_nc_zt=23&_nc_ht=scontent.fdad1-4.fna&_nc_gid=Z1T_ZG1dUBKsjwPp5Wv7yA&oh=00_AfWv4mtT4B589oSkLx2tcnglV6xzAxf6gEnlX6FRU3dAJQ&oe=68B11389" },
    { id: 5, name: "Nguyễn Văn D", location: "Thái Bình", language: "Tiếng Ý", style: "Trải Nghiệm", price: 60, available: true, image: "https://scontent.fdad1-4.fna.fbcdn.net/v/t39.30808-6/511112703_1287679326253088_7165413382012111639_n.jpg?_nc_cat=103&ccb=1-7&_nc_sid=6ee11a&_nc_eui2=AeHF29mBIxSC0yxov6i9Cz8EVQvzoa5Qv69VC_OhrlC_r7sE8653APO6HyU8M43F8D1AWFsFppvVJpFvrENYR8Bd&_nc_ohc=31KpimGRXHkQ7kNvwGxIG0h&_nc_oc=AdmYu3Zv3d-ATP9VJZE2BXPfGXcTdjaR0rT2uLh3vVdUE1uStCFhy1ur3fW5zCLApaU&_nc_zt=23&_nc_ht=scontent.fdad1-4.fna&_nc_gid=Z1T_ZG1dUBKsjwPp5Wv7yA&oh=00_AfWv4mtT4B589oSkLx2tcnglV6xzAxf6gEnlX6FRU3dAJQ&oe=68B11389" },
    { id: 6, name: "Nguyễn Văn D", location: "Thái Bình", language: "Tiếng Ý", style: "Trải Nghiệm", price: 60, available: false, image: "https://scontent.fdad1-4.fna.fbcdn.net/v/t39.30808-6/511112703_1287679326253088_7165413382012111639_n.jpg?_nc_cat=103&ccb=1-7&_nc_sid=6ee11a&_nc_eui2=AeHF29mBIxSC0yxov6i9Cz8EVQvzoa5Qv69VC_OhrlC_r7sE8653APO6HyU8M43F8D1AWFsFppvVJpFvrENYR8Bd&_nc_ohc=31KpimGRXHkQ7kNvwGxIG0h&_nc_oc=AdmYu3Zv3d-ATP9VJZE2BXPfGXcTdjaR0rT2uLh3vVdUE1uStCFhy1ur3fW5zCLApaU&_nc_zt=23&_nc_ht=scontent.fdad1-4.fna&_nc_gid=Z1T_ZG1dUBKsjwPp5Wv7yA&oh=00_AfWv4mtT4B589oSkLx2tcnglV6xzAxf6gEnlX6FRU3dAJQ&oe=68B11389" },
    { id: 7, name: "Nguyễn Văn D", location: "Thái Bình", language: "Tiếng Ý", style: "Trải Nghiệm", price: 60, available: true, image: "https://scontent.fdad1-4.fna.fbcdn.net/v/t39.30808-6/511112703_1287679326253088_7165413382012111639_n.jpg?_nc_cat=103&ccb=1-7&_nc_sid=6ee11a&_nc_eui2=AeHF29mBIxSC0yxov6i9Cz8EVQvzoa5Qv69VC_OhrlC_r7sE8653APO6HyU8M43F8D1AWFsFppvVJpFvrENYR8Bd&_nc_ohc=31KpimGRXHkQ7kNvwGxIG0h&_nc_oc=AdmYu3Zv3d-ATP9VJZE2BXPfGXcTdjaR0rT2uLh3vVdUE1uStCFhy1ur3fW5zCLApaU&_nc_zt=23&_nc_ht=scontent.fdad1-4.fna&_nc_gid=Z1T_ZG1dUBKsjwPp5Wv7yA&oh=00_AfWv4mtT4B589oSkLx2tcnglV6xzAxf6gEnlX6FRU3dAJQ&oe=68B11389" },
];

export default function TourBookingWithLocation() {
    const [filters, setFilters] = useState({ location: "", language: "", style: "" });
    const [renderGuides, setRenderGuides] = useState(guides);

    useEffect(() => {
        let filtered = guides;
        if (filters.location) filtered = filtered.filter(g => g.location === filters.location);
        if (filters.language) filtered = filtered.filter(g => g.language === filters.language);
        if (filters.style) filtered = filtered.filter(g => g.style === filters.style);
        setRenderGuides(filtered);
    }, [filters]);



    return (
        <section className="w-full bg-gray-50 py-12 text-black min-h-[500px]">
            <div className="px-9">
                <h2 className="text-2xl font-bold mb-6">Tìm hướng dẫn viên theo địa phương</h2>
            </div>

            {/* Dropdown + nút */}
            <div className="flex items-end gap-2 px-9 mb-6">
                <NavDown
                    data={[...new Set(guides.map(g => g.location))]}
                    type="Chọn địa phương"
                    onChange={val => setFilters({ ...filters, location: val })}
                />
                <NavDown
                    data={[...new Set(guides.map(g => g.language))]}
                    type="Chọn Ngôn Ngữ"
                    onChange={val => setFilters({ ...filters, language: val })}
                />
                <NavDown
                    data={[...new Set(guides.map(g => g.style))]}
                    type="Chọn Phong Cách"
                    onChange={val => setFilters({ ...filters, style: val })}
                />

            </div>


            <div className="px-9">
                <h3 className="text-xl font-semibold mb-4">Danh sách hướng dẫn viên</h3>
                {renderGuides.length === 0 ? (
                    <p className="text-gray-500">Không tìm thấy hướng dẫn viên phù hợp</p>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                        {renderGuides.map(guide => (
                            <Link to={`/guide/${guide.id}`} key={guide.id}>
                                <div className="border p-4 rounded shadow-sm hover:shadow-md transition flex flex-col items-center">
                                    <img
                                        src={guide.image}
                                        alt={guide.name}
                                        className="w-16 h-16 rounded-full mb-2"
                                    />
                                    <p className="font-bold text-center">{guide.name}</p>
                                    <p className="text-sm text-gray-600 text-center">
                                        {guide.location} • {guide.language} • {guide.style}
                                    </p>
                                    <p className={`text-center font-semibold ${guide.available ? "text-green-600" : "text-red-600"}`}>
                                        {guide.available ? "Có sẵn" : "Bận"}
                                    </p>
                                </div>
                            </Link>
                        ))}
                    </div>

                )}
            </div>



        </section>
    );
}

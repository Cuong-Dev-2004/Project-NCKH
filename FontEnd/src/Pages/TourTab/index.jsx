import { useEffect, useState } from "react";
import CustomuseApi from "../../Services/AxiosFetchApi";
import { FaSearch, FaMapMarkerAlt, FaMoneyBillWave, FaFilter } from "react-icons/fa";
import { CustomItemProduct } from "../../components/Ui/Ui";

function TourTab() {
    const PRICE_OPTIONS = [0, 50000, 100000, 200000];

    const [sortBy, setSortBy] = useState("popular");
    const [Data, setData] = useState([]);
    const [textInput, setTextInput] = useState("");
    const [TextInputLocation, setTextInputLocation] = useState("");
    const [minPrice, setMinPrice] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 6;

    useEffect(() => {
        async function loadData() {
            const result = await CustomuseApi({
                Url: "staff/GetAllProdcutTour",
                method: "GET",
            });
            setData(result.products);
        }
        loadData();
    }, []);

    // ---- FILTER LOGIC ----
    const filteredData = Data
        .filter(t =>
            t.name.toLowerCase().includes(textInput.toLowerCase()) // search by name
        )
        .filter(t =>
            TextInputLocation === "" || t.location === TextInputLocation
        )
        .filter(t =>
            (t.price || 0) >= minPrice
        );

    const sortedData = [...filteredData].sort((a, b) => {
        if (sortBy === "price-asc") return a.price - b.price;
        if (sortBy === "price-desc") return b.price - a.price;
        return 0;
    });

    // ---- UNIQUE LOCATIONS ----
    const uniqueLocations = Array.from(
        new Set(
            Data
                .filter(item => item.location && item.location.trim() !== "")
                .map(item => item.location.trim())
        )
    );

    // ---- PAGINATION ----
    const totalPages = Math.ceil(sortedData.length / itemsPerPage);
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = sortedData.slice(indexOfFirstItem, indexOfLastItem);

    // Reset page khi filter thay đổi
    useEffect(() => {
        setCurrentPage(1);
    }, [textInput, TextInputLocation, minPrice, sortBy]);

    return (
        <div className="min-h-screen bg-slate-50 font-sans text-slate-800">
            <div className="mx-auto max-w-7xl px-4 md:px-6 py-10">

                {/* HEADER */}
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
                    <div>
                        <h1 className="text-3xl font-extrabold text-slate-900">Khám phá Tours</h1>
                        <p className="text-slate-500 mt-1">Tìm kiếm hành trình mơ ước của bạn</p>
                    </div>
                    <div className="text-sm font-medium bg-white px-4 py-2 rounded-full shadow-sm border border-slate-200 text-slate-600">
                        Hiển thị {sortedData.length} kết quả
                    </div>
                </div>

                {/* FILTER */}
                <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-200 mb-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">

                        {/* SEARCH */}
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                                <FaSearch size={18} />
                            </div>
                            <input
                                value={textInput}
                                onChange={(e) => setTextInput(e.target.value)}
                                placeholder="Tìm tên tour..."
                                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-sky-500"
                            />
                        </div>

                        {/* LOCATION */}
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                                <FaMapMarkerAlt size={18} />
                            </div>
                            <select
                                value={TextInputLocation}
                                onChange={(e) => setTextInputLocation(e.target.value)}
                                className="w-full pl-10 pr-8 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-sky-500"
                            >
                                <option value="">Tất cả địa điểm</option>
                                {uniqueLocations.map((loc, index) => (
                                    <option key={index} value={loc}>
                                        {loc}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* PRICE FILTER */}
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                                <FaMoneyBillWave size={16} />
                            </div>
                            <select
                                value={minPrice}
                                onChange={(e) => setMinPrice(Number(e.target.value))}
                                className="w-full pl-9 pr-8 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-sky-500 appearance-none cursor-pointer"
                            >
                                {PRICE_OPTIONS.map((p) => (
                                    <option key={`min-${p}`} value={p}>
                                        {p === 0 ? "Giá từ: 0đ" : `Từ ${p.toLocaleString()}đ`}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* SORT BY */}
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                                <FaFilter size={16} />
                            </div>
                            <select
                                value={sortBy}
                                onChange={(e) => setSortBy(e.target.value)}
                                className="w-full pl-9 pr-8 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-sky-500 appearance-none cursor-pointer"
                            >
                                <option value="popular">Sắp xếp: Nổi bật</option>
                                <option value="price-asc">Giá: Thấp đến Cao</option>
                                <option value="price-desc">Giá: Cao đến Thấp</option>
                            </select>
                        </div>
                    </div>
                </div>

                {/* TOUR LIST */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {currentItems.map((t, index) => (
                        <CustomItemProduct key={index} props={t} />
                    ))}
                </div>

                {/* PAGINATION */}
                <div className="flex justify-center mt-8 gap-2">
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map(number => (
                        <button
                            key={number}
                            onClick={() => setCurrentPage(number)}
                            className={`px-4 py-2 rounded-lg border ${currentPage === number
                                    ? "bg-sky-500 text-white border-sky-500"
                                    : "bg-white text-slate-800 border-slate-300"
                                }`}
                        >
                            {number}
                        </button>
                    ))}
                </div>

            </div>
        </div>
    );
}

export default TourTab;

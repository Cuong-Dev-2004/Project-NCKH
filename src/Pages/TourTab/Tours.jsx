// src/Pages/TourTab/Tours.jsx
import React, { useMemo, useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { TOURS } from "../../data/tours";
import DetailPresets from "../../data/Data";
import { 
  Search, MapPin, Filter, Star, ChevronLeft, ChevronRight, 
  DollarSign, ArrowRight, Heart 
} from "lucide-react";

/* ===== Helpers ===== */
const LOCATIONS = [...new Set(TOURS.map((t) => t.location))];
const RATINGS = [5, 4, 3]; // Chỉ lọc 3-5 sao cho gọn
const PRICE_OPTIONS = [
  0, 500_000, 1_000_000, 2_000_000, 5_000_000, 10_000_000
];

const slugify = (s) =>
  s.toLowerCase()
    .normalize("NFD").replace(/[\u0300-\u036f]/g, "")
    .replace(/đ/g, "d")
    .replace(/[^a-z0-9 ]/g, "")
    .trim()
    .replace(/\s+/g, "-");

const pickPreset = (id) => {
  // Map ID tour sang preset chi tiết
  const map = {
    1: DetailPresets.danang_city_1day,
    2: DetailPresets.bana_night,
    3: DetailPresets.son_tra_ngu_hanh_son,
    4: DetailPresets.checkin_cau_vang_bana,
    5: DetailPresets.ngu_hanh_son_hoi_an_dem,
    6: DetailPresets.cu_lao_cham_1day,
    7: DetailPresets.hoi_an_dem_den_long,
    8: DetailPresets.lang_gom_thanh_ha,
    9: DetailPresets.rau_tra_que_cooking,
    10: DetailPresets.cam_thanh_thung_chai,
    11: DetailPresets.hue_dai_noi_lang_tam,
    12: DetailPresets.hue_song_huong_cruise,
    13: DetailPresets.hue_thien_mu_minh_mang,
    14: DetailPresets.hue_street_food,
    15: DetailPresets.hue_tu_duc_dong_ba,
  };
  return map[id] || null;
};

/* ===== Components ===== */

function TourCard({ tour }) {
  const slug = slugify(tour.name);
  const preset = pickPreset(tour.id);
  const propData = preset || {
    id: tour.id,
    name: tour.name,
    locationText: tour.location + ", Việt Nam",
    price: tour.price,
    oldPrice: tour.oldPrice,
    duration: tour.duration,
    capacity: 35,
    minAge: "10+",
    pickup: "Khách sạn trung tâm",
    images: [tour.img],
    data1: [],
  };

  const toDetail = { pathname: `/tours/${slug}` };

  return (
    <div className="group bg-white rounded-2xl shadow-sm hover:shadow-xl border border-slate-100 overflow-hidden transition-all duration-300 hover:-translate-y-1">
      {/* Image Section */}
      <div className="relative h-56 overflow-hidden">
        <Link to={toDetail} state={{ tourId: tour.id, propData }} className="block h-full">
          <img
            src={tour.img}
            alt={tour.name}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
          />
        </Link>
        
        <button className="absolute top-3 right-3 p-2 rounded-full bg-white/20 backdrop-blur-md text-white hover:bg-rose-500 hover:text-white transition">
           <Heart size={18} />
        </button>

        <div className="absolute bottom-3 left-3 flex gap-2">
           <span className="text-[10px] font-bold uppercase bg-slate-900/80 backdrop-blur text-white px-2 py-1 rounded-lg">
             {tour.duration} ngày
           </span>
           {tour.tag && (
            <span className="text-[10px] font-bold uppercase bg-rose-500 text-white px-2 py-1 rounded-lg shadow-sm">
              {tour.tag}
            </span>
          )}
        </div>
      </div>

      {/* Content Section */}
      <div className="p-5">
        <div className="flex items-center gap-1 text-xs font-medium text-sky-600 mb-2">
           <MapPin size={14} /> {tour.location}
        </div>
        
        <Link
          to={toDetail}
          state={{ tourId: tour.id, propData }}
          className="block text-lg font-bold text-slate-800 leading-snug mb-2 group-hover:text-sky-600 transition-colors line-clamp-2 min-h-[3.5rem]"
        >
          {tour.name}
        </Link>

        <div className="flex items-center gap-4 mb-4">
           <div className="flex items-center gap-1 bg-amber-50 px-2 py-0.5 rounded text-xs font-bold text-amber-700 border border-amber-100">
              <Star size={12} className="fill-amber-500 text-amber-500"/> {tour.rating}
           </div>
           <div className="text-xs text-slate-400">ID: {tour.id}</div>
        </div>

        <div className="pt-4 border-t border-slate-100 flex items-end justify-between">
          <div>
            <p className="text-xs text-slate-400 mb-0.5">Giá từ</p>
            <div className="flex items-baseline gap-2">
              <span className="text-xl font-extrabold text-rose-600">
                {Number(tour.price).toLocaleString("vi-VN")}đ
              </span>
              {tour.oldPrice && (
                <span className="text-xs text-slate-400 line-through">
                  {Number(tour.oldPrice).toLocaleString("vi-VN")}
                </span>
              )}
            </div>
          </div>

          <Link
            to={toDetail}
            state={{ tourId: tour.id, propData }}
            className="w-10 h-10 flex items-center justify-center rounded-full bg-slate-100 text-slate-600 group-hover:bg-sky-600 group-hover:text-white transition-colors"
          >
            <ArrowRight size={20} />
          </Link>
        </div>
      </div>
    </div>
  );
}

/* ===== Main Page ===== */
export default function Tours() {
  const [q, setQ] = useState("");
  const [location, setLocation] = useState("");
  const [minPrice, setMinPrice] = useState(0);
  const [maxPrice, setMaxPrice] = useState(25_000_000);
  const [rating, setRating] = useState(null);
  const [sortBy, setSortBy] = useState("popular");

  const PAGE_SIZE = 6;
  const [page, setPage] = useState(1);

  useEffect(() => { setPage(1); }, [q, location, minPrice, maxPrice, rating, sortBy]);

  const filtered = useMemo(() => {
    let arr = TOURS.slice();

    if (q.trim()) {
      const t = q.trim().toLowerCase();
      arr = arr.filter((x) => (x.name + " " + x.location).toLowerCase().includes(t));
    }
    if (location) arr = arr.filter((x) => x.location === location);
    if (rating)   arr = arr.filter((x) => x.rating >= rating);
    arr = arr.filter((x) => x.price >= minPrice && (maxPrice === 0 ? true : x.price <= maxPrice));

    if (sortBy === "price-asc") arr.sort((a, b) => a.price - b.price);
    else if (sortBy === "price-desc") arr.sort((a, b) => b.price - a.price);
    else if (sortBy === "popular") arr.sort((a, b) => (b.tag ? 1 : 0) - (a.tag ? 1 : 0));

    return arr;
  }, [q, location, minPrice, maxPrice, rating, sortBy]);

  const total = filtered.length;
  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));
  const start = (page - 1) * PAGE_SIZE;
  const pageItems = filtered.slice(start, start + PAGE_SIZE);
  const go = (p) => setPage((prev) => Math.min(Math.max(p, 1), totalPages));

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-800">
      <div className="mx-auto max-w-7xl px-4 md:px-6 py-10">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
           <div>
              <h1 className="text-3xl font-extrabold text-slate-900">Khám phá Tours</h1>
              <p className="text-slate-500 mt-1">Tìm kiếm hành trình mơ ước của bạn</p>
           </div>
           <div className="text-sm font-medium bg-white px-4 py-2 rounded-full shadow-sm border border-slate-200 text-slate-600">
              Hiển thị <b>{start + 1}-{Math.min(start + PAGE_SIZE, total)}</b> trong <b>{total}</b> kết quả
           </div>
        </div>

        {/* --- FILTER BAR (FORM ĐẸP) --- */}
        <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-200 mb-8">
           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              
              {/* Search */}
              <div className="relative">
                 <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                    <Search size={18} />
                 </div>
                 <input 
                    value={q}
                    onChange={(e) => setQ(e.target.value)}
                    placeholder="Tìm tên tour..."
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-sky-500 transition-all"
                 />
              </div>

              {/* Location */}
              <div className="relative">
                 <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                    <MapPin size={18} />
                 </div>
                 <select 
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    className="w-full pl-10 pr-8 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-sky-500 appearance-none cursor-pointer"
                 >
                    <option value="">Tất cả địa điểm</option>
                    {LOCATIONS.map((loc) => <option key={loc} value={loc}>{loc}</option>)}
                 </select>
                 <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none text-slate-400">
                    <ChevronRight size={14} className="rotate-90" />
                 </div>
              </div>

              {/* Price Min */}
              <div className="relative">
                 <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                    <DollarSign size={16} />
                 </div>
                 <select 
                    value={minPrice}
                    onChange={(e) => setMinPrice(Number(e.target.value))}
                    className="w-full pl-9 pr-8 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-sky-500 appearance-none cursor-pointer"
                 >
                    {PRICE_OPTIONS.map((p) => (
                       <option key={`min-${p}`} value={p}>{p === 0 ? "Giá từ: 0đ" : `Từ ${p.toLocaleString()}đ`}</option>
                    ))}
                 </select>
                 <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none text-slate-400">
                    <ChevronRight size={14} className="rotate-90" />
                 </div>
              </div>

              {/* Sort By */}
              <div className="relative">
                 <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                    <Filter size={16} />
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
                 <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none text-slate-400">
                    <ChevronRight size={14} className="rotate-90" />
                 </div>
              </div>
           </div>

           {/* Rating Filter (Chips) */}
           <div className="mt-4 flex flex-wrap items-center gap-3 pt-4 border-t border-slate-100">
              <span className="text-xs font-bold uppercase text-slate-400 tracking-wider">Đánh giá:</span>
              <button 
                 onClick={() => setRating(null)}
                 className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${!rating ? "bg-slate-800 text-white shadow" : "bg-slate-100 text-slate-600 hover:bg-slate-200"}`}
              >
                 Tất cả
              </button>
              {RATINGS.map((r) => (
                 <button 
                    key={r} 
                    onClick={() => setRating(r === rating ? null : r)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium flex items-center gap-1 transition-all ${
                       rating === r ? "bg-amber-100 text-amber-700 ring-1 ring-amber-200" : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                    }`}
                 >
                    {r} <Star size={10} className="fill-current" /> trở lên
                 </button>
              ))}
           </div>
        </div>

        {/* --- GRID TOURS --- */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {pageItems.map((t) => (
            <TourCard key={t.id} tour={t} />
          ))}
        </div>

        {/* --- PAGINATION --- */}
        {totalPages > 1 && (
           <div className="mt-12 flex justify-center items-center gap-2">
              <button 
                 onClick={() => go(page - 1)} 
                 disabled={page === 1}
                 className="w-10 h-10 flex items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition"
              >
                 <ChevronLeft size={20} />
              </button>
              
              {Array.from({ length: totalPages }).map((_, i) => {
                 const p = i + 1;
                 return (
                    <button
                       key={p}
                       onClick={() => go(p)}
                       className={`w-10 h-10 flex items-center justify-center rounded-xl font-bold text-sm transition ${
                          p === page 
                             ? "bg-slate-900 text-white shadow-md transform scale-110" 
                             : "bg-white border border-slate-200 text-slate-600 hover:bg-slate-50"
                       }`}
                    >
                       {p}
                    </button>
                 );
              })}

              <button 
                 onClick={() => go(page + 1)} 
                 disabled={page === totalPages}
                 className="w-10 h-10 flex items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition"
              >
                 <ChevronRight size={20} />
              </button>
           </div>
        )}

        {filtered.length === 0 && (
           <div className="text-center py-20">
              <div className="inline-block p-4 rounded-full bg-slate-100 mb-3"><Search size={32} className="text-slate-400"/></div>
              <h3 className="text-lg font-bold text-slate-700">Không tìm thấy tour phù hợp</h3>
              <p className="text-slate-500">Vui lòng thử thay đổi bộ lọc hoặc từ khóa tìm kiếm.</p>
           </div>
        )}
      </div>
    </div>
  );
}
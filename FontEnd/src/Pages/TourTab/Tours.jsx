// src/Pages/TourTab/Tours.jsx
import React, { useMemo, useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { TOURS } from "../../data/tours";
import DetailPresets from "../../data/Data";

/* ===== Helpers ===== */
const LOCATIONS = [...new Set(TOURS.map((t) => t.location))];
const RATINGS = [5, 4, 3, 2, 1];
const PRICE_OPTIONS = [
  0, 500_000, 1_000_000, 1_500_000, 2_000_000, 3_000_000, 5_000_000,
  7_000_000, 10_000_000, 15_000_000, 20_000_000, 25_000_000,
];

const slugify = (s) =>
  s.toLowerCase()
    .normalize("NFD").replace(/[\u0300-\u036f]/g, "")
    .replace(/đ/g, "d")
    .replace(/[^a-z0-9 ]/g, "")
    .trim()
    .replace(/\s+/g, "-");

const pickPreset = (id) => {
  switch (id) {
    case 1:  return DetailPresets.danang_city_1day;
    case 2:  return DetailPresets.bana_night;
    case 3:  return DetailPresets.son_tra_ngu_hanh_son;
    case 4:  return DetailPresets.checkin_cau_vang_bana;
    case 5:  return DetailPresets.ngu_hanh_son_hoi_an_dem;
    case 6:  return DetailPresets.cu_lao_cham_1day;
    case 7:  return DetailPresets.hoi_an_dem_den_long;
    case 8:  return DetailPresets.lang_gom_thanh_ha;
    case 9:  return DetailPresets.rau_tra_que_cooking;
    case 10: return DetailPresets.cam_thanh_thung_chai;
    case 11: return DetailPresets.hue_dai_noi_lang_tam;
    case 12: return DetailPresets.hue_song_huong_cruise;
    case 13: return DetailPresets.hue_thien_mu_minh_mang;
    case 14: return DetailPresets.hue_street_food;
    case 15: return DetailPresets.hue_tu_duc_dong_ba;
    default: return null;
  }
};

/* ===== UI atoms ===== */
function StarRow({ n }) {
  return (
    <div className="flex items-center text-amber-400">
      {Array.from({ length: 5 }).map((_, i) => (
        <svg key={i} className={`w-4 h-4 ${i < n ? "" : "opacity-30"}`} viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 .587l3.668 7.431L23.5 9.75l-5.5 5.362L19.335 24 12 19.897 4.665 24 6 15.112 0.5 9.75l7.832-1.732z" />
        </svg>
      ))}
    </div>
  );
}

/* ===== Card ===== */
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
    <div className="bg-white rounded-2xl shadow-md overflow-hidden ring-1 ring-black/5 hover:shadow-lg transition">
      {/* Ảnh + badges */}
      <div className="relative h-52 overflow-hidden">
        <Link to={toDetail} state={{ tourId: tour.id, propData }} className="block h-full">
          <img
            src={tour.img}
            alt={tour.name}
            className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
          />
        </Link>

        {tour.tag && (
          <span className="absolute left-3 top-3 text-[12px] font-semibold px-2.5 py-1 rounded-md bg-sky-600 text-white shadow">
            {tour.tag}
          </span>
        )}
        <span className="absolute right-3 top-3 text-[11px] px-2 py-0.5 rounded-full bg-white/90 text-gray-700 shadow">
          ID: {tour.id}
        </span>
        <span className="absolute left-3 -bottom-3 translate-y-[-6px] text-[12px] px-3 py-1 rounded-full bg-white shadow ring-1 ring-black/5">
          {tour.duration} ngày
        </span>
      </div>

      {/* Nội dung */}
      <div className="p-4">
        <Link
          to={toDetail}
          state={{ tourId: tour.id, propData }}
          className="block text-[15px] md:text-[16px] font-semibold text-gray-900 leading-snug hover:text-sky-700"
          title={tour.name}
        >
          {tour.name}
        </Link>

        <div className="mt-1 text-sm text-gray-600 flex items-center gap-1.5">
          <svg className="w-4 h-4 text-gray-400" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zM12 11.5a2.5 2.5 0 110-5 2.5 2.5 0 010 5z"/>
          </svg>
          {tour.location}
        </div>

        <div className="mt-2 flex items-center gap-2">
          <StarRow n={tour.rating} />
          <span className="text-xs text-gray-600">{tour.rating}</span>
        </div>

        <div className="mt-3 flex items-end justify-between">
          <div>
            <div className="text-[18px] font-extrabold text-rose-600 leading-none">
              {Number(tour.price).toLocaleString("vi-VN")}₫
            </div>
            {tour.oldPrice && (
              <div className="text-xs text-gray-400 line-through">
                {Number(tour.oldPrice).toLocaleString("vi-VN")}₫
              </div>
            )}
          </div>

          <Link
            to={toDetail}
            state={{ tourId: tour.id, propData }}
            className="inline-flex items-center justify-center px-4 py-2 rounded-lg bg-sky-600 text-white text-sm font-semibold shadow hover:brightness-110 active:translate-y-px"
          >
            Xem chi tiết
          </Link>
        </div>
      </div>
    </div>
  );
}

/* ===== Page ===== */
export default function Tours() {
  // filter/sort
  const [q, setQ] = useState("");
  const [location, setLocation] = useState("");
  const [minPrice, setMinPrice] = useState(0);
  const [maxPrice, setMaxPrice] = useState(25_000_000);
  const [rating, setRating] = useState(null);
  const [sortBy, setSortBy] = useState("popular");

  // layout + pagination
  const [layoutGrid] = useState(true);
  const PAGE_SIZE = 6;
  const [page, setPage] = useState(1);

  useEffect(() => {
    setPage(1);
  }, [q, location, minPrice, maxPrice, rating, sortBy]);

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

  // pagination
  const total = filtered.length;
  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));
  const start = (page - 1) * PAGE_SIZE;
  const pageItems = filtered.slice(start, start + PAGE_SIZE);
  const go = (p) => setPage((prev) => Math.min(Math.max(p, 1), totalPages));

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-7xl px-4 md:px-6 py-8">
        {/* Header + sort */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold">
            {total} tour được tìm thấy
            <span className="ml-2 text-sm text-gray-500">• Trang {page}/{totalPages}</span>
          </h2>

          <div className="flex items-center gap-3">
            <span className="text-sm text-gray-700">Sắp xếp theo</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="border px-2 py-1 rounded text-sm"
            >
              <option value="popular">nổi bật</option>
              <option value="price-asc">giá: thấp → cao</option>
              <option value="price-desc">giá: cao → thấp</option>
            </select>
          </div>
        </div>

        {/* Filters */}
        <div className="grid md:grid-cols-4 gap-3 mb-6">
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Tìm tour, địa điểm…"
            className="w-full border px-3 py-2 rounded"
          />
          <select
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            className="w-full border px-3 py-2 rounded"
          >
            <option value="">Tất cả địa điểm</option>
            {LOCATIONS.map((loc) => (
              <option key={loc} value={loc}>{loc}</option>
            ))}
          </select>
          <select
            value={minPrice}
            onChange={(e) => {
              const v = Number(e.target.value);
              setMinPrice(v);
              if (maxPrice !== 0 && v > maxPrice) setMaxPrice(v);
            }}
            className="w-full border px-3 py-2 rounded"
          >
            {PRICE_OPTIONS.map((p) => (
              <option key={`min-${p}`} value={p}>
                {p === 0 ? "Giá từ: 0" : p.toLocaleString("vi-VN")}
              </option>
            ))}
          </select>
          <select
            value={maxPrice}
            onChange={(e) => {
              const v = Number(e.target.value);
              setMaxPrice(v);
              if (v !== 0 && v < minPrice) setMinPrice(v);
            }}
            className="w-full border px-3 py-2 rounded"
          >
            {PRICE_OPTIONS.map((p) => (
              <option key={`max-${p}`} value={p}>
                {p === 0 ? "Đến: Không giới hạn" : p.toLocaleString("vi-VN")}
              </option>
            ))}
          </select>

          <div className="md:col-span-4 flex items-center gap-3 text-sm">
            <span className="text-gray-600">Đánh giá từ:</span>
            {RATINGS.map((r) => (
              <label key={r} className="flex items-center gap-1">
                <input type="radio" name="rating" onChange={() => setRating(r)} checked={rating === r} />
                <StarRow n={r} />
              </label>
            ))}
            <button onClick={() => setRating(null)} className="text-sky-600 underline ml-2">Xoá</button>
          </div>
        </div>

        {/* Grid: 6 items/trang (2 cột tablet, 3 cột desktop) */}
        {layoutGrid ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {pageItems.map((t) => (
              <TourCard key={t.id} tour={t} />
            ))}
          </div>
        ) : (
          <div className="space-y-4">
            {pageItems.map((t) => (
              <TourCard key={t.id} tour={t} />
            ))}
          </div>
        )}

        {/* Pagination */}
        <div className="mt-8 flex justify-center">
          <nav className="inline-flex items-center gap-2">
            <button
              onClick={() => go(page - 1)}
              disabled={page === 1}
              className={`px-3 py-1 rounded border ${page === 1 ? "opacity-50 cursor-not-allowed" : "hover:bg-gray-100"}`}
            >
              « Trước
            </button>

            {Array.from({ length: totalPages }).map((_, i) => {
              const p = i + 1;
              return (
                <button
                  key={p}
                  onClick={() => go(p)}
                  className={`px-3 py-1 rounded border ${p === page ? "bg-sky-600 text-white border-sky-600" : "hover:bg-gray-100"}`}
                >
                  {p}
                </button>
              );
            })}

            <button
              onClick={() => go(page + 1)}
              disabled={page === totalPages}
              className={`px-3 py-1 rounded border ${page === totalPages ? "opacity-50 cursor-not-allowed" : "hover:bg-gray-100"}`}
            >
              Sau »
            </button>
          </nav>
        </div>
      </div>
    </div>
  );
}

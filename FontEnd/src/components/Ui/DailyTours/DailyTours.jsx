import React, { useEffect, useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";

/* ====== DEMO DATA THEO ĐỊA ĐIỂM (đổi sang API sau) ====== */
const DATA = {
  "Đà Nẵng": [
    { id: 1, title: "Tour Núi Thần Tài 1 Ngày – Thư Giãn Suối Khoáng Nóng",
      img: "https://images.unsplash.com/photo-1519923041107-9d06f37cb072?w=1200&q=80",
      days: "1 ngày", location: "Đà Nẵng, Việt Nam", rating: 4.8,
      price: 940000, oldPrice: 1040000, featured: true },
    { id: 2, title: "Tour Bà Nà Hills: Hành Trình Khám Phá “Nóc Nhà Đà Nẵng”",
      img: "https://images.unsplash.com/photo-1526778548025-fa2f459cd5c1?w=1200&q=80",
      days: "1 ngày", location: "Đà Nẵng, Việt Nam", rating: 4.7,
      price: 1420000, oldPrice: 1520000, featured: true },
    { id: 3, title: "Tour 1 Ngày Sơn Trà – Ngũ Hành Sơn – Hội An",
      img: "https://images.unsplash.com/photo-1540573133985-87b6da6d54a9?w=1200&q=80",
      days: "1 ngày", location: "Đà Nẵng, Việt Nam", rating: 4.6,
      price: 590000, oldPrice: 690000, featured: true },
    { id: 4, title: "Khám Phá 1 Ngày VinWonders Nam Hội An",
      img: "https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=1200&q=80",
      days: "1 ngày", location: "Tp. Hội An, Quảng Nam, Việt Nam", rating: 4.6,
      price: 1400000, oldPrice: 1500000, featured: true },
    { id: 5, title: "City Tour Đà Nẵng 1 Ngày",
      img: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1200&q=80",
      days: "1 ngày", location: "Đà Nẵng, Việt Nam", rating: 4.8,
      price: 850000, oldPrice: 900000, featured: true },
  ],
  "Hội An": [
    { id: 11, title: "Hội An – Rừng Dừa Bảy Mẫu – Làng Gốm Thanh Hà",
      img: "https://images.unsplash.com/photo-1545569341-9eb8b30979d0?w=1200&q=80",
      days: "1 ngày", location: "Hội An, Việt Nam", rating: 4.6,
      price: 650000, oldPrice: 750000, featured: true },
    { id: 12, title: "Cù Lao Chàm Lặn Ngắm San Hô (cano cao tốc)",
      img: "https://images.unsplash.com/photo-1500375592092-40eb2168fd21?w=1200&q=80",
      days: "1 ngày", location: "Hội An, Việt Nam", rating: 4.7,
      price: 890000, oldPrice: 980000, featured: true },
  ],
  "Quy Nhơn": [
    { id: 21, title: "Kỳ Co – Eo Gió – Lặn ngắm san hô",
      img: "https://images.unsplash.com/photo-1482192505345-5655af888cc4?w=1200&q=80",
      days: "1 ngày", location: "Quy Nhơn, Việt Nam", rating: 4.7,
      price: 950000, oldPrice: 1050000, featured: true },
  ],
  "Phú Yên": [
    { id: 31, title: "Ghềnh Đá Dĩa – Bãi Xép – Đại Lãnh",
      img: "https://images.unsplash.com/photo-1502680390469-be75c86b636f?w=1200&q=80",
      days: "1 ngày", location: "Phú Yên, Việt Nam", rating: 4.6,
      price: 780000, oldPrice: 880000, featured: true },
  ],
  "Phú Quốc": [
    { id: 41, title: "Cáp treo Hòn Thơm – Công viên nước Aquatopia",
      img: "https://images.unsplash.com/photo-1500375592092-40eb2168fd21?w=1200&q=80",
      days: "1 ngày", location: "Phú Quốc, Việt Nam", rating: 4.8,
      price: 1250000, oldPrice: 1390000, featured: true },
  ],
};

const CITIES = Object.keys(DATA);

const Star = ({ className = "w-4 h-4" }) => (
  <svg viewBox="0 0 20 20" fill="currentColor" className={className}>
    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.955a1 1 0 00.95.69h4.162c.969 0 1.371 1.24.588 1.81l-3.37 2.448a1 1 0 00-.364 1.118l1.287 3.955c.3.92-.755 1.688-1.54 1.118L10 13.347l-3.998 2.674c-.784.57-1.84-.197-1.54-1.118l1.287-3.955a1 1 0 00-.364-1.118L1.016 9.382c-.783-.57-.38-1.81.588-1.81h4.162a1 1 0 00.95-.69L9.05 2.927z"/>
  </svg>
);

const fmt = (n) => (Number(n || 0)).toLocaleString("vi-VN") + "đ";

/* ---------------- Carousel core ---------------- */
export default function DailyTours({ autoMs = 5000 }) {
  const [tab, setTab] = useState(CITIES[0]);
  const [index, setIndex] = useState(0); // phần tử đầu tiên đang hiển thị
  const timer = useRef(null);
  const items = DATA[tab] || [];
  const visible = 4;
  const len = items.length;

  const next = () => setIndex((i) => (i + 1) % len);
  const prev = () => setIndex((i) => (i - 1 + len) % len);

  useEffect(() => { setIndex(0); }, [tab]);

  useEffect(() => {
    if (len <= visible) return;
    timer.current = setInterval(next, autoMs);
    return () => clearInterval(timer.current);
  }, [autoMs, len, tab]);

  const view = useMemo(() => {
    if (!len) return [];
    const out = [];
    for (let i = 0; i < Math.min(visible, len); i++) {
      out.push(items[(index + i) % len]);
    }
    return out;
  }, [index, items, len]);

  return (
    <section className="mt-12">
      {/* Header */}
      <div className="text-center mb-2">
        <h2 className="text-3xl md:text-4xl font-extrabold text-sky-600">Daily Tour</h2>
        <p className="text-gray-600">
          Với các chùm tour du lịch hấp dẫn, luôn mang lại những chuyến du lịch tốt nhất
        </p>
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap items-center justify-center gap-6 font-semibold text-gray-500 mt-3">
        {CITIES.map((c) => (
          <button
            key={c}
            onClick={() => setTab(c)}
            className={`pb-1 ${tab === c ? "text-sky-600 border-b-2 border-sky-600" : "hover:text-sky-600"}`}
          >
            {c.toUpperCase()}
          </button>
        ))}
      </div>

      {/* Arrows */}
      <div className="flex gap-2 justify-end pr-2 mt-4">
        <button onClick={prev} className="w-9 h-9 rounded-full border bg-white hover:bg-gray-50">‹</button>
        <button onClick={next} className="w-9 h-9 rounded-full border bg-white hover:bg-gray-50">›</button>
      </div>

      {/* Cards */}
      <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 mt-2">
        {view.map((t) => (
          <article key={t.id} className="bg-white rounded-2xl border border-sky-100 shadow-[0_4px_24px_rgba(0,0,0,.06)] overflow-hidden">
            <div className="relative h-56">
              <img src={t.img} alt={t.title} className="w-full h-full object-cover" />
              {t.featured && (
                <span className="absolute top-2 left-2 bg-sky-500 text-white text-xs px-2 py-1 rounded-md shadow">Nổi bật</span>
              )}
              <button className="absolute top-2 right-2 bg-white/90 rounded-full p-1.5 shadow">
                <svg viewBox="0 0 24 24" fill="none" className="w-6 h-6">
                  <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78Z"
                        stroke="currentColor" strokeWidth="1.6" className="text-black/60" />
                </svg>
              </button>
              <span className="absolute -bottom-3 left-4 text-rose-600 bg-rose-50 border border-rose-200 rounded-full px-3 py-1 text-xs">
                {t.days}
              </span>
            </div>

            <div className="p-4">
              <h3 className="font-semibold leading-snug line-clamp-2">{t.title}</h3>

              {/* location + rating */}
              <div className="mt-2 flex items-center gap-2 text-sm text-gray-600">
                <span className="inline-flex items-center gap-1">
                  <svg viewBox="0 0 24 24" fill="none" className="w-4 h-4">
                    <path d="M12 21s-7-5.686-7-11a7 7 0 1114 0c0 5.314-7 11-7 11z" stroke="currentColor" strokeWidth="1.5"/>
                    <circle cx="12" cy="10" r="2.5" stroke="currentColor" strokeWidth="1.5"/>
                  </svg>
                  {t.location}
                </span>
              </div>

              <div className="mt-1 text-amber-500 inline-flex items-center gap-1">
                <Star /><Star /><Star /><Star />
                <span className="text-gray-600 ml-1">{t.rating.toFixed(1)}</span>
              </div>

              {/* price + button */}
              <div className="mt-3 flex items-end justify-between">
                <div>
                  <div className="text-pink-600 font-extrabold text-lg">{fmt(t.price)}</div>
                  {t.oldPrice && (
                    <div className="text-gray-400 line-through text-sm -mt-0.5">{fmt(t.oldPrice)}</div>
                  )}
                </div>
                <Link
                  to="/tours"
                  className="px-4 py-2 bg-sky-600 text-white rounded-lg hover:bg-sky-700 text-sm"
                >
                  Khám phá
                </Link>
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

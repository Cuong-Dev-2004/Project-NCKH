// src/components/Ui/CarouselTours.jsx
import React, { useEffect, useState, useRef } from "react";
import { Link } from "react-router-dom";

function PrevIcon() {
  return (
    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" aria-hidden>
      <path d="M15 18l-6-6 6-6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
function NextIcon() {
  return (
    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" aria-hidden>
      <path d="M9 6l6 6-6 6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function TourCardInline({ item }) {
  return (
    <article className="h-full bg-white rounded-lg shadow-lg overflow-hidden flex flex-col" aria-label={item.name}>
      <div className="relative">
        <img src={item.image || "https://via.placeholder.com/400x240"} alt={item.name} className="w-full h-44 object-cover" />
        {item.badge && (
          <div className="absolute top-3 left-3 bg-blue-500 text-white text-xs px-3 py-1 rounded-full font-semibold">
            {item.badge}
          </div>
        )}
        <button className="absolute top-3 right-3 bg-white/90 p-2 rounded-full shadow" aria-label="Yêu thích">
          <svg className="w-5 h-5 text-pink-500" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
            <path d="M12 21s-7.5-4.35-10-7.25C-1 7.75 4.5 4 7.5 6.5 9.2 7.9 12 10 12 10s2.8-2.1 4.5-3.5C19.5 4 25 7.75 22 13.75 19.5 16.65 12 21 12 21z" />
          </svg>
        </button>
        {item.duration && (
          <div className="absolute bottom-3 left-3 bg-white px-3 py-1 rounded-md text-sm font-medium shadow-sm">
            <svg className="inline-block w-4 h-4 mr-1" viewBox="0 0 24 24" fill="none" stroke="currentColor" aria-hidden>
              <path d="M12 7v6l4 2" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              <circle cx="12" cy="12" r="9" strokeWidth="1.5" />
            </svg>
            <span className="text-black">{item.duration}</span>
          </div>
        )}
      </div>

      <div className="p-4 flex-1 flex flex-col">
        <h3 className="text-base font-semibold text-black mb-2">{item.name}</h3>
        <p className="text-sm text-gray-600 mb-3 line-clamp-2">{item.short}</p>

        <div className="mt-auto">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-xl font-bold text-black">{item.price}</div>
              {item.oldPrice && <div className="text-sm line-through text-gray-400">{item.oldPrice}</div>}
            </div>

            <div className="text-right">
              <div className="text-sm text-black">{item.location}</div>
              <div className="flex items-center justify-end mt-2 gap-2">
                <div className="flex items-center text-yellow-500 text-sm">
                  <svg className="w-4 h-4 inline-block" viewBox="0 0 20 20" fill="currentColor" aria-hidden>
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.955a1 1 0 00.95.69h4.162c.969 0 1.371 1.24.588 1.81l-3.37 2.448a1 1 0 00-.364 1.118l1.287 3.955c.3.92-.755 1.688-1.54 1.118L10 13.347l-3.998 2.674c-.784.57-1.84-.197-1.54-1.118l1.287-3.955a1 1 0 00-.364-1.118L1.016 9.382c-.783-.57-.38-1.81.588-1.81h4.162a1 1 0 00.95-.69L9.05 2.927z" />
                  </svg>
                  <span className="ml-1 font-semibold text-black">{item.rating ?? "-"}</span>
                </div>

                <Link to={`/tours/${item.id ?? ""}`} className="inline-block bg-blue-500 text-white text-sm px-4 py-2 rounded-md shadow hover:bg-blue-600" aria-label={`Xem ${item.name}`}>
                  Khám phá
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </article>
  );
}

export default function CarouselTours({ data = [], title = "Danh sách tours" }) {
  const [itemsPerPage, setItemsPerPage] = useState(4);
  const [page, setPage] = useState(0);
  const containerRef = useRef(null);

  // touch handling
  const touchStartX = useRef(0);
  const touchDeltaX = useRef(0);

  useEffect(() => {
    function calc() {
      const w = window.innerWidth;
      if (w >= 1200) setItemsPerPage(4);
      else if (w >= 992) setItemsPerPage(4);
      else if (w >= 768) setItemsPerPage(3);
      else if (w >= 640) setItemsPerPage(2);
      else setItemsPerPage(1);
    }
    calc();
    window.addEventListener("resize", calc);
    return () => window.removeEventListener("resize", calc);
  }, []);

  // clamp page when itemsPerPage or data length changes
  useEffect(() => {
    const total = Math.max(1, Math.ceil(data.length / itemsPerPage));
    setPage((p) => Math.min(p, total - 1));
  }, [itemsPerPage, data.length]);

  // keyboard navigation
  useEffect(() => {
    function onKey(e) {
      if (e.key === "ArrowLeft") prev();
      if (e.key === "ArrowRight") next();
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [itemsPerPage, data.length, page]);

  const totalPages = Math.max(1, Math.ceil(data.length / itemsPerPage));

  function prev() {
    setPage((p) => Math.max(0, p - 1));
  }
  function next() {
    setPage((p) => Math.min(totalPages - 1, p + 1));
  }

  // touch handlers for mobile swipe
  function handleTouchStart(e) {
    touchStartX.current = e.touches?.[0]?.clientX ?? 0;
    touchDeltaX.current = 0;
  }
  function handleTouchMove(e) {
    const x = e.touches?.[0]?.clientX ?? 0;
    touchDeltaX.current = x - touchStartX.current;
  }
  function handleTouchEnd() {
    const threshold = 50; // px
    if (touchDeltaX.current > threshold) {
      prev();
    } else if (touchDeltaX.current < -threshold) {
      next();
    }
    touchDeltaX.current = 0;
  }

  if (!data || data.length === 0) {
    return null;
  }

  return (
    <section className="mt-12" aria-roledescription="carousel">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between mb-4">
          <div>
            {title && <h2 className="text-2xl font-bold text-black">{title}</h2>}
            <p className="text-sm text-gray-600">Trải nghiệm tour dịch vụ chất lượng cùng các điểm đến hấp dẫn</p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={prev}
              aria-label="Previous"
              className={`w-9 h-9 rounded-full border border-gray-300 flex items-center justify-center ${page === 0 ? "opacity-40 cursor-not-allowed" : "hover:bg-gray-100"}`}
              disabled={page === 0}
            >
              <PrevIcon />
            </button>

            <button
              onClick={next}
              aria-label="Next"
              className={`w-9 h-9 rounded-full border border-gray-300 flex items-center justify-center ${page === totalPages - 1 ? "opacity-40 cursor-not-allowed" : "hover:bg-gray-100"}`}
              disabled={page === totalPages - 1}
            >
              <NextIcon />
            </button>
          </div>
        </div>

        <div className="relative" onTouchStart={handleTouchStart} onTouchMove={handleTouchMove} onTouchEnd={handleTouchEnd}>
          <div className="overflow-hidden">
            <div
              ref={containerRef}
              className="flex transition-transform duration-500"
              style={{ transform: `translateX(-${page * 100}%)` }}
              role="list"
            >
              {data.map((item, idx) => (
                <div
                  key={item.id ?? idx}
                  style={{ flex: `0 0 ${100 / itemsPerPage}%`, padding: "0 0.75rem" }}
                  className="box-border"
                  role="listitem"
                >
                  <TourCardInline item={item} />
                </div>
              ))}
            </div>
          </div>

          {/* dots */}
          <div className="mt-4 flex justify-center gap-2" role="tablist" aria-label="Pagination">
            {Array.from({ length: totalPages }).map((_, i) => (
              <button
                key={i}
                onClick={() => setPage(i)}
                className={`w-2.5 h-2.5 rounded-full ${i === page ? "bg-black" : "bg-gray-300"}`}
                aria-label={`Go to page ${i + 1}`}
                aria-selected={i === page}
                role="tab"
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

// src/Pages/CityTourDetail/TourDetailLayout.jsx
import { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useCart } from "../../utils/cartContext.jsx";
import { vnd } from "../../utils/money";

const TABS = [
  { key: "desc", label: "MÔ TẢ" },
  { key: "inc",  label: "BAO GỒM/LOẠI TRỪ" },
  { key: "plan", label: "CHƯƠNG TRÌNH TOUR" },
  { key: "kid",  label: "GIÁ VÉ TRẺ EM" },
  { key: "rv",   label: "ĐÁNH GIÁ" },
];

export default function TourDetailLayout() {
  const { state } = useLocation();
  const navigate = useNavigate();
  const { add } = useCart();

  // ===== DATA (đọc dưới dạng props.xxx) =====
  const props = useMemo(() => {
    const s = state?.propData || {};
    return {
      id: s.id ?? 0,
      name: s.name ?? "Chi tiết tour",
      locationText: s.locationText ?? "Việt Nam",
      price: Number(s.price ?? 0),
      oldPrice: Number(s.oldPrice ?? 0),
      duration: s.duration ?? 1,
      capacity: s.capacity ?? 25,
      minAge: s.minAge ?? "10+",
      pickup: s.pickup ?? "Khách sạn trung tâm",
      images: (Array.isArray(s.images) && s.images.length
        ? s.images
        : [
            "https://picsum.photos/id/1015/1200/800",
            "https://picsum.photos/id/1016/1200/800",
            "https://picsum.photos/id/1018/1200/800",
            "https://picsum.photos/id/1019/1200/800",
            "https://picsum.photos/id/1022/1200/800",
          ]),
      data1: Array.isArray(s.data1) ? s.data1 : [],
      include: s.include || [
        "Hướng dẫn viên địa phương",
        "Xe đưa đón theo lịch trình",
        "Vé tham quan theo chương trình",
        "01 chai nước suối/người",
      ],
      exclude: s.exclude || [
        "Ăn uống ngoài chương trình",
        "Chi phí cá nhân, tip",
        "Thuế VAT (nếu xuất hoá đơn)",
      ],
      plan:
        s.itinerary || [
          "Đón khách – tham quan điểm A, B, C",
          "Trải nghiệm ẩm thực – khám phá điểm D, E",
          "Mua sắm – tiễn khách",
        ],
      kid:
        s.childPolicy || [
          "Dưới 5 tuổi: miễn phí, chung giường",
          "5–9 tuổi: 70% giá người lớn",
          "Từ 10 tuổi: tính giá người lớn",
        ],
      rating: s.rating ?? 5,
    };
  }, [state?.propData]);

  // ===== UI state =====
  const [tab, setTab] = useState("desc");
  const [active, setActive] = useState(0);
  const [qty, setQty] = useState(1);
  const [date, setDate] = useState("");
  const [errMsg, setErrMsg] = useState("");

  // Lightbox
  const [isLB, setIsLB] = useState(false);
  const openLB = (idx = 0) => { setActive(idx); setIsLB(true); };
  const closeLB = () => setIsLB(false);

  useEffect(() => {
    if (!isLB) return;
    const onKey = (e) => {
      if (e.key === "Escape") closeLB();
      if (e.key === "ArrowRight") next();
      if (e.key === "ArrowLeft") prev();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [isLB]); // eslint-disable-line react-hooks/exhaustive-deps

  const total = (props.price || 0) * (qty || 0);
  const last = props.images.length - 1;
  const prev = () => setActive((i) => (i === 0 ? last : i - 1));
  const next = () => setActive((i) => (i === last ? 0 : i + 1));

  const handleBook = () => {
    if (!date) {
      setErrMsg("Vui lòng chọn ngày khởi hành.");
      return;
    }
    setErrMsg("");
    add(
      { id: props.id || Date.now(), name: props.name, price: props.price, img: props.images?.[0] },
      { qty, checkIn: date, adults: qty }
    );
    navigate("/gio_hang");
  };

  return (
    <div className="bg-[#fafafa]">
      {/* KHÔNG có header sticky hiển thị giá */}

      <div className="mx-auto max-w-7xl px-4 md:px-6 py-6">
        {/* Title */}
        <div className="mb-5">
          <h1 className="text-2xl md:text-[28px] font-bold tracking-tight">
            {props.name}
          </h1>
          <div className="mt-1 text-sm text-gray-500">
            Du lịch • {props.locationText} • Việt Nam
          </div>
        </div>

        {/* 2 cột */}
        <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_360px] gap-6 items-start">
          {/* LEFT */}
          <section>
            {/* Gallery (KHÔNG border) */}
            <div className="relative rounded-xl overflow-hidden bg-white shadow-sm">
              <button
                onClick={() => openLB(active)}
                className="absolute left-3 top-3 z-10 text-xs px-2.5 py-1 rounded-full bg-white/90 shadow hover:bg-white"
                aria-label="Xem tất cả ảnh"
              >
                {props.images.length} Hình ảnh
              </button>

              <img
                src={props.images[active]}
                alt={`img-${active}`}
                className="w-full aspect-[16/9] object-cover cursor-zoom-in"
                onClick={() => openLB(active)}
              />
              <button
                onClick={prev}
                className="absolute left-3 top-1/2 -translate-y-1/2 grid place-items-center h-9 w-9 rounded-full bg-white/90 shadow hover:bg-white"
                aria-label="Prev"
              >
                ‹
              </button>
              <button
                onClick={next}
                className="absolute right-3 top-1/2 -translate-y-1/2 grid place-items-center h-9 w-9 rounded-full bg-white/90 shadow hover:bg-white"
                aria-label="Next"
              >
                ›
              </button>
            </div>

            {/* Thumbnails (KHÔNG border) */}
            <div className="mt-3 grid grid-cols-5 gap-2">
              {props.images.map((src, i) => (
                <button
                  key={i}
                  onClick={() => setActive(i)}
                  className={`group relative rounded-lg overflow-hidden ${
                    active === i ? "ring-2 ring-sky-500" : ""
                  }`}
                  aria-label={`thumb-${i}`}
                >
                  <img
                    src={src}
                    alt={`thumb-${i}`}
                    className="h-20 w-full object-cover group-hover:opacity-95"
                  />
                </button>
              ))}
            </div>

            {/* Info strip (KHÔNG border) */}
            <div className="mt-5 rounded-xl bg-white shadow-sm">
              <div className="grid sm:grid-cols-4 gap-6 p-5">
                <Info title="Thời gian" value={`${props.duration} ngày`} />
                <Info title="Số lượng" value={String(props.capacity)} />
                <Info title="Độ tuổi"  value={props.minAge} />
                <Info title="Đón tại"   value={props.pickup} />
              </div>
            </div>

            {/* Tabs – pill, rực rỡ, KHÔNG viền */}
            <div className="mt-6 rounded-2xl bg-white shadow-sm">
              {/* NAV tabs */}
              <div className="flex flex-wrap gap-3 px-4 pt-4">
                {TABS.map((t) => (
                  <button
                    key={t.key}
                    onClick={() => setTab(t.key)}
                    className={`px-4 py-2 text-sm font-semibold rounded-full transition ${
                      tab === t.key
                        ? "bg-rose-600 text-white shadow-sm"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
                  >
                    {t.label}
                  </button>
                ))}
              </div>

              {/* BODY */}
              <div className="p-6">
                {tab === "desc" && (
                  <div>
                    <p className="font-semibold text-gray-800 mb-3">
                      Với tour tại {props.locationText} bạn sẽ được trải nghiệm:
                    </p>
                    <ul className="pl-6 space-y-2 text-gray-800">
                      {(props.data1.length ? props.data1 : [
                        "Khám phá điểm đến nổi bật, trải nghiệm văn hoá – ẩm thực.",
                        "Lịch trình tinh gọn, tối ưu thời gian di chuyển.",
                        "Hướng dẫn viên thân thiện, hỗ trợ tận tâm.",
                      ]).map((x, i) => (
                        <li key={i} className="relative">
                          <span className="before:content-['•'] before:text-sky-500 before:mr-2" />
                          {x}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {tab === "inc" && (
                  <div className="grid md:grid-cols-2 gap-8">
                    <div>
                      <div className="font-semibold text-gray-800 mb-2">ĐÃ BAO GỒM</div>
                      <ul className="pl-6 space-y-2 text-gray-800">
                        {props.include.map((x, i) => (
                          <li key={i}>
                            <span className="before:content-['•'] before:text-emerald-500 before:mr-2" />
                            {x}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <div className="font-semibold text-gray-800 mb-2">CHƯA BAO GỒM</div>
                      <ul className="pl-6 space-y-2 text-gray-800">
                        {props.exclude.map((x, i) => (
                          <li key={i}>
                            <span className="before:content-['•'] before:text-rose-500 before:mr-2" />
                            {x}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                )}

                {tab === "plan" && (
                  <div>
                    <div className="font-semibold text-gray-800 mb-3">TÓM TẮT LỊCH TRÌNH</div>
                    <ol className="pl-6 space-y-3 text-gray-800">
                      {props.plan.map((x, i) => (
                        <li key={i} className="relative">
                          <span className="before:content-['•'] before:text-sky-500 before:mr-2" />
                          <span className="font-semibold">Ngày {i + 1}:</span>{" "}
                          {x.replace(/^Ngày\s*\d+:\s*/i, "")}
                        </li>
                      ))}
                    </ol>
                  </div>
                )}

                {tab === "kid" && (
                  <div>
                    <div className="font-semibold text-gray-800 mb-2">CHÍNH SÁCH TRẺ EM</div>
                    <ul className="pl-6 space-y-2 text-gray-800">
                      {props.kid.map((x, i) => (
                        <li key={i}>
                          <span className="before:content-['•'] before:text-violet-500 before:mr-2" />
                          {x}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {tab === "rv" && (
                  <div className="text-gray-700">
                    Chưa có đánh giá. Hãy là người đầu tiên trải nghiệm <b>{props.name}</b>!
                  </div>
                )}
              </div>
            </div>
          </section>

          {/* RIGHT – BOOKING CARD (KHÔNG border) */}
          <aside className="lg:sticky lg:top-20">
            <div className="rounded-2xl bg-white shadow-sm p-5">
              <div className="flex items-end gap-2 mb-2">
                <div className="text-[28px] font-extrabold leading-none text-rose-600">
                  {vnd(props.price)}
                </div>
                {!!props.oldPrice && (
                  <div className="text-sm text-gray-400 line-through">
                    {vnd(props.oldPrice)}
                  </div>
                )}
              </div>

              <div className="text-xs font-semibold uppercase tracking-wide mb-2 text-gray-700">
                Đặt tour
              </div>

              <label className="block text-xs font-medium text-gray-700 mb-1">
                Check in
              </label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full rounded-lg px-3 py-2 text-sm mb-3 focus:ring-2 focus:ring-sky-400 focus:border-sky-400 outline-none border border-gray-200"
              />
              {errMsg && <div className="text-xs text-rose-600 mb-2">{errMsg}</div>}

              <label className="block text-xs font-medium text-gray-700 mb-1">
                Số lượng
              </label>
              <div className="flex mb-3">
                <button
                  onClick={() => setQty((q) => Math.max(1, q - 1))}
                  className="px-3 border border-gray-200 rounded-l-lg hover:bg-gray-50"
                >
                  −
                </button>
                <input
                  type="number"
                  min={1}
                  value={qty}
                  onChange={(e) =>
                    setQty(Math.max(1, Number(e.target.value) || 1))
                  }
                  className="w-full text-center border-y border-gray-200 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-sky-400"
                />
                <button
                  onClick={() => setQty((q) => q + 1)}
                  className="px-3 border border-gray-200 rounded-r-lg hover:bg-gray-50"
                >
                  +
                </button>
              </div>

              <div className="flex justify-between items-center text-sm text-gray-700 mb-4">
                <span>Tổng tiền</span>
                <b className="text-base text-gray-900">{vnd(total)}</b>
              </div>

              <button
                onClick={handleBook}
                disabled={!date}
                className={`w-full h-11 rounded-lg text-white text-sm font-semibold transition ${
                  date
                    ? "bg-rose-600 hover:brightness-110 active:translate-y-px"
                    : "bg-gray-300 cursor-not-allowed"
                }`}
              >
                Đặt ngay
              </button>

              {/* Promo nhỏ (KHÔNG border) */}
              <div className="mt-5 rounded-xl overflow-hidden">
                <img
                  src={
                    props.images[1] || "https://picsum.photos/id/1022/640/360"
                  }
                  alt="promo"
                  className="w-full h-28 object-cover"
                />
                <div className="p-3">
                  <div className="text-sm font-semibold">
                    Bà Nà và những điều chưa biết
                  </div>
                  <button
                    onClick={() =>
                      window.scrollTo({ top: 0, behavior: "smooth" })
                    }
                    className="mt-2 inline-block px-3 py-1 text-xs rounded bg-sky-600 text-white hover:brightness-110"
                  >
                    Xem ngay
                  </button>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </div>

      {/* ===== LIGHTBOX ===== */}
      {isLB && (
        <div
          className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={closeLB}
        >
          <div
            className="relative max-w-6xl w-full"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={props.images[active]}
              alt={`lb-${active}`}
              className="w-full max-h-[80vh] object-contain rounded-lg"
            />

            {/* Close */}
            <button
              onClick={closeLB}
              className="absolute -top-10 right-0 text-white/90 hover:text-white text-xl"
              aria-label="Close"
            >
              ✕
            </button>

            {/* Prev / Next */}
            <button
              onClick={prev}
              className="absolute left-0 top-1/2 -translate-y-1/2 h-10 w-10 grid place-items-center rounded-full bg-white/90 hover:bg-white"
              aria-label="Prev"
            >
              ‹
            </button>
            <button
              onClick={next}
              className="absolute right-0 top-1/2 -translate-y-1/2 h-10 w-10 grid place-items-center rounded-full bg-white/90 hover:bg-white"
              aria-label="Next"
            >
              ›
            </button>

            {/* Thumbs trong lightbox */}
            <div className="mt-3 grid grid-cols-6 md:grid-cols-10 gap-2">
              {props.images.map((src, i) => (
                <button
                  key={i}
                  onClick={() => setActive(i)}
                  className={`rounded-md overflow-hidden ${
                    active === i ? "ring-2 ring-rose-500" : ""
                  }`}
                >
                  <img
                    src={src}
                    alt={`lb-thumb-${i}`}
                    className="h-16 w-full object-cover"
                  />
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function Info({ title, value }) {
  return (
    <div className="flex items-start gap-3">
      <div className="h-7 w-7 shrink-0 rounded-full bg-sky-50 text-sky-600 grid place-items-center text-sm">

      </div>
      <div>
        <div className="font-semibold">{title}</div>
        <div className="text-gray-600 text-sm">{value}</div>
      </div>
    </div>
  );
}

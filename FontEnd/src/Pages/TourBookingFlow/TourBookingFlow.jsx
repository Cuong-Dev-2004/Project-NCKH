// src/Pages/TourBookingFlow/TourBookingFlow.jsx
import { useEffect, useMemo, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import NavDown from "../../components/Ui/NavDownTourBookingFlow/index.jsx";
import guidesAllRaw from "../../data/guides.js";
import { vnd } from "../../utils/money.js";
import { useCart } from "../../utils/cartContext.jsx"; // ✅ NEW

/* ======= PHỤ PHÍ GÓI TOUR THEO ID ======= */
const PACKAGE_FEES = {
  1: 100000, 2: 120000, 3: 80000, 4: 90000, 5: 110000,
  6: 95000, 7: 85000, 8: 70000, 9: 105000, 10: 60000,
  11: 100000, 12: 130000, 13: 90000, 14: 150000, 15: 95000,
};

/* -------------------- HELPERS -------------------- */
function countDaysInclusive(startDate, endDate) {
  if (!startDate) return 1;
  const s = new Date(startDate);
  const e = new Date(endDate || startDate);
  const ONE = 24 * 60 * 60 * 1000;
  return Math.max(1, Math.round((e - s) / ONE) + 1);
}

// Thuế chỉ tính trên HOA HỒNG
function calcTotal({
  basePrice,
  qty,
  people = 1,
  extraRatePerPerson = 0.1,
  commissionRate = 0.2,
  platformFee = 0,
  taxRate = 0,
  packageFee = 0,
}) {
  const subtotal = (Number(basePrice) || 0) * (Number(qty) || 0);          // giá HDV * số ngày
  const extraPeopleCount = Math.max(0, Number(people || 1) - 1);
  const extraPeopleFee = subtotal * (Number(extraRatePerPerson) || 0) * extraPeopleCount;

  const commission = (subtotal + extraPeopleFee) * (Number(commissionRate) || 0);
  const pf = Number(platformFee) || 0;
  const taxBase = commission;
  const tax = taxBase * (Number(taxRate) || 0);

  const total = subtotal + extraPeopleFee + commission + pf + tax + (Number(packageFee) || 0);
  return {
    subtotal,
    extraPeopleFee,
    commission,
    platformFee: pf,
    tax,
    packageFee: Number(packageFee) || 0,
    total,
    extraPeopleCount,
  };
}
/* ------------------------------------------------- */

export default function TourBookingFlow() {
  const navigate = useNavigate();
  const locationHook = useLocation();
  const { add } = useCart(); // ✅ NEW
  const qs = useMemo(() => new URLSearchParams(locationHook.search), [locationHook.search]);

  // Từ Booking / Query
  const tourIdFromBooking = useMemo(() => Number(qs.get("tourId") || 0), [qs]);
  const tourTitleFromBooking = useMemo(() => qs.get("tourTitle") || "", [qs]);

  const [filters, setFilters] = useState({
    location: qs.get("destination") || "",
    language: qs.get("language") || "",
    style: qs.get("guideStyle") || "",
    startDate: qs.get("startDate") || "",
    endDate: qs.get("endDate") || "",
    people: Number(qs.get("people") || 1),
  });

  const [miniForm, setMiniForm] = useState({
    fullName: qs.get("name") || "",
    phone: qs.get("phone") || "",
    startDate: qs.get("startDate") || "",
    endDate: qs.get("endDate") || "",
    notes: qs.get("notes") || "",
  });

  // Chính sách giá
  const priceCfg = {
    commissionRate: 0.2,
    platformFee: 0,
    taxRate: 0,
    extraRatePerPerson: 0.1,
  };

  // Phụ phí gói theo tourId
  const packageFee = useMemo(() => PACKAGE_FEES[tourIdFromBooking] || 0, [tourIdFromBooking]);

  // Ép tất cả HDV sang "ngày"
  const guidesAll = useMemo(
    () => guidesAllRaw.map(g => ({ ...g, priceType: "ngày" })),
    []
  );

  // Bộ lọc + phân trang
  const [renderGuides, setRenderGuides] = useState(guidesAll);
  const [selectedGuide, setSelectedGuide] = useState(null);

  const [page, setPage] = useState(1);
  const PER_PAGE = 6;

  const resetFilters = () => {
    setFilters((s) => ({ ...s, location: "", language: "", style: "" }));
    setPage(1);
  };
  const hasFilter = !!(filters.location || filters.language || filters.style);

  useEffect(() => {
    let filtered = guidesAll;
    if (filters.location) filtered = filtered.filter((g) => g.location === filters.location);
    if (filters.language) filtered = filtered.filter((g) => g.language === filters.language);
    if (filters.style) filtered = filtered.filter((g) => g.style === filters.style);
    setRenderGuides(filtered);
    setPage(1);
  }, [filters, guidesAll]);

  const totalPages = Math.max(1, Math.ceil(renderGuides.length / PER_PAGE));
  const pagedGuides = useMemo(() => {
    const start = (page - 1) * PER_PAGE;
    return renderGuides.slice(start, start + PER_PAGE);
  }, [renderGuides, page]);

  const onPickGuide = (guide) => {
    setSelectedGuide(guide);
    setFilters((s) => ({
      ...s,
      location: s.location || guide.location,
      language: s.language || guide.language,
      style: s.style || guide.style,
    }));
  };

  // Số lượng NGÀY
  const qty = useMemo(() => {
    if (!selectedGuide) return 0;
    return countDaysInclusive(miniForm.startDate || filters.startDate, miniForm.endDate || filters.endDate);
  }, [selectedGuide, miniForm.startDate, miniForm.endDate, filters.startDate, filters.endDate]);

  const money = useMemo(() => {
    if (!selectedGuide)
      return {
        subtotal: 0, extraPeopleFee: 0, commission: 0, platformFee: 0, tax: 0,
        packageFee, total: packageFee, extraPeopleCount: 0,
      };
    return calcTotal({
      basePrice: selectedGuide.price,
      qty,
      people: filters.people,
      extraRatePerPerson: priceCfg.extraRatePerPerson,
      commissionRate: priceCfg.commissionRate,
      platformFee: priceCfg.platformFee,
      taxRate: priceCfg.taxRate,
      packageFee,
    });
  }, [selectedGuide, qty, filters.people, priceCfg, packageFee]);

  // ✅ NEW: thêm vào giỏ + chuyển tới giỏ hàng
  const addToCart = () => {
    if (!selectedGuide) return;
    const start = miniForm.startDate || filters.startDate;
    const end = miniForm.endDate || filters.endDate;
    if (!start || !end) {
      alert("Vui lòng chọn ngày bắt đầu và kết thúc.");
      return;
    }
    const key = `${tourIdFromBooking || "tour"}-${selectedGuide.id}-${Date.now()}`;

    // Item chính là gói theo HDV (đơn vị: ngày), giá = giá HDV (đã tính theo ngày)
    add({
      key,
      id: selectedGuide.id,
      tourId: tourIdFromBooking || selectedGuide.id,
      name: tourTitleFromBooking
        ? `${tourTitleFromBooking} • HDV ${selectedGuide.name}`
        : `HDV ${selectedGuide.name}`,
      img: selectedGuide.image,
      price: selectedGuide.price,      // đơn giá / ngày
      qty: qty,                        // số ngày
      meta: {
        checkIn: start,
        checkOut: end,
        adults: filters.people,
        customerName: miniForm.fullName,
        phone: miniForm.phone,
        email: "",                     // có thể bổ sung ở bước sau
        note: miniForm.notes,
        guideId: selectedGuide.id,
        guideName: selectedGuide.name,
        guideLocation: selectedGuide.location,
        guideLanguage: selectedGuide.language,
        guideStyle: selectedGuide.style,
        priceType: "ngày",
        // Lưu thêm các phần đã tính (để hiển thị/đối chiếu ở cart hoặc admin)
        breakdown: {
          subtotal: money.subtotal,
          extraPeopleFee: money.extraPeopleFee,
          commission: money.commission,
          platformFee: money.platformFee,
          tax: money.tax,
          packageFee: money.packageFee,
          total: money.total,
          commissionRate: priceCfg.commissionRate,
          taxRate: priceCfg.taxRate,
          extraRatePerPerson: priceCfg.extraRatePerPerson,
        },
        packageFee, // biết là có tính phụ phí của gói tour
        tourTitle: tourTitleFromBooking || "",
        tourId: tourIdFromBooking || "",
      },
    });

    // Thêm phụ phí gói tour như một dòng riêng (nếu muốn tách)
    if (packageFee > 0) {
      add({
        key: `${key}-pkg`,
        id: `pkg-${tourIdFromBooking || "0"}`,
        name: `Phụ phí gói tour ${tourTitleFromBooking || `#${tourIdFromBooking}`}`,
        img: "https://picsum.photos/seed/package/120/120",
        price: packageFee,
        qty: 1,
        meta: {
          type: "packageFee",
          tourId: tourIdFromBooking || "",
          tourTitle: tourTitleFromBooking || "",
        },
      });
    }

    navigate("/gio_hang");
  };

  const goConfirm = () => {
    // Giữ lại trang confirm (nếu anh vẫn muốn flow 2 bước)
    const query = new URLSearchParams({
      tab: "confirm",
      destination: filters.location || "",
      language: filters.language || "",
      guideStyle: filters.style || "",
      startDate: miniForm.startDate || filters.startDate || "",
      endDate: miniForm.endDate || filters.endDate || "",
      people: String(filters.people || 1),

      tourId: tourIdFromBooking ? String(tourIdFromBooking) : "",
      tourTitle: tourTitleFromBooking || "",

      guideId: selectedGuide ? String(selectedGuide.id) : "",
      guideName: selectedGuide ? selectedGuide.name : "",
      guideLocation: selectedGuide ? selectedGuide.location : "",
      guideLanguage: selectedGuide ? selectedGuide.language : "",
      guideStyleChosen: selectedGuide ? selectedGuide.style : "",
      guidePrice: selectedGuide ? String(selectedGuide.price) : "",
      guidePriceType: "ngày",

      name: miniForm.fullName || "",
      phone: miniForm.phone || "",
      notes: miniForm.notes || "",

      qty: String(qty || 0),
      subtotal: String(money.subtotal || 0),
      extraPeopleFee: String(money.extraPeopleFee || 0),
      commission: String(money.commission || 0),
      platformFee: String(money.platformFee || 0),
      tax: String(money.tax || 0),
      packageFee: String(money.packageFee || 0),
      total: String(money.total || 0),

      commissionRate: String(priceCfg.commissionRate),
      taxRate: String(priceCfg.taxRate),
      extraRatePerPerson: String(priceCfg.extraRatePerPerson),
    }).toString();

    navigate(`/tour-booking-flow?${query}`);
  };

  return (
    <section className="w-full bg-gray-50 py-10 text-black min-h-[500px]">
      <div className="px-6 md:px-9">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold">Chọn hướng dẫn viên theo địa phương</h2>
            {(tourIdFromBooking || tourTitleFromBooking) && (
              <div className="text-sm text-gray-600 mt-1">
                Gói tour: <b>{tourTitleFromBooking || `#${tourIdFromBooking}`}</b>
                {packageFee > 0 && <> • Phụ phí gói: <b>{vnd(packageFee)}</b></>}
              </div>
            )}
          </div>
          <span className="text-sm text-gray-600">
            Tìm thấy <b>{renderGuides.length}</b> hướng dẫn viên phù hợp
          </span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* List + filters */}
          <div className="lg:col-span-8">
            <div className="flex flex-wrap items-end gap-3 mb-4">
              <NavDown
                data={[...new Set(guidesAll.map((g) => g.location))]}
                type="Chọn địa phương"
                onChange={(val) => setFilters((s) => ({ ...s, location: val }))}
              />
              <NavDown
                data={[...new Set(guidesAll.map((g) => g.language))]}
                type="Chọn ngôn ngữ"
                onChange={(val) => setFilters((s) => ({ ...s, language: val }))}
              />
              <NavDown
                data={[...new Set(guidesAll.map((g) => g.style))]}
                type="Chọn phong cách"
                onChange={(val) => setFilters((s) => ({ ...s, style: val }))}
              />

              <button
                onClick={resetFilters}
                disabled={!hasFilter}
                type="button"
                className={`text-sm px-3 py-2 rounded-lg border ${hasFilter ? "bg-white hover:bg-gray-50" : "bg-gray-100 text-gray-400 cursor-not-allowed"
                  }`}
                title="Xóa bộ lọc"
              >
                Xóa bộ lọc
              </button>
            </div>

            {/* Cards + Pagination */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
              {pagedGuides.map((guide) => (
                <div key={guide.id} className="group border rounded-2xl bg-white p-4 shadow-sm hover:shadow-md transition">
                  <div className="relative flex items-center gap-3">
                    <img
                      src={guide.image}
                      alt={guide.name}
                      className="w-16 h-16 rounded-full object-cover ring-2 ring-white shadow"
                    />
                    <div className="flex-1">
                      <p className="font-semibold leading-5">{guide.name}</p>
                      <p className="text-sm text-gray-600">
                        {guide.location} • {guide.language}
                      </p>
                      <p className="text-xs text-gray-500">{guide.style}</p>
                    </div>
                    <span
                      className={`text-xs px-2 py-1 rounded-full ${guide.available ? "bg-emerald-50 text-emerald-700" : "bg-rose-50 text-rose-700"
                        }`}
                    >
                      {guide.available ? "Có sẵn" : "Bận"}
                    </span>
                  </div>

                  <div className="mt-4 flex items-center justify-between">
                    <div>
                      <div className="text-lg font-bold">{vnd(guide.price)}</div>
                      <div className="text-xs text-gray-500">/ ngày</div>
                    </div>
                    <div className="text-sm text-amber-500">★ {guide.rating}</div>
                  </div>

                  <div className="mt-4 flex gap-2">
                    <Link to={`/guide/${guide.id}`} className="flex-1 text-center border rounded-xl py-2 hover:bg-gray-50">
                      Xem hồ sơ
                    </Link>
                    <button
                      disabled={!guide.available}
                      onClick={() => onPickGuide(guide)}
                      className={`flex-1 rounded-xl py-2 font-semibold ${guide.available
                          ? "bg-sky-600 text-white hover:bg-sky-700"
                          : "bg-gray-200 text-gray-500 cursor-not-allowed"
                        }`}
                    >
                      Chọn
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination controls */}
            <div className="mt-5 flex items-center justify-center gap-2">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className={`px-3 py-1 rounded border ${page === 1 ? "text-gray-400 bg-gray-100" : "bg-white hover:bg-gray-50"}`}
              >
                «
              </button>
              {Array.from({ length: totalPages }).map((_, idx) => {
                const p = idx + 1;
                return (
                  <button
                    key={p}
                    onClick={() => setPage(p)}
                    className={`px-3 py-1 rounded border ${page === p ? "bg-sky-600 text-white" : "bg-white hover:bg-gray-50"
                      }`}
                  >
                    {p}
                  </button>
                );
              })}
              <button
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className={`px-3 py-1 rounded border ${page === totalPages ? "text-gray-400 bg-gray-100" : "bg-white hover:bg-gray-50"}`}
              >
                »
              </button>
            </div>
          </div>

          {/* Quick form + price box */}
          <div className="lg:col-span-4">
            <div className="rounded-2xl bg-white p-5 shadow">
              <h3 className="text-lg font-bold mb-3">Yêu cầu nhanh</h3>

              {selectedGuide && (
                <div className="mb-4 flex items-center gap-3 rounded-xl border p-3 bg-sky-50">
                  <img src={selectedGuide.image} alt={selectedGuide.name} className="w-12 h-12 rounded-full object-cover" />
                  <div className="flex-1">
                    <p className="font-semibold leading-5">{selectedGuide.name}</p>
                    <p className="text-xs text-gray-600">
                      {selectedGuide.location} • {selectedGuide.language} • {selectedGuide.style}
                    </p>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-bold">{vnd(selectedGuide.price)}</div>
                    <div className="text-[11px] text-gray-500">/ ngày</div>
                  </div>
                </div>
              )}

              <div className="grid gap-3">
                <input
                  className="border border-gray-300 rounded-xl px-3 py-2"
                  placeholder="Họ và tên"
                  value={miniForm.fullName}
                  onChange={(e) => setMiniForm((s) => ({ ...s, fullName: e.target.value }))}
                />
                <input
                  className="border border-gray-300 rounded-xl px-3 py-2"
                  placeholder="Số điện thoại"
                  value={miniForm.phone}
                  onChange={(e) => setMiniForm((s) => ({ ...s, phone: e.target.value }))}
                />

                <div className="grid grid-cols-2 gap-3">
                  <input
                    type="date"
                    className="border border-gray-300 rounded-xl px-3 py-2"
                    value={miniForm.startDate || filters.startDate}
                    onChange={(e) => setMiniForm((s) => ({ ...s, startDate: e.target.value }))}
                  />
                  <input
                    type="date"
                    className="border border-gray-300 rounded-xl px-3 py-2"
                    value={miniForm.endDate || filters.endDate}
                    onChange={(e) => setMiniForm((s) => ({ ...s, endDate: e.target.value }))}
                  />
                </div>

                {/* KHÔNG còn input số giờ */}
                <div>
                  <label className="text-xs text-gray-600">Số người</label>
                  <input
                    type="number"
                    min={1}
                    className="border border-gray-300 rounded-xl px-3 py-2 w-full"
                    value={filters.people}
                    onChange={(e) =>
                      setFilters((s) => ({ ...s, people: Math.max(1, Number(e.target.value) || 1) }))
                    }
                  />
                </div>

                <textarea
                  rows={3}
                  className="border border-gray-300 rounded-xl px-3 py-2 resize-none"
                  placeholder="Ghi chú (tuỳ chọn)"
                  value={miniForm.notes}
                  onChange={(e) => setMiniForm((s) => ({ ...s, notes: e.target.value }))}
                />
              </div>

              {/* Hộp chi tiết giá */}
              <div className="rounded-xl border p-4 bg-gray-50 mt-4 space-y-1">
                {(tourIdFromBooking || tourTitleFromBooking) && (
                  <div>
                    Gói tour: <b>{tourTitleFromBooking || `#${tourIdFromBooking}`}</b>
                    {packageFee > 0 && <> • Phụ phí: <b>{vnd(packageFee)}</b></>}
                  </div>
                )}
                <div>Đơn vị tính: <b>ngày</b></div>
                <div>Số lượng (ngày): <b>{qty}</b></div>
                <div>
                  Số người: <b>{filters.people}</b>
                  {money.extraPeopleCount > 0 && (
                    <span className="text-xs text-gray-500"> (người thêm: {money.extraPeopleCount} × 10%)</span>
                  )}
                </div>
                <div>Tạm tính (HDV): <b>{vnd(money.subtotal)}</b></div>
                <div>Phụ thu người thêm (10%/người): <b>{vnd(money.extraPeopleFee)}</b></div>
                <div>Hoa hồng công ty ({(priceCfg.commissionRate * 100).toFixed(0)}%): <b>{vnd(money.commission)}</b></div>
                {priceCfg.platformFee > 0 && <div>Phí nền tảng: <b>{vnd(money.platformFee)}</b></div>}
                {priceCfg.taxRate > 0 && <div>Thuế (tính trên hoa hồng): <b>{vnd(money.tax)}</b></div>}
                <div>Phụ phí gói tour: <b>{vnd(money.packageFee)}</b></div>
                <div className="text-lg font-bold text-blue-600">
                  Tổng khách cần thanh toán: {vnd(money.total)}
                </div>
              </div>

              {/* NÚT HÀNH ĐỘNG */}
              <div className="mt-4 grid grid-cols-1 gap-2">
                <button
                  onClick={addToCart} // ✅ NEW: đưa vào giỏ rồi đi tới /gio_hang
                  className="w-full rounded-xl py-2.5 font-semibold bg-emerald-600 text-white hover:bg-emerald-700 disabled:opacity-50"
                  disabled={!selectedGuide || qty <= 0}
                >
                  Thêm vào giỏ & thanh toán sau
                </button>

                <button
                  onClick={goConfirm}
                  className="w-full rounded-xl py-2.5 font-semibold bg-sky-600 text-white hover:bg-sky-700 disabled:opacity-50"
                  disabled={!selectedGuide}
                >
                  Gửi yêu cầu & tiếp tục
                </button>
              </div>

              <p className="text-xs text-gray-500 mt-2">
                Bằng việc gửi yêu cầu, bạn đồng ý với điều khoản & chính sách bảo mật.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

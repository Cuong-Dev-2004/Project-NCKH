// src/Pages/CityTourDetail/TourDetailLayout.jsx
import { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useCart } from "../../utils/cartContext.jsx";
import { vnd } from "../../utils/money";
import { 
  Clock, Users, Calendar, MapPin, CheckCircle, XCircle, 
  ChevronLeft, ChevronRight, X, Star, Info as InfoIcon 
} from "lucide-react";

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

  // ===== DATA (Xử lý props an toàn) =====
  const props = useMemo(() => {
    const s = state?.propData || {};
    return {
      id: s.id ?? Date.now(),
      name: s.name ?? "Chi tiết tour du lịch",
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
          ]),
      data1: Array.isArray(s.data1) ? s.data1 : [],
      include: s.include || ["HDV địa phương", "Xe đưa đón", "Vé tham quan", "Nước suối"],
      exclude: s.exclude || ["Ăn uống ngoài chương trình", "Chi phí cá nhân", "Thuế VAT"],
      plan: s.itinerary || ["Đón khách – tham quan", "Ăn trưa – nghỉ ngơi", "Mua sắm – tiễn khách"],
      kid: s.childPolicy || ["< 5 tuổi: Free", "5-9 tuổi: 70%", "> 10 tuổi: 100%"],
      rating: s.rating ?? 5,
    };
  }, [state?.propData]);

  // ===== UI state =====
  const [tab, setTab] = useState("desc");
  const [active, setActive] = useState(0);
  const [qty, setQty] = useState(1);
  const [date, setDate] = useState("");
  const [errMsg, setErrMsg] = useState("");
  const [isLB, setIsLB] = useState(false);

  // Lightbox logic
  const openLB = (idx = 0) => { setActive(idx); setIsLB(true); };
  const closeLB = () => setIsLB(false);
  const last = props.images.length - 1;
  const prev = () => setActive((i) => (i === 0 ? last : i - 1));
  const next = () => setActive((i) => (i === last ? 0 : i + 1));

  useEffect(() => {
    if (!isLB) return;
    const onKey = (e) => {
      if (e.key === "Escape") closeLB();
      if (e.key === "ArrowRight") next();
      if (e.key === "ArrowLeft") prev();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [isLB, active]); // eslint-disable-line

  const total = (props.price || 0) * (qty || 0);

  const handleBook = () => {
    if (!date) {
      setErrMsg("Vui lòng chọn ngày khởi hành.");
      return;
    }
    setErrMsg("");
    
    // Thêm vào giỏ hàng
    add({
      key: `tour-${props.id}-${Date.now()}`, // Key duy nhất
      id: props.id, 
      name: props.name, 
      price: props.price, 
      img: props.images?.[0],
      qty: qty,
      meta: {
        type: 'tour', // Đánh dấu là tour thường
        checkIn: date,
        adults: qty,
        tourId: props.id
      }
    });
    navigate("/gio_hang");
  };

  return (
    <div className="bg-[#fafafa] min-h-screen pb-10">
      <div className="mx-auto max-w-7xl px-4 md:px-6 py-6">
        
        {/* Title Header */}
        <div className="mb-6">
          <h1 className="text-2xl md:text-3xl font-bold text-slate-900 tracking-tight mb-2">
            {props.name}
          </h1>
          <div className="flex items-center text-sm text-slate-500 gap-2">
            <MapPin size={16} className="text-rose-500" />
            <span>{props.locationText} • Việt Nam</span>
            <span className="mx-2">|</span>
            <div className="flex items-center gap-1">
               <Star size={14} className="fill-amber-400 text-amber-400" />
               <span className="font-semibold text-slate-700">{props.rating}</span> 
               <span>(Đánh giá tốt)</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_380px] gap-8 items-start">
          
          {/* LEFT COLUMN */}
          <section className="space-y-8">
            
            {/* Gallery */}
            <div className="bg-white rounded-2xl overflow-hidden shadow-sm p-2 border border-slate-100">
              <div className="relative rounded-xl overflow-hidden group">
                <button
                  onClick={() => openLB(active)}
                  className="absolute left-3 top-3 z-10 text-xs px-3 py-1.5 rounded-full bg-black/50 text-white backdrop-blur-md hover:bg-black/70 transition"
                >
                  + {props.images.length} Hình ảnh
                </button>

                <img
                  src={props.images[active]}
                  alt={`img-${active}`}
                  className="w-full aspect-[16/9] object-cover cursor-zoom-in transition-transform duration-500 hover:scale-105"
                  onClick={() => openLB(active)}
                />
                
                {/* Navigation Buttons on Image */}
                <button onClick={(e) => {e.stopPropagation(); prev()}} className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white/80 hover:bg-white text-slate-800 flex items-center justify-center shadow-lg opacity-0 group-hover:opacity-100 transition-all">
                    <ChevronLeft size={20}/>
                </button>
                <button onClick={(e) => {e.stopPropagation(); next()}} className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white/80 hover:bg-white text-slate-800 flex items-center justify-center shadow-lg opacity-0 group-hover:opacity-100 transition-all">
                    <ChevronRight size={20}/>
                </button>
              </div>

              {/* Thumbnails */}
              <div className="mt-2 grid grid-cols-5 gap-2">
                {props.images.map((src, i) => (
                  <button
                    key={i}
                    onClick={() => setActive(i)}
                    className={`relative rounded-lg overflow-hidden h-16 md:h-20 ${active === i ? "ring-2 ring-offset-1 ring-rose-500" : "opacity-70 hover:opacity-100"}`}
                  >
                    <img src={src} alt={`thumb-${i}`} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            </div>

            {/* Info Strip */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                <Info icon={Clock} title="Thời gian" value={`${props.duration} ngày`} />
                <Info icon={Users} title="Quy mô" value={`Tối đa ${props.capacity}`} />
                <Info icon={Star} title="Độ tuổi" value={props.minAge} />
                <Info icon={MapPin} title="Đón tại" value={props.pickup} />
              </div>
            </div>

            {/* Content Tabs */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden min-h-[400px]">
              <div className="flex flex-wrap gap-2 px-6 pt-6 border-b border-slate-100 pb-4">
                {TABS.map((t) => (
                  <button
                    key={t.key}
                    onClick={() => setTab(t.key)}
                    className={`px-4 py-2 text-sm font-bold rounded-full transition-all ${
                      tab === t.key
                        ? "bg-slate-900 text-white shadow-md"
                        : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                    }`}
                  >
                    {t.label}
                  </button>
                ))}
              </div>

              <div className="p-6">
                {tab === "desc" && (
                  <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
                    <h3 className="font-bold text-lg text-slate-900 mb-4">Trải nghiệm nổi bật</h3>
                    <ul className="space-y-3">
                      {(props.data1.length ? props.data1 : ["Khám phá điểm đến nổi bật.", "Trải nghiệm ẩm thực địa phương.", "Hướng dẫn viên tận tâm."]).map((x, i) => (
                        <li key={i} className="flex items-start gap-3 text-slate-700">
                          <CheckCircle size={18} className="text-emerald-500 mt-0.5 shrink-0"/>
                          <span>{x}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {tab === "inc" && (
                  <div className="grid md:grid-cols-2 gap-8 animate-in fade-in slide-in-from-bottom-2 duration-300">
                    <div>
                      <div className="font-bold text-emerald-600 mb-3 flex items-center gap-2"><CheckCircle size={18}/> ĐÃ BAO GỒM</div>
                      <ul className="space-y-2 text-slate-700">
                        {props.include.map((x, i) => <li key={i} className="flex items-start gap-2"><span className="w-1.5 h-1.5 bg-emerald-400 rounded-full mt-2"></span>{x}</li>)}
                      </ul>
                    </div>
                    <div>
                      <div className="font-bold text-rose-600 mb-3 flex items-center gap-2"><XCircle size={18}/> CHƯA BAO GỒM</div>
                      <ul className="space-y-2 text-slate-700">
                        {props.exclude.map((x, i) => <li key={i} className="flex items-start gap-2"><span className="w-1.5 h-1.5 bg-rose-400 rounded-full mt-2"></span>{x}</li>)}
                      </ul>
                    </div>
                  </div>
                )}

                {tab === "plan" && (
                  <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
                    <div className="space-y-4">
                      {props.plan.map((x, i) => (
                        <div key={i} className="flex gap-4">
                            <div className="flex flex-col items-center">
                                <div className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center font-bold text-sm">{i + 1}</div>
                                {i !== props.plan.length - 1 && <div className="w-0.5 h-full bg-slate-100 my-1"></div>}
                            </div>
                            <div className="pb-4">
                                <h4 className="font-bold text-slate-900">Ngày {i + 1}</h4>
                                <p className="text-slate-600 mt-1">{x.replace(/^Ngày\s*\d+:\s*/i, "")}</p>
                            </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {tab === "kid" && (
                  <ul className="space-y-3 text-slate-700 bg-slate-50 p-4 rounded-xl animate-in fade-in slide-in-from-bottom-2 duration-300">
                    {props.kid.map((x, i) => (
                        <li key={i} className="flex items-center gap-2"><InfoIcon size={16} className="text-blue-500"/> {x}</li>
                    ))}
                  </ul>
                )}

                {tab === "rv" && (
                  <div className="text-center py-10 text-slate-500">
                    <Star size={40} className="mx-auto text-slate-200 mb-3"/>
                    <p>Chưa có đánh giá nào. Hãy là người đầu tiên trải nghiệm!</p>
                  </div>
                )}
              </div>
            </div>
          </section>

          {/* RIGHT - BOOKING CARD */}
          <aside className="lg:sticky lg:top-24 space-y-6">
            <div className="bg-white rounded-2xl shadow-xl shadow-slate-200/50 border border-slate-100 p-6">
              <div className="flex items-end gap-2 mb-6 pb-6 border-b border-slate-100">
                <div className="text-3xl font-extrabold text-rose-600">{vnd(props.price)}</div>
                {!!props.oldPrice && <div className="text-sm text-slate-400 line-through mb-1">{vnd(props.oldPrice)}</div>}
                <div className="text-xs text-slate-500 mb-1.5">/ khách</div>
              </div>

              <div className="space-y-4">
                <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">Ngày khởi hành</label>
                    <div className="relative">
                        <Calendar className="absolute left-3 top-2.5 text-slate-400" size={18}/>
                        <input
                        type="date"
                        value={date}
                        onChange={(e) => setDate(e.target.value)}
                        className="w-full pl-10 pr-3 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-sm focus:ring-2 focus:ring-rose-500 focus:bg-white outline-none transition-all"
                        />
                    </div>
                    {errMsg && <div className="text-xs text-rose-500 mt-1 flex items-center gap-1"><InfoIcon size={12}/> {errMsg}</div>}
                </div>

                <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">Số lượng khách</label>
                    <div className="flex items-center rounded-xl border border-slate-200 overflow-hidden bg-white">
                        <button onClick={() => setQty(q => Math.max(1, q - 1))} className="w-12 h-10 flex items-center justify-center hover:bg-slate-50 active:bg-slate-100 transition text-slate-600 font-bold text-lg">−</button>
                        <input
                        type="number" min={1} value={qty}
                        onChange={(e) => setQty(Math.max(1, Number(e.target.value) || 1))}
                        className="flex-1 h-10 text-center border-x border-slate-100 text-sm outline-none font-semibold text-slate-900"
                        />
                        <button onClick={() => setQty(q => q + 1)} className="w-12 h-10 flex items-center justify-center hover:bg-slate-50 active:bg-slate-100 transition text-slate-600 font-bold text-lg">+</button>
                    </div>
                </div>

                <div className="bg-slate-50 p-4 rounded-xl flex justify-between items-center">
                    <span className="text-sm text-slate-600 font-medium">Tổng tạm tính</span>
                    <span className="text-lg font-bold text-slate-900">{vnd(total)}</span>
                </div>

                <button
                    onClick={handleBook}
                    disabled={!date}
                    className={`w-full py-3.5 rounded-xl text-white font-bold text-lg shadow-lg transition-all transform active:scale-[0.98] ${
                    date ? "bg-gradient-to-r from-rose-600 to-orange-600 hover:shadow-rose-200" : "bg-slate-300 cursor-not-allowed"
                    }`}
                >
                    Đặt Tour Ngay
                </button>
              </div>
            </div>

            {/* Small Promo */}
            <div className="rounded-2xl overflow-hidden relative group cursor-pointer">
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent z-10"/>
                <img src={props.images[1] || "https://picsum.photos/id/1022/640/360"} alt="promo" className="w-full h-40 object-cover group-hover:scale-105 transition-transform duration-500"/>
                <div className="absolute bottom-4 left-4 z-20 text-white">
                    <div className="text-xs font-bold uppercase bg-white/20 backdrop-blur-sm px-2 py-0.5 rounded w-fit mb-1">Khám phá</div>
                    <h4 className="font-bold">Vẻ đẹp tiềm ẩn {props.locationText}</h4>
                </div>
            </div>
          </aside>
        </div>
      </div>

      {/* ===== LIGHTBOX ===== */}
      {isLB && (
        <div className="fixed inset-0 z-[100] bg-black/90 backdrop-blur-sm flex items-center justify-center p-4" onClick={closeLB}>
          <div className="relative w-full max-w-6xl" onClick={(e) => e.stopPropagation()}>
            <button onClick={closeLB} className="absolute -top-12 right-0 text-white/70 hover:text-white transition"><X size={32}/></button>
            <div className="flex items-center justify-between gap-4">
                <button onClick={prev} className="w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition"><ChevronLeft size={32}/></button>
                <img src={props.images[active]} alt="lightbox" className="max-h-[80vh] object-contain rounded-lg shadow-2xl"/>
                <button onClick={next} className="w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition"><ChevronRight size={32}/></button>
            </div>
            <div className="mt-6 flex justify-center gap-2 overflow-x-auto py-2">
                {props.images.map((src, i) => (
                    <button key={i} onClick={() => setActive(i)} className={`w-16 h-12 rounded-md overflow-hidden border-2 transition ${active === i ? "border-rose-500 opacity-100" : "border-transparent opacity-50 hover:opacity-80"}`}>
                        <img src={src} className="w-full h-full object-cover"/>
                    </button>
                ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Helper Component hiển thị thông tin nhỏ
function Info({ icon: Icon, title, value }) {
  return (
    <div className="flex items-start gap-3 p-2 rounded-lg hover:bg-slate-50 transition">
      <div className="w-10 h-10 rounded-full bg-rose-50 text-rose-600 flex items-center justify-center shrink-0">
        <Icon size={20} />
      </div>
      <div>
        <div className="text-xs font-bold text-slate-400 uppercase tracking-wide">{title}</div>
        <div className="font-semibold text-slate-800 text-sm md:text-base">{value}</div>
      </div>
    </div>
  );
}
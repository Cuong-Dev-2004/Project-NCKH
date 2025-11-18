import React, { useEffect, useMemo, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { TOURS } from "../../data/tours";
import DetailPresets from "../../data/Data";

/* =============== HELPERS =============== */
const fmt = (n) => (Number(n || 0)).toLocaleString("vi-VN") + "đ";

const slugify = (s) =>
  s.toLowerCase()
    .normalize("NFD").replace(/[\u0300-\u036f]/g, "")
    .replace(/đ/g, "d")
    .replace(/[^a-z0-9 ]/g, "")
    .trim()
    .replace(/\s+/g, "-");

const pickPreset = (id) => {
  switch (id) {
    case 1: return DetailPresets.danang_city_1day;
    case 2: return DetailPresets.bana_night;
    case 3: return DetailPresets.son_tra_ngu_hanh_son;
    case 4: return DetailPresets.checkin_cau_vang_bana;
    case 5: return DetailPresets.ngu_hanh_son_hoi_an_dem;
    case 6: return DetailPresets.cu_lao_cham_1day;
    case 7: return DetailPresets.hoi_an_dem_den_long;
    case 8: return DetailPresets.lang_gom_thanh_ha;
    case 9: return DetailPresets.rau_tra_que_cooking;
    case 10: return DetailPresets.cam_thanh_thung_chai;
    case 11: return DetailPresets.hue_dai_noi_lang_tam;
    case 12: return DetailPresets.hue_song_huong_cruise;
    case 13: return DetailPresets.hue_thien_mu_minh_mang;
    case 14: return DetailPresets.hue_street_food;
    case 15: return DetailPresets.hue_tu_duc_dong_ba;
    default: return null;
  }
};

const makePropData = (t) =>
  pickPreset(t.id) || {
    id: t.id,
    name: t.name,
    locationText: `${t.location}, Việt Nam`,
    price: t.price,
    oldPrice: t.oldPrice,
    duration: t.duration,
    capacity: 35,
    minAge: "10+",
    pickup: "Khách sạn trung tâm",
    images: [t.img],
    data1: [],
  };

const Star = ({ className = "w-4 h-4 text-amber-500" }) => (
  <svg viewBox="0 0 20 20" fill="currentColor" className={className}>
    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.955a1 1 0 00.95.69h4.162c.969 0 1.371 1.24.588 1.81l-3.37 2.448a1 1 0 00-.364 1.118l1.287 3.955c.3.92-.755 1.688-1.54 1.118L10 13.347l-3.998 2.674c-.784.57-1.84-.197-1.54-1.118l1.287-3.955a1 1 0 00-.364-1.118L1.016 9.382c-.783-.57-.38-1.81.588-1.81h4.162a1 1 0 00.95-.69L9.05 2.927z"/>
  </svg>
);

/* =============== HERO =============== */
function Hero() {
  const navigate = useNavigate();
  return (
    <header className="relative">
      <div className="h-[520px] w-full">
        <img
          src="https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=1600"
          alt="Da Nang beach"
          className="h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-blue-900/70 via-blue-800/55 to-blue-700/40" />
      </div>

      <div className="absolute inset-0">
        <div className="mx-auto flex h-full max-w-7xl items-center px-6">
          <div className="max-w-2xl text-white">
            <p className="text-sm uppercase tracking-widest text-white/80">
              TravelTour • Đà Nẵng & Miền Trung
            </p>
            <h1 className="mt-2 text-4xl sm:text-5xl font-extrabold leading-tight">
              Khám phá thế giới theo <span className="text-yellow-300">phong cách riêng</span>
            </h1>
            <p className="mt-4 text-white/90 text-lg leading-relaxed">
              Lịch trình linh hoạt, cá nhân hoá, hướng dẫn viên phù hợp và hỗ trợ 24/7.
            </p>
            <div className="mt-6">
              <button
                onClick={() => navigate(`/booking`)}
                className="rounded-2xl px-6 py-3 font-semibold text-blue-900 bg-yellow-300 hover:bg-yellow-200 active:bg-yellow-400 transition shadow-lg hover:-translate-y-0.5"
              >
                Đặt Tour
              </button>
            </div>
            <ul className="mt-6 text-white/90 space-y-2">
              {["Hướng dẫn viên phù hợp","Lịch trình linh hoạt","Hỗ trợ 24/7"].map((t,i)=>(
                <li key={i} className="flex items-center gap-3">
                  <span className="bg-white/20 rounded-full px-2 py-1 font-semibold">✓</span>{t}
                </li>
              ))}
            </ul>
          </div>

          <div className="ml-auto hidden lg:block">
            <SuggestCarousel items={TOURS} autoMs={5000} />
          </div>
        </div>
      </div>
    </header>
  );
}

/* =============== SUGGEST (auto) =============== */
function SuggestCarousel({ items, autoMs = 5000 }) {
  const [i, setI] = useState(0);
  const visible = 3, len = items.length;
  const timer = useRef(null);
  const next = () => setI((x)=>(x+1)%len);
  const prev = () => setI((x)=>(x-1+len)%len);

  useEffect(()=>{ if(len<=visible) return; timer.current=setInterval(next,autoMs); return ()=>clearInterval(timer.current); },[autoMs, len]);

  const view = useMemo(()=> {
    const out=[]; for(let k=0;k<Math.min(visible,len);k++) out.push(items[(i+k)%len]); return out;
  },[i, len, items]);

  return (
    <div className="relative bg-white/90 backdrop-blur rounded-3xl p-5 shadow-2xl">
      <h4 className="text-lg font-semibold text-gray-800 mb-3">Gợi ý cho bạn</h4>
      <div className="absolute -top-10 right-5 flex gap-2">
        <button onClick={prev} className="w-9 h-9 rounded-full border bg-white hover:bg-gray-50">‹</button>
        <button onClick={next} className="w-9 h-9 rounded-full border bg-white hover:bg-gray-50">›</button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {view.map(t=>{
          const slug = slugify(t.name);
          const state = { tourId: t.id, propData: makePropData(t) };

          return (
            <article key={t.id} className="bg-white rounded-xl border border-gray-200 overflow-hidden">
              <Link to={`/tours/${slug}`} state={state} className="relative h-32 block">
                <img src={t.img} alt={t.name} className="w-full h-full object-cover" />
                <span className="absolute top-2 left-2 text-xs bg-white/90 px-2 py-0.5 rounded-md">{t.duration} ngày</span>
                <span className="absolute top-2 right-2 text-[10px] bg-sky-100 text-sky-700 px-2 py-0.5 rounded">ID: {t.id}</span>
              </Link>
              <div className="p-3">
                <Link to={`/tours/${slug}`} state={state} className="font-semibold line-clamp-2 hover:text-sky-700">
                  {t.name}
                </Link>
                <div className="mt-1 flex items-center justify-between text-sm">
                  <div className="font-bold">{fmt(t.price)}</div>
                  <div className="flex items-center text-amber-500">
                    <Star/><span className="ml-1 text-gray-700">{t.rating}</span>
                  </div>
                </div>

                {/* Nút Đặt tour -> chuyển sang Booking bằng state.tour để giữ đúng giá */}
                <Link
                  to="/booking"
                  state={{ tour: t }}
                  className="inline-block mt-2 px-3 py-1.5 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  Đặt tour
                </Link>
              </div>
            </article>
          );
        })}
      </div>
    </div>
  );
}

/* =============== FEATURED TOURS =============== */
function FeaturedTours({ items = TOURS, title = "Tour Nổi Bật", subtitle = "Dịch vụ chất lượng – điểm đến hấp dẫn", autoMs = 5000 }) {
  const featured = useMemo(()=>{
    const f = items.filter(t => String(t.tag||"").toLowerCase().includes("nổi bật"));
    return (f.length ? f : items).slice(0,8);
  },[items]);

  const [idx, setIdx] = useState(0);
  const len = featured.length, visible = 4;
  const timer = useRef(null);
  const next = ()=>setIdx(i=>(i+1)%len);
  const prev = ()=>setIdx(i=>(i-1+len)%len);
  useEffect(()=>{ if(len<=visible) return; timer.current=setInterval(next,autoMs); return ()=>clearInterval(timer.current);},[autoMs,len]);
  const view = useMemo(()=>{ const out=[]; for(let i=0;i<Math.min(visible,len);i++) out.push(featured[(idx+i)%len]); return out;},[idx,len,featured]);

  return (
    <section className="mt-10">
      <div className="text-center">
        <h2 className="text-3xl md:text-4xl font-extrabold text-sky-600">{title}</h2>
        <p className="text-gray-600 mt-1">{subtitle}</p>
      </div>
      <div className="flex gap-2 justify-end pr-3 -mt-8 mb-4">
        <button onClick={prev} className="w-9 h-9 rounded-full border bg-white hover:bg-gray-50">‹</button>
        <button onClick={next} className="w-9 h-9 rounded-full border bg-white hover:bg-gray-50">›</button>
      </div>

      <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 xl:grid-cols-4">
        {view.map((t)=>{
          const slug = slugify(t.name);
          const state = { tourId: t.id, propData: makePropData(t) };
          return (
            <article key={t.id} className="bg-white rounded-2xl shadow-[0_4px_24px_rgba(0,0,0,.06)] overflow-hidden border border-sky-100/60">
              <Link to={`/tours/${slug}`} state={state} className="relative h-56 block">
                <img src={t.img} alt={t.name} className="w-full h-full object-cover" />
                {String(t.tag||"") && (
                  <span className="absolute top-2 left-2 bg-sky-500 text-white text-xs px-2 py-1 rounded-md shadow">{t.tag}</span>
                )}
                <span className="absolute -bottom-3 left-4 text-rose-600 bg-rose-50 border border-rose-200 rounded-full px-3 py-1 text-xs">
                  {t.duration} ngày
                </span>
                <span className="absolute top-2 right-2 text-[10px] bg-sky-100 text-sky-700 px-2 py-0.5 rounded">ID: {t.id}</span>
              </Link>

              <div className="p-4">
                <Link to={`/tours/${slug}`} state={state} className="font-semibold leading-snug line-clamp-2 hover:text-sky-700">
                  {t.name}
                </Link>
                <div className="mt-2 flex items-center gap-2 text-sm text-gray-600">
                  <span className="inline-flex items-center gap-1">
                    <svg viewBox="0 0 24 24" fill="none" className="w-4 h-4">
                      <path d="M12 21s-7-5.686-7-11a7 7 0 1114 0c0 5.314-7 11-7 11z" stroke="currentColor" strokeWidth="1.5"/>
                      <circle cx="12" cy="10" r="2.5" stroke="currentColor" strokeWidth="1.5"/>
                    </svg>
                    {t.location}
                  </span>
                </div>
                <div className="mt-1 inline-flex items-center gap-1">
                  <Star/><Star/><Star/><Star/><span className="text-gray-600 ml-1">{t.rating}</span>
                </div>

                <div className="mt-3 flex items-end justify-between">
                  <div>
                    <div className="text-pink-600 font-extrabold text-lg">{fmt(t.price)}</div>
                    {t.oldPrice && <div className="text-gray-400 line-through text-sm -mt-0.5">{fmt(t.oldPrice)}</div>}
                  </div>
                  <Link
                    to={`/tours/${slug}`} state={state}
                    className="px-4 py-2 bg-sky-600 text-white rounded-lg hover:bg-sky-700 text-sm"
                  >
                    Xem chi tiết
                  </Link>
                </div>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}

/* =============== DAILY TOUR (Đà Nẵng / Hội An / Huế) =============== */
const CITY_KEYS = ["Đà Nẵng","Hội An","Huế"];

function DailyTours({ autoMs = 5000 }) {
  const CITY_DATA = useMemo(() => ({
    "Đà Nẵng": TOURS.filter(t => t.location === "Đà Nẵng").slice(0,8),
    "Hội An": TOURS.filter(t => t.location === "Hội An").slice(0,8),
    "Huế": TOURS.filter(t => t.location === "Huế").slice(0,8),
  }), []);

  const [tab, setTab] = useState(CITY_KEYS[0]);
  const [i, setI] = useState(0);
  const items = CITY_DATA[tab] || [];
  const len = items.length, visible = 4;
  const timer = useRef(null);
  const next = ()=>setI(x=>(x+1)%len);
  const prev = ()=>setI(x=>(x-1+len)%len);

  useEffect(()=>{ setI(0); },[tab]);
  useEffect(()=>{ if(len<=visible) return; timer.current=setInterval(next,autoMs); return ()=>clearInterval(timer.current); },[autoMs, len, tab]);

  const view = useMemo(()=>{ const out=[]; for(let k=0;k<Math.min(visible,len);k++) out.push(items[(i+k)%len]); return out; },[i, len, items]);

  return (
    <section className="mt-12">
      <div className="text-center">
        <h2 className="text-3xl md:text-4xl font-extrabold text-sky-600">Daily Tour</h2>
        <p className="text-gray-600">Chùm tour hấp dẫn – đi là thích ngay</p>
      </div>

      <div className="flex flex-wrap items-center justify-center gap-6 font-semibold text-gray-500 mt-3">
        {CITY_KEYS.map(c=>(
          <button key={c} onClick={()=>setTab(c)} className={`pb-1 ${tab===c?"text-sky-600 border-b-2 border-sky-600":"hover:text-sky-600"}`}>
            {c.toUpperCase()}
          </button>
        ))}
      </div>

      <div className="flex gap-2 justify-end pr-2 mt-4">
        <button onClick={prev} className="w-9 h-9 rounded-full border bg-white hover:bg-gray-50">‹</button>
        <button onClick={next} className="w-9 h-9 rounded-full border bg-white hover:bg-gray-50">›</button>
      </div>

      <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 xl:grid-cols-4">
        {view.map(t=>{
          const slug = slugify(t.name);
          const state = { tourId: t.id, propData: makePropData(t) };
          return (
            <article key={`${tab}-${t.id}`} className="bg-white rounded-2xl border border-sky-100 shadow-[0_4px_24px_rgba(0,0,0,.06)] overflow-hidden">
              <Link to={`/tours/${slug}`} state={state} className="relative h-56 block">
                <img src={t.img} alt={t.name} className="w-full h-full object-cover" />
                <span className="absolute top-2 left-2 bg-sky-500 text-white text-xs px-2 py-1 rounded-md shadow">{t.tag || "Nổi bật"}</span>
                <span className="absolute -bottom-3 left-4 text-rose-600 bg-rose-50 border border-rose-200 rounded-full px-3 py-1 text-xs">{t.duration} ngày</span>
                <span className="absolute top-2 right-2 text-[10px] bg-sky-100 text-sky-700 px-2 py-0.5 rounded">ID: {t.id}</span>
              </Link>

              <div className="p-4">
                <Link to={`/tours/${slug}`} state={state} className="font-semibold leading-snug line-clamp-2 hover:text-sky-700">
                  {t.name}
                </Link>
                <div className="mt-2 text-gray-600 text-sm inline-flex items-center gap-1">
                  <svg viewBox="0 0 24 24" fill="none" className="w-4 h-4">
                    <path d="M12 21s-7-5.686-7-11a7 7 0 1114 0c0 5.314-7 11-7 11z" stroke="currentColor" strokeWidth="1.5"/>
                    <circle cx="12" cy="10" r="2.5" stroke="currentColor" strokeWidth="1.5"/>
                  </svg>
                  {t.location}
                </div>
                <div className="mt-1 inline-flex items-center gap-1">
                  <Star/><Star/><Star/><Star/><span className="text-gray-600 ml-1">{t.rating}</span>
                </div>

                <div className="mt-3 flex items-end justify-between">
                  <div>
                    <div className="text-pink-600 font-extrabold text-lg">{fmt(t.price)}</div>
                    {t.oldPrice && <div className="text-gray-400 line-through text-sm -mt-0.5">{fmt(t.oldPrice)}</div>}
                  </div>
                  <Link
                    to={`/tours/${slug}`} state={state}
                    className="px-4 py-2 bg-sky-600 text-white rounded-lg hover:bg-sky-700 text-sm"
                  >
                    Xem chi tiết
                  </Link>
                </div>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}

/* =============== EXTRA SECTIONS =============== */
function EventCards() {
  const events = [
    { id: 1, title: "Quốc khánh 2/9 - Du lịch Đà Nẵng ngắm pháo hoa", date: "01/09 - 03/09", img: "https://cdn.thuvienphapluat.vn/uploads/tintuc/2025/08/12/lich-nghi-le-quoc-khanh-2-9-nguoi-lao-dong.jpg", desc: "Không khí lễ hội rực rỡ bên bờ sông Hàn." },
    { id: 2, title: "Pháo Hoa Đà Nẵng", date: "20/04 - 27/04", img: "https://danangfantasticity.com/wp-content/uploads/2023/04/le-hoi-phao-hoa-quoc-te-da-nang-2023-diff-2023-the-gioai-khong-khoang-canh-tu-02-06-den-08-07-2023.jpg", desc: "Trải nghiệm Những Trận Bắn Pháo Hoa." },
    { id: 3, title: "Tết Nguyên Đán 2025", date: "26/01 - 02/02", img: "https://vov2.vov.vn/sites/default/files/styles/large/public/2023-05/a335.jpg", desc: "Lịch trình lễ hội – ẩm thực – check-in." },
  ];
  return (
    <section className="mt-12">
      <h2 className="text-2xl font-bold text-gray-900 mb-4">Sự kiện & Lễ hội</h2>
      <div className="grid md:grid-cols-3 gap-4">
        {events.map(e=>(
          <article key={e.id} className="bg-white rounded-xl border border-gray-100 overflow-hidden">
            <div className="h-40"><img src={e.img} alt={e.title} className="w-full h-full object-cover" /></div>
            <div className="p-4">
              <div className="text-sm text-gray-500">{e.date}</div>
              <h3 className="font-semibold">{e.title}</h3>
              <p className="text-sm text-gray-600 mt-1">{e.desc}</p>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

function Testimonials() {
  const items = [
    {name:"Minh Anh", text:"Dịch vụ cực tốt, lịch trình rõ ràng.", star:5},
    {name:"Hữu Phú", text:"Hỗ trợ nhanh, HDV thân thiện.", star:5},
    {name:"Trà My", text:"Giá hợp lý, trải nghiệm tuyệt vời!", star:4.8},
  ];
  return (
    <section className="mt-12">
      <h2 className="text-2xl font-bold text-gray-900 mb-4">Khách hàng nói gì?</h2>
      <div className="grid md:grid-cols-3 gap-4">
        {items.map((c,i)=>(
          <div key={i} className="bg-white border rounded-xl p-4">
            <div className="flex items-center gap-2">
              {Array.from({length:5}).map((_,k)=><Star key={k}/>)}
              <span className="text-gray-600 ml-1">{c.star}</span>
            </div>
            <p className="mt-2 text-gray-700">{c.text}</p>
            <div className="mt-2 font-semibold">{c.name}</div>
          </div>
        ))}
      </div>
    </section>
  );
}

function Newsletter() {
  return (
    <section className="mt-12 bg-gradient-to-r from-sky-50 to-indigo-50 border border-sky-100 rounded-2xl p-6 flex flex-col md:flex-row items-center justify-between gap-4">
      <div>
        <div className="text-xl font-bold">Nhận ưu đãi mới mỗi tuần</div>
        <div className="text-gray-600">Đăng ký để không bỏ lỡ các khuyến mãi hấp dẫn.</div>
      </div>
      <form onSubmit={(e)=>e.preventDefault()} className="flex gap-2 w-full md:w-auto">
        <input className="border rounded-lg px-3 py-2 w-full md:w-80" placeholder="Nhập email của bạn" />
        <button className="px-4 py-2 bg-sky-600 text-white rounded-lg">Đăng ký</button>
      </form>
    </section>
  );
}

/* =============== PAGE =============== */
export default function HomePage() {
  return (
    <div className="w-full min-h-screen bg-white">
      <Hero />
      <main className="mx-auto max-w-7xl px-6 py-10">
        <FeaturedTours items={TOURS} autoMs={5000} />
        <DailyTours autoMs={5000} />
        <EventCards />
        <Testimonials />
        <Newsletter />
        <section className="mt-12 text-center">
          <div className="inline-flex flex-col items-center gap-3 bg-sky-50 border border-sky-100 rounded-2xl px-6 py-6">
            <div className="text-xl font-bold">Sẵn sàng cho chuyến đi?</div>
            <div className="text-gray-600">Tư vấn miễn phí – gợi ý lịch trình phù hợp trong 10 phút.</div>
            <div className="flex gap-3">
              <Link to="/booking" className="px-5 py-2 rounded-lg bg-sky-600 text-white">Đặt tour ngay</Link>
              <Link to="/contact" className="px-5 py-2 rounded-lg border border-sky-600 text-sky-600">Liên hệ</Link>
            </div>
          </div>
        </section>
      </main>

      <footer className="bg-white border-t">
        <div className="mx-auto max-w-7xl px-6 py-8 text-sm text-gray-600">
          © {new Date().getFullYear()} TravelTour. All rights reserved.
        </div>
      </footer>
    </div>
  );
}

// src/Pages/HomePage/HomePage.jsx
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

/* =============== HERO (Đã chỉnh sửa: Căn giữa, xóa gợi ý) =============== */
function Hero() {
  const navigate = useNavigate();
  return (
    <header className="relative">
      <div className="h-[600px] w-full">
        <img
          src="https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=1600"
          alt="Da Nang beach"
          className="h-full w-full object-cover"
        />
        {/* Lớp phủ tối màu hơn chút để chữ nổi bật */}
        <div className="absolute inset-0 bg-black/40" />
      </div>

      <div className="absolute inset-0 flex items-center justify-center text-center">
        <div className="mx-auto max-w-4xl px-6">
          <p className="mb-4 text-sm font-bold uppercase tracking-[0.2em] text-sky-200/90">
            TravelTour • Đà Nẵng & Miền Trung
          </p>
          <h1 className="text-5xl font-black leading-tight text-white sm:text-6xl drop-shadow-lg">
            Khám phá thế giới theo <br className="hidden md:block" />
            <span className="text-yellow-400">phong cách riêng</span>
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-white/90 md:text-xl">
            Tận hưởng kỳ nghỉ trọn vẹn với lịch trình linh hoạt, cá nhân hoá và đội ngũ hỗ trợ tận tâm 24/7.
          </p>
          
          <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <button
              onClick={() => navigate(`/booking`)}
              className="rounded-full bg-yellow-400 px-8 py-4 font-bold text-blue-900 shadow-lg shadow-yellow-400/30 transition hover:-translate-y-1 hover:bg-yellow-300"
            >
              Đặt Tour Ngay
            </button>
            <button
               onClick={() => document.getElementById('featured-tours').scrollIntoView({ behavior: 'smooth' })}
               className="rounded-full border-2 border-white/30 bg-white/10 px-8 py-4 font-bold text-white backdrop-blur-sm transition hover:bg-white/20"
            >
              Xem Điểm Đến
            </button>
          </div>

          <ul className="mt-10 flex flex-wrap justify-center gap-6 text-sm font-medium text-white/80">
            {["Hướng dẫn viên chuyên nghiệp", "Lịch trình linh hoạt", "Hỗ trợ 24/7", "Giá tốt nhất"].map((t, i) => (
              <li key={i} className="flex items-center gap-2">
                <div className="flex h-6 w-6 items-center justify-center rounded-full bg-emerald-500 text-white">
                  ✓
                </div>
                {t}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </header>
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
    <section id="featured-tours" className="mt-16 scroll-mt-20">
      <div className="text-center">
        <h2 className="text-3xl md:text-4xl font-extrabold text-sky-700">{title}</h2>
        <p className="text-gray-600 mt-2 text-lg">{subtitle}</p>
      </div>
      <div className="flex gap-2 justify-end pr-3 -mt-8 mb-4">
        <button onClick={prev} className="w-10 h-10 rounded-full border bg-white hover:bg-gray-50 shadow-sm">‹</button>
        <button onClick={next} className="w-10 h-10 rounded-full border bg-white hover:bg-gray-50 shadow-sm">›</button>
      </div>

      <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 xl:grid-cols-4">
        {view.map((t)=>{
          const slug = slugify(t.name);
          const state = { tourId: t.id, propData: makePropData(t) };
          return (
            <article key={t.id} className="group bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100">
              <Link to={`/tours/${slug}`} state={state} className="relative h-60 block overflow-hidden">
                <img src={t.img} alt={t.name} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                {String(t.tag||"") && (
                  <span className="absolute top-3 left-3 bg-gradient-to-r from-amber-500 to-orange-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg">{t.tag}</span>
                )}
                <span className="absolute bottom-3 right-3 bg-black/60 backdrop-blur-sm text-white px-3 py-1 rounded-lg text-xs font-medium">
                  {t.duration} ngày
                </span>
              </Link>

              <div className="p-5">
                <div className="flex items-center gap-1 text-xs font-semibold text-sky-600 mb-2">
                   <svg viewBox="0 0 24 24" fill="none" className="w-4 h-4"><path d="M12 21s-7-5.686-7-11a7 7 0 1114 0c0 5.314-7 11-7 11z" stroke="currentColor" strokeWidth="1.5"/><circle cx="12" cy="10" r="2.5" stroke="currentColor" strokeWidth="1.5"/></svg>
                   {t.location}
                </div>
                <Link to={`/tours/${slug}`} state={state} className="block text-lg font-bold leading-snug line-clamp-2 text-gray-800 group-hover:text-sky-600 transition-colors">
                  {t.name}
                </Link>
                
                <div className="mt-4 flex items-end justify-between border-t pt-4 border-gray-100">
                  <div>
                    <p className="text-xs text-gray-400 line-through mb-0.5">{t.oldPrice && fmt(t.oldPrice)}</p>
                    <p className="text-xl font-bold text-rose-600">{fmt(t.price)}</p>
                  </div>
                  <div className="flex flex-col items-end">
                     <div className="flex items-center gap-1 mb-1">
                        <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
                        <span className="text-sm font-bold text-gray-700">{t.rating}</span>
                     </div>
                     <Link to={`/tours/${slug}`} state={state} className="text-sm font-medium text-sky-600 hover:underline">Chi tiết &rarr;</Link>
                  </div>
                </div>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}

/* =============== DAILY TOUR =============== */
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
    <section className="mt-20">
      <div className="text-center mb-8">
        <h2 className="text-3xl md:text-4xl font-extrabold text-sky-700">Daily Tour Khám Phá</h2>
        <p className="text-gray-600 mt-2">Những hành trình ngắn ngày hấp dẫn nhất miền Trung</p>
      </div>

      <div className="flex justify-center mb-8">
        <div className="inline-flex bg-gray-100 p-1 rounded-xl">
          {CITY_KEYS.map(c=>(
            <button 
              key={c} 
              onClick={()=>setTab(c)} 
              className={`px-6 py-2 rounded-lg text-sm font-bold transition-all ${tab===c ? "bg-white text-sky-600 shadow-sm" : "text-gray-500 hover:text-gray-700"}`}
            >
              {c}
            </button>
          ))}
        </div>
      </div>

      <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 xl:grid-cols-4">
        {view.map(t=>{
          const slug = slugify(t.name);
          const state = { tourId: t.id, propData: makePropData(t) };
          return (
            <article key={`${tab}-${t.id}`} className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all overflow-hidden">
              <Link to={`/tours/${slug}`} state={state} className="relative h-48 block overflow-hidden">
                <img src={t.img} alt={t.name} className="w-full h-full object-cover hover:scale-105 transition-transform duration-500" />
                <span className="absolute bottom-2 left-2 bg-black/50 text-white text-[10px] px-2 py-1 rounded backdrop-blur-sm">
                  ID: {t.id}
                </span>
              </Link>

              <div className="p-4">
                <Link to={`/tours/${slug}`} state={state} className="font-bold text-gray-800 line-clamp-2 hover:text-sky-600 min-h-[3rem]">
                  {t.name}
                </Link>
                
                <div className="mt-3 flex items-center justify-between pt-3 border-t border-gray-50">
                   <span className="text-rose-600 font-bold">{fmt(t.price)}</span>
                   <div className="flex items-center gap-1 text-xs text-gray-500">
                      <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
                      {t.rating} ({Math.floor(Math.random() * 50 + 10)} đánh giá)
                   </div>
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
    { id: 1, title: "Lễ hội Pháo hoa Quốc tế Đà Nẵng", date: "Tháng 6 - Tháng 7", img: "https://danangfantasticity.com/wp-content/uploads/2023/04/le-hoi-phao-hoa-quoc-te-da-nang-2023-diff-2023-the-gioai-khong-khoang-canh-tu-02-06-den-08-07-2023.jpg", desc: "Màn trình diễn ánh sáng đẳng cấp bên sông Hàn." },
    { id: 2, title: "Festival Huế 2025", date: "Tháng 4", img: "https://vov2.vov.vn/sites/default/files/styles/large/public/2023-05/a335.jpg", desc: "Tôn vinh di sản văn hóa cố đô." },
    { id: 3, title: "Lễ hội Đèn lồng Hội An", date: "14 Âm lịch hàng tháng", img: "https://owa.bestprice.vn/images/destinations/uploads/le-hoi-den-long-hoi-an-5fd32524a1a82.jpg", desc: "Lung linh sắc màu phố cổ về đêm." },
  ];
  return (
    <section className="mt-20">
      <h2 className="text-2xl font-bold text-gray-900 mb-6 border-l-4 border-sky-500 pl-4">Sự kiện & Lễ hội sắp tới</h2>
      <div className="grid md:grid-cols-3 gap-6">
        {events.map(e=>(
          <article key={e.id} className="group bg-white rounded-2xl border border-gray-100 overflow-hidden hover:shadow-lg transition-all">
            <div className="h-48 overflow-hidden">
                <img src={e.img} alt={e.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
            </div>
            <div className="p-5">
              <div className="text-xs font-bold text-sky-600 uppercase tracking-wider mb-1">{e.date}</div>
              <h3 className="font-bold text-lg text-gray-800 mb-2">{e.title}</h3>
              <p className="text-sm text-gray-500">{e.desc}</p>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

function Testimonials() {
  const items = [
    {name:"Minh Anh", text:"Mình đã có chuyến đi Đà Nẵng tuyệt vời nhờ sự tư vấn nhiệt tình của các bạn. HDV rất am hiểu và vui tính.", star:5, role: "Khách du lịch từ HN"},
    {name:"Hữu Phú", text:"Dịch vụ đặt tour nhanh chóng, giá cả minh bạch. Rất thích cách các bạn sắp xếp lịch trình.", star:5, role: "Khách du lịch từ SG"},
    {name:"Trà My", text:"Gia đình mình có người già và trẻ nhỏ nhưng tour đi rất thoải mái, không bị mệt. Cảm ơn TravelTour!", star:5, role: "Gia đình 4 người"},
  ];
  return (
    <section className="mt-20 bg-slate-50 rounded-3xl p-8 md:p-12">
      <div className="text-center mb-10">
        <h2 className="text-3xl font-bold text-gray-900">Khách hàng nói gì về chúng tôi?</h2>
      </div>
      <div className="grid md:grid-cols-3 gap-6">
        {items.map((c,i)=>(
          <div key={i} className="bg-white p-6 rounded-2xl shadow-sm relative">
            <div className="absolute -top-3 left-6 text-4xl text-sky-200">"</div>
            <p className="text-gray-600 italic mb-4 relative z-10">{c.text}</p>
            <div className="flex items-center gap-3 border-t pt-4">
                <div className="w-10 h-10 bg-sky-100 rounded-full flex items-center justify-center text-sky-600 font-bold">
                    {c.name.charAt(0)}
                </div>
                <div>
                    <div className="font-bold text-gray-900">{c.name}</div>
                    <div className="text-xs text-gray-500">{c.role}</div>
                </div>
                <div className="ml-auto flex text-amber-400">
                    {Array.from({length:5}).map((_,k)=><Star key={k}/>)}
                </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

function Newsletter() {
  return (
    <section className="mt-20 mb-10">
       <div className="bg-gradient-to-r from-indigo-600 to-sky-500 rounded-3xl p-8 md:p-12 text-white flex flex-col md:flex-row items-center justify-between gap-8 shadow-2xl shadow-sky-200">
          <div className="md:w-1/2">
            <h2 className="text-3xl font-bold mb-2">Đăng ký nhận ưu đãi</h2>
            <p className="text-sky-100">Nhận ngay voucher giảm giá 10% cho lần đặt tour đầu tiên và cập nhật các điểm đến mới nhất.</p>
          </div>
          <form onSubmit={(e)=>e.preventDefault()} className="w-full md:w-1/2 flex gap-2">
            <input className="flex-1 rounded-xl px-4 py-3 text-gray-800 outline-none focus:ring-2 focus:ring-yellow-400" placeholder="Nhập email của bạn..." />
            <button className="bg-yellow-400 text-blue-900 font-bold px-6 py-3 rounded-xl hover:bg-yellow-300 transition shadow-lg">Đăng ký</button>
          </form>
       </div>
    </section>
  );
}

/* =============== PAGE =============== */
export default function HomePage() {
  return (
    <div className="w-full min-h-screen bg-white">
      <Hero />
      <main className="mx-auto max-w-7xl px-6 pb-10">
        <FeaturedTours items={TOURS} autoMs={5000} />
        <DailyTours autoMs={5000} />
        <EventCards />
        <Testimonials />
        <Newsletter />
      </main>

      <footer className="bg-gray-900 text-gray-400 border-t border-gray-800">
        <div className="mx-auto max-w-7xl px-6 py-12 grid md:grid-cols-4 gap-8 text-sm">
           <div>
              <h4 className="text-white font-bold text-lg mb-4">TravelTour</h4>
              <p>Đồng hành cùng bạn trên mọi nẻo đường miền Trung.</p>
           </div>
           <div>
              <h4 className="text-white font-bold mb-4">Về chúng tôi</h4>
              <ul className="space-y-2">
                 <li><a href="#" className="hover:text-white">Giới thiệu</a></li>
                 <li><a href="#" className="hover:text-white">Tuyển dụng</a></li>
                 <li><a href="#" className="hover:text-white">Liên hệ</a></li>
              </ul>
           </div>
           <div>
              <h4 className="text-white font-bold mb-4">Điều khoản</h4>
              <ul className="space-y-2">
                 <li><a href="#" className="hover:text-white">Chính sách bảo mật</a></li>
                 <li><a href="#" className="hover:text-white">Điều khoản sử dụng</a></li>
                 <li><a href="#" className="hover:text-white">Chính sách hoàn tiền</a></li>
              </ul>
           </div>
           <div>
              <h4 className="text-white font-bold mb-4">Theo dõi</h4>
              <div className="flex gap-4">
                 <a href="#" className="w-8 h-8 bg-gray-800 flex items-center justify-center rounded-full hover:bg-sky-600 hover:text-white transition">F</a>
                 <a href="#" className="w-8 h-8 bg-gray-800 flex items-center justify-center rounded-full hover:bg-pink-600 hover:text-white transition">I</a>
                 <a href="#" className="w-8 h-8 bg-gray-800 flex items-center justify-center rounded-full hover:bg-red-600 hover:text-white transition">Y</a>
              </div>
           </div>
        </div>
        <div className="border-t border-gray-800 py-6 text-center text-xs">
          © {new Date().getFullYear()} TravelTour. All rights reserved.
        </div>
      </footer>
    </div>
  );
}
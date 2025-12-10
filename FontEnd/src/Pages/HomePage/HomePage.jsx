// src/Pages/HomePage/HomePage.jsx
import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaCheck } from "react-icons/fa";
import CustomuseApi from "../../Services/AxiosFetchApi";
import { CustomItemProduct } from "../../components/Ui/Ui.jsx";



function ViewList() {
  const introduceWebsiteTour = [
    "Hướng dẫn viên chuyên nghiệp",
    "Lịch trình linh hoạt",
    "Hỗ trợ 24/7",
    "Giá tốt nhất",
  ];

  const locationDefault = ["Đà Nẵng", "Hội An", "Huế"];
  const items = [
    { name: "Minh Anh", text: "Mình đã có chuyến đi Đà Nẵng tuyệt vời nhờ sự tư vấn nhiệt tình của các bạn. HDV rất am hiểu và vui tính.", star: 5, role: "Khách du lịch từ HN" },
    { name: "Hữu Phú", text: "Dịch vụ đặt tour nhanh chóng, giá cả minh bạch. Rất thích cách các bạn sắp xếp lịch trình.", star: 5, role: "Khách du lịch từ SG" },
    { name: "Trà My", text: "Gia đình mình có người già và trẻ nhỏ nhưng tour đi rất thoải mái, không bị mệt. Cảm ơn TravelTour!", star: 5, role: "Gia đình 4 người" },
  ];
  const events = [
    { id: 1, title: "Lễ hội Pháo hoa Quốc tế Đà Nẵng", date: "Tháng 6 - Tháng 7", img: "https://danangfantasticity.com/wp-content/uploads/2023/04/le-hoi-phao-hoa-quoc-te-da-nang-2023-diff-2023-the-gioai-khong-khoang-canh-tu-02-06-den-08-07-2023.jpg", desc: "Màn trình diễn ánh sáng đẳng cấp bên sông Hàn." },
    { id: 2, title: "Festival Huế 2025", date: "Tháng 4", img: "https://vov2.vov.vn/sites/default/files/styles/large/public/2023-05/a335.jpg", desc: "Tôn vinh di sản văn hóa cố đô." },
    { id: 3, title: "Lễ hội Đèn lồng Hội An", date: "14 Âm lịch hàng tháng", img: "https://owa.bestprice.vn/images/destinations/uploads/le-hoi-den-long-hoi-an-5fd32524a1a82.jpg", desc: "Lung linh sắc màu phố cổ về đêm." },
  ];
  const [Data, setData] = useState([]);
  const [DataDailyTour, setDataDailyTour] = useState([]);
  const [TagDailyTour, setTagDailyTour] = useState("Đà Nẵng");

  // pagination
  const [startIndex, setStartIndex] = useState(0);
  const itemsPerPage = 4;
  const visibleItems = Data.slice(startIndex, startIndex + itemsPerPage);

  const handlePrev = () => {
    setStartIndex((prev) => Math.max(prev - itemsPerPage, 0));
  };

  const handleNext = () => {
    setStartIndex((prev) =>
      Math.min(prev + itemsPerPage, Data.length - itemsPerPage)
    );
  };
  localStorage.removeItem("idProduct");

  // Load API
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

  // Lọc daily tour theo vị trí
  useEffect(() => {
    const dataMock = Data.filter(
      item => (item.locationText && item.locationText.includes(TagDailyTour)) ||
        (item.location && item.location.includes(TagDailyTour))
    );
    console.log("Filtered Daily Tours:", dataMock);
    setDataDailyTour(dataMock);
  }, [TagDailyTour, Data]);

  const navigate = useNavigate();
  return (
    <div>
      {/* HEADER */}
      <header className="relative">
        <div className="h-[600px] w-full">
          <img
            src="https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=1600"
            alt="Da Nang beach"
            className="h-full w-full object-cover"
          />
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
              Tận hưởng kỳ nghỉ trọn vẹn với lịch trình linh hoạt, cá nhân hoá
              và đội ngũ hỗ trợ tận tâm 24/7.
            </p>

            <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <button
                onClick={() => navigate(`/booking`)}
                className="rounded-full bg-yellow-400 px-8 py-4 font-bold text-blue-900 shadow-lg shadow-yellow-400/30 transition hover:-translate-y-1 hover:bg-yellow-300"
              >
                Đặt Tour Ngay
              </button>
              <button
                onClick={() =>
                  document
                    .getElementById("featured-tours")
                    .scrollIntoView({ behavior: "smooth" })
                }
                className="rounded-full border-2 border-white/30 bg-white/10 px-8 py-4 font-bold text-white backdrop-blur-sm transition hover:bg-white/20"
              >
                Xem Điểm Đến
              </button>
            </div>

            <ul className="mt-10 flex flex-wrap justify-center gap-6 text-sm font-medium text-white/80">
              {introduceWebsiteTour.map((t, i) => (
                <li key={i} className="flex items-center gap-2">
                  <div className="flex h-6 w-6 items-center justify-center rounded-full bg-emerald-500 text-white">
                    <FaCheck />
                  </div>
                  {t}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </header>

      {/* TOUR NỔI BẬT */}
      <div id="featured-tours" className="mt-16 mx-auto max-w-7xl px-6 pb-10">
        <div className="text-center">
          <h2 className="text-3xl md:text-4xl font-extrabold text-sky-700">
            Tour Nổi Bật
          </h2>
          <p className="text-gray-600 mt-2 text-lg">
            Dịch vụ chất lượng – điểm đến hấp dẫn
          </p>
        </div>

        <div className="flex gap-2 justify-end pr-3 -mt-8 mb-4">
          <button
            onClick={handlePrev}
            className="w-10 h-10 rounded-full border bg-white hover:bg-gray-50 shadow-sm"
            disabled={startIndex === 0}
          >
            ‹
          </button>
          <button
            onClick={handleNext}
            className="w-10 h-10 rounded-full border bg-white hover:bg-gray-50 shadow-sm"
            disabled={startIndex + itemsPerPage >= Data.length}
          >
            ›
          </button>
        </div>

        <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 xl:grid-cols-4">
          {visibleItems.map((props) => (
            <CustomItemProduct props={props} />
          ))}
        </div>
      </div>

      {/* DAILY TOUR */}
      <div className="mt-16 mx-auto max-w-7xl px-6 pb-10">
        <div className="text-center">
          <h2 className="text-3xl md:text-4xl font-extrabold text-sky-700">
            Daily Tour Khám Phá
          </h2>
          Những hành trình ngắn ngày hấp dẫn nhất miền Trung
          <p className="text-gray-600 mt-2 text-lg">
          </p>
        </div>

        <div className="flex flex-col items-center gap-4 mb-8">
          {/* Filter buttons */}
          <div className="inline-flex bg-gray-100 p-1 rounded-xl">
            {locationDefault.map((c, index) => (
              <div
                key={index}
                onClick={() => setTagDailyTour(c)}
                className={`px-6 py-2 rounded-lg text-sm font-bold cursor-pointer transition-all ${TagDailyTour === c
                  ? "bg-white shadow text-sky-700"
                  : "text-gray-500"
                  }`}
              >
                {c}
              </div>
            ))}
          </div>
          <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 xl:grid-cols-4">
            {DataDailyTour.slice(0, 4).map((props, index) => (
              <CustomItemProduct props={props} key={props.id || index} />
            ))}
          </div>
        </div>
      </div>
      {/* ----EventCards------------------- */}
      <section className="mt-10 mx-auto max-w-7xl">
        <h2 className="text-2xl font-bold text-gray-900 mb-6 border-l-4 border-sky-500 pl-4">Sự kiện & Lễ hội sắp tới</h2>
        <div className="grid md:grid-cols-3 gap-6">
          {events.map(e => (
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
      {/* -------------------- */}
      <section className="mt-20 bg-slate-50 rounded-3xl p-8 md:p-12">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold text-gray-900">Khách hàng nói gì về chúng tôi?</h2>
        </div>
        <div className="grid md:grid-cols-3 gap-6">
          {items.map((c, i) => (
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
                  {console.log(Array)}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
      {/* ------------- */}
      <section className="mt-20 mb-10">
        <div className="bg-gradient-to-r from-indigo-600 to-sky-500 rounded-3xl p-8 md:p-12 text-white flex flex-col md:flex-row items-center justify-between gap-8 shadow-2xl shadow-sky-200">
          <div className="md:w-1/2">
            <h2 className="text-3xl font-bold mb-2">Đăng ký nhận ưu đãi</h2>
            <p className="text-sky-100">Nhận ngay voucher giảm giá 10% cho lần đặt tour đầu tiên và cập nhật các điểm đến mới nhất.</p>
          </div>
          <form onSubmit={(e) => e.preventDefault()} className="w-full md:w-1/2 flex gap-2">
            <input className="flex-1 rounded-xl px-4 py-3 text-gray-800 outline-none focus:ring-2 focus:ring-yellow-400" placeholder="Nhập email của bạn..." />
            <button className="bg-yellow-400 text-blue-900 font-bold px-6 py-3 rounded-xl hover:bg-yellow-300 transition shadow-lg">Đăng ký</button>
          </form>
        </div>
      </section>

    </div>
  );
}

export default ViewList;

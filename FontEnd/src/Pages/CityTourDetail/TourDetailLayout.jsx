import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import CustomuseApi from "../../Services/AxiosFetchApi.jsx";
import { FaRegClock, FaCheckCircle } from "react-icons/fa";
import { vnd } from "../../utils/money.js";

export default function TourDetailLayout() {
  const { slug } = useParams();
  const [data, setData] = useState(null);
  const [tab, setTab] = useState(0);
  const [textbtn, setTextbtn] = useState(1);
  const [price, setPrice] = useState(0);

  const handleGetProduc = (product) => {
    localStorage.removeItem("idProduct");
    localStorage.setItem("idProduct", JSON.stringify({ id: product._id }));
  };
  const addProductItems = () => {
    localStorage.setItem("ArrayProduct", JSON.stringify([data]));

  };


  // TABS
  const buttonsView = [
    { key: 0, name: "Mô Tả Tour" },
    {
      key: 1,
      name: "Bao Gồm Loại Trừ",
      include: ["HDV địa phương", "Xe đưa đón", "Vé tham quan", "Nước suối"],
      exclude: ["Ăn uống ngoài chương trình", "Chi phí cá nhân", "Thuế VAT"],
    },
    {
      key: 2,
      name: "Chương Trình Tour",
      plan: ["Đón khách – tham quan", "Ăn trưa – nghỉ ngơi", "Mua sắm – tiễn khách"],
    },
    {
      key: 3,
      name: "Giá Vé Trẻ Em",
      kid: ["< 5 tuổi: Free", "5-9 tuổi: 70%", "> 10 tuổi: 100%"],
    },
    { key: 4, name: "Đánh Giá" },
  ];

  // Handle + -
  const handleTextbtn = (type) => {
    if (type === "plus") setTextbtn((prev) => prev + 1);
    else if (type === "minus") setTextbtn((prev) => (prev === 1 ? 1 : prev - 1));
  };

  // LOAD API
  useEffect(() => {
    async function loadData() {
      try {
        const result = await CustomuseApi({
          Url: `staff/GetProduct/${slug}`,
          method: "GET",
        });
        setData(result?.product || null);
      } catch (error) {
        console.log("API ERROR:", error);
      }
    }

    if (slug) loadData();
  }, [slug]);


  // CALC PRICE
  useEffect(() => {
    if (data?.price) {
      setPrice(data.price * textbtn);
    }
  }, [textbtn, data]);

  if (!data)
    return (
      <div className="p-10 text-center text-slate-500 text-lg">
        Đang tải dữ liệu tour...
      </div>
    );

  return (
    <div className="bg-[#fafafa] min-h-screen pb-10">
      <div className="mx-auto max-w-7xl px-4 md:px-6 py-6" key={data._id}>

        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl md:text-3xl font-bold text-slate-900 mb-2">
            {data.name}
          </h1>

          <div className="flex items-center text-sm text-slate-500 gap-2">
            <span>{data.locationText}</span>
            <span className="mx-2">|</span>
            <span className="font-semibold text-slate-700">{data.rating || 5}</span>
            <span>(Đánh giá tốt)</span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_380px] gap-8 items-start">

          {/* LEFT */}
          <section className="space-y-8">

            {/* GALLERY */}
            <div className="bg-white rounded-2xl overflow-hidden shadow-sm p-2 border border-slate-100">
              <img
                className="w-full aspect-[16/9] rounded-xl object-cover hover:scale-105 transition"
                src={data.images[0]}
                alt="tour-main"
              />

              <div className="mt-2 grid grid-cols-5 gap-2">
                {data.images.map((img, i) => (
                  <img
                    key={i}
                    src={img}
                    alt="tour-thumb"
                    className="w-full h-20 object-cover rounded-lg hover:scale-105 transition"
                  />
                ))}
              </div>
            </div>

            {/* INFO GRID */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">

                {/* Duration */}
                <div className="flex gap-3 p-2">
                  <div className="w-10 h-10 rounded-full bg-rose-50 text-rose-600 flex items-center justify-center">
                    <FaRegClock size={20} />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-slate-400 uppercase">Thời lượng</div>
                    <div className="font-semibold">{data.duration} ngày</div>
                  </div>
                </div>


                {/* Capacity */}
                <div className="flex gap-3 p-2">
                  <div className="w-10 h-10 rounded-full bg-rose-50 text-rose-600 flex items-center justify-center">
                    <FaRegClock size={20} />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-slate-400 uppercase">Quy mô</div>
                    <div className="font-semibold">{data.capacity}</div>
                  </div>
                </div>

                {/* Age */}
                <div className="flex gap-3 p-2">
                  <div className="w-10 h-10 rounded-full bg-rose-50 text-rose-600 flex items-center justify-center">
                    <FaRegClock size={20} />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-slate-400 uppercase">Độ tuổi</div>
                    <div className="font-semibold">{data.minAge}</div>
                  </div>
                </div>

                {/* Pickup */}
                <div className="flex gap-3 p-2">
                  <div className="w-10 h-10 rounded-full bg-rose-50 text-rose-600 flex items-center justify-center">
                    <FaRegClock size={20} />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-slate-400 uppercase">Đón tại điểm</div>
                    <div className="font-semibold">{data.pickup}</div>
                  </div>
                </div>

              </div>
            </div>

            {/* TABS */}
            <div className="bg-white rounded-2xl shadow-sm border overflow-hidden">
              <div className="flex flex-wrap gap-2 px-6 pt-6 border-b pb-4">
                {buttonsView.map((btn) => (
                  <button
                    key={btn.key}
                    onClick={() => setTab(btn.key)}
                    className={`px-4 py-2 text-sm font-bold rounded-full transition
                    ${tab === btn.key
                        ? "bg-slate-900 text-white"
                        : "bg-slate-100 text-slate-600 hover:bg-slate-200"}
                  `}
                  >
                    {btn.name}
                  </button>
                ))}
              </div>

              <div className="p-6">
                {tab === 0 && (
                  <ul className="space-y-3">
                    {data.data1.map((x, i) => (
                      <li key={i} className="flex gap-2">
                        <FaCheckCircle className="text-emerald-500" /> {x}
                      </li>
                    ))}
                  </ul>
                )}

                {tab === 1 && (
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-bold text-emerald-600 mb-2">ĐÃ BAO GỒM</h4>
                      <ul>
                        {buttonsView[1].include.map((x, i) => (
                          <li key={i}>• {x}</li>
                        ))}
                      </ul>
                    </div>

                    <div>
                      <h4 className="font-bold text-rose-600 mb-2">CHƯA BAO GỒM</h4>
                      <ul>
                        {buttonsView[1].exclude.map((x, i) => (
                          <li key={i}>• {x}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                )}

                {tab === 2 && (
                  <div className="space-y-4">
                    {buttonsView[2].plan.map((x, i) => (
                      <div key={i}>
                        <h4 className="font-bold">Ngày {i + 1}</h4>
                        <p>{x}</p>
                      </div>
                    ))}
                  </div>
                )}

                {tab === 3 && (
                  <ul>
                    {buttonsView[3].kid.map((x, i) => (
                      <li key={i}>• {x}</li>
                    ))}
                  </ul>
                )}

                {tab === 4 && <div>Đánh giá</div>}
              </div>
            </div>
          </section>

          {/* RIGHT */}
          <aside className="lg:sticky lg:top-24 space-y-6">
            <div className="bg-white rounded-2xl shadow-xl border p-6">

              <div className="mb-6 pb-6 border-b">
                <span className="text-3xl font-extrabold text-rose-600">
                  {vnd(data.price)}
                </span>
                <span className="text-xs ml-1"> / khách</span>
              </div>

              <div className="space-y-4">
                <div className="bg-slate-50 p-4 rounded-xl flex justify-between font-bold">
                  <span>Tổng tính</span>
                  <span>{vnd(price)}</span>
                </div>

                <div>
                  <button onClick={() => {
                    addProductItems();
                    alert("Thêm Thành Công");
                  }} className="mt-2 w-full py-3.5 rounded-xl text-white font-bold shadow-lg bg-gradient-to-r from-rose-600 to-orange-600">
                    Thêm Vô Gio Hàng
                  </button>
                  <Link to={"/booking"}>
                    <button
                      onClick={() => handleGetProduc(data)}
                      className="mt-2 w-full py-3.5 rounded-xl text-white font-bold shadow-lg bg-gradient-to-r from-rose-700 to-orange-600 hover:from-rose-800 hover:to-orange-700"
                    >
                      Thuê Hướng Dẫn Viên Cá Nhân
                    </button>
                  </Link>
                </div>

              </div>
            </div>
          </aside>

        </div>
      </div>
    </div>
  );
}

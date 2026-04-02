import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const images = [
  "https://vietnamtravelmart.com.vn/wp-content/uploads/images1248012-unnamed-1468255588101.jpg",
  "https://www.agoda.com/wp-content/uploads/2024/01/Featured-image-Hoi-An-ancient-town.jpg",
  "https://static.vinwonders.com/production/linh-ung-pagoda-banner_optimized.jpg",
  "https://www.agoda.com/wp-content/uploads/2024/05/hoi-an.jpg",
];

export default function ImageSlider() {
  const [current, setCurrent] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    const itv = setInterval(
      () => setCurrent((p) => (p === images.length - 1 ? 0 : p + 1)),
      5000
    );
    return () => clearInterval(itv);
  }, []);

  return (
    <div className="relative w-full h-[500px] overflow-hidden rounded-lg shadow-lg">
      {images.map((img, i) => (
        <img
          key={i}
          src={img}
          alt={`slide-${i}`}
          className={`absolute w-full h-full object-cover transition-opacity duration-1000 ${
            i === current ? "opacity-100" : "opacity-0"
          }`}
        />
      ))}

      {/* phủ nhẹ để chữ nổi hơn */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/15 to-transparent" />

      {/* Khối nội dung: tiêu đề, mô tả, nút */}
      <div className="absolute left-1/2 -translate-x-1/2 bottom-10 w-[min(92%,900px)] text-center px-4">
        <h2 className="text-white text-3xl sm:text-4xl font-extrabold drop-shadow-md">
          Thành phố đáng sống
        </h2>

        <p className="mt-3 text-white/90 text-base sm:text-lg leading-relaxed drop-shadow">
          Khám phá Đà Nẵng – nơi nhịp sống hiện đại hòa cùng biển xanh, núi biếc.
          Ẩm thực phong phú, con người thân thiện và vô vàn trải nghiệm “đáng đi –
          đáng nhớ”. Sẵn sàng cho hành trình của bạn?
        </p>

        {/* Nút trong suốt */}
        <button
          onClick={() => navigate("/tours")}
          className="mt-6 inline-flex items-center gap-2 px-7 py-3 rounded-xl border border-white/80 text-white font-semibold 
                     bg-transparent hover:bg-white/15 active:bg-white/25 backdrop-blur-sm
                     transition transform hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-white/60"
        >
          Đặt ngay
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7l5 5m0 0l-5 5m5-5H6"/>
          </svg>
        </button>

        {/* chấm vị trí slide (tuỳ chọn) */}
        <div className="mt-4 flex justify-center gap-2">
          {images.map((_, i) => (
            <span
              key={i}
              className={`h-2 w-2 rounded-full ${i === current ? "bg-white" : "bg-white/50"}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

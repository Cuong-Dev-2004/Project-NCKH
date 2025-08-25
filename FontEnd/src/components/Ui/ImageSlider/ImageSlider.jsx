import { useState, useEffect } from "react";
import { BsFillArrowLeftCircleFill, BsFillArrowRightCircleFill } from "../../../assets/Icon/Icon"
const images = [
    "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1200&q=80",
    "https://images.unsplash.com/photo-1505761671935-60b3a7427bad?w=1200&q=80",
    "https://images.unsplash.com/photo-1470770841072-f978cf4d019e?w=1200&q=80",
];

function ImageSlider() {
    const [current, setCurrent] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrent((prev) => (prev === images.length - 1 ? 0 : prev + 1));
        }, 5000);
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="relative w-full h-[500px] overflow-hidden rounded-lg shadow-lg">
            {images.map((img, index) => (
                <img
                    key={index}
                    src={img}
                    alt={`slide-${index}`}
                    className={`absolute top-0 left-0 w-full h-full object-cover transition-opacity duration-1000 ${index === current ? "opacity-100" : "opacity-0"
                        }`}
                />
            ))}

            <button
                onClick={() =>
                    setCurrent(current === 0 ? images.length - 1 : current - 1)
                }
                className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/70 p-3 rounded-full hover:bg-white"
            >
                <BsFillArrowLeftCircleFill className="text-gray-500" />
            </button>
            <button
                onClick={() =>
                    setCurrent(current === images.length - 1 ? 0 : current + 1)
                }
                className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/70 p-3 rounded-full hover:bg-white"
            >
                <BsFillArrowRightCircleFill className="text-gray-500" />
            </button>


            <div className="absolute bottom-4 w-full flex justify-center space-x-2">
                {images.map((_, index) => (
                    <button
                        key={index}
                        onClick={() => setCurrent(index)}
                        className={`w-3 h-3 rounded-full ${index === current ? "bg-blue-600" : "bg-gray-300"
                            }`}
                    />
                ))}
            </div>
        </div>
    );
}

export default ImageSlider;

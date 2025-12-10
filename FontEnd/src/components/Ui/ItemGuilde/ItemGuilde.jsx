import React from "react";
import { FaMapPin, FaGlobe, FaStar, FaRegCheckCircle } from "react-icons/fa";
import { vnd } from "../../../utils/money";

function ItemViewGuilde({ props, selectedGuide, setPriceGuilde }) {
    if (!props) return null;

    const isSelected = selectedGuide === props._id;

    return (
        <div
            className={`relative bg-white rounded-2xl p-5 shadow-sm border transition-all duration-300
                ${isSelected ? "border-indigo-500 ring-2 ring-indigo-300" : "border-slate-100 hover:shadow-md hover:-translate-y-1"}
            `}
        >
            {/* Dấu tích đã chọn */}
            {isSelected && (
                <div className="absolute top-4 left-4 bg-indigo-600 text-white px-3 py-1 rounded-full text-xs font-bold shadow-md flex items-center gap-1">
                    <FaRegCheckCircle size={12} /> Đã chọn
                </div>
            )}

            {/* Trạng thái */}
            <div
                className={`absolute top-4 right-4 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wide
                    ${props.availability[0].isAvailable ? "bg-emerald-100 text-emerald-700" : "bg-rose-100 text-rose-700"}
                `}
            >
                {props.availability[0].isAvailable ? "Có sẵn" : "Đang bận"}
            </div>

            {/* Avatar + basic info */}
            <div className="flex flex-col items-center text-center mb-4">
                <img
                    src={props?.image || "https://upload.wikimedia.org/wikipedia/commons/thumb/1/12/User_icon_2.svg/250px-User_icon_2.svg.png"}
                    alt={props?.fullName}
                    className={`w-20 h-20 rounded-full object-cover ring-4 shadow-sm mb-3 
                        ${props?.availability[0].isAvailable ? "ring-slate-50" : "ring-rose-50 grayscale"}
                    `}
                />
                <h3 className="font-bold text-lg text-slate-800">{props?.fullName}</h3>

                <div className="flex items-center justify-center gap-2 text-xs text-slate-500 mt-1">
                    <span className="flex items-center gap-1">
                        <FaMapPin size={12} /> {props?.location}
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                        <FaGlobe size={12} /> {props?.languages.join(", ")}
                    </span>
                </div>
            </div>

            {/* Rating */}
            <div className="grid grid-cols-2 gap-2 mb-4 text-xs text-slate-600 bg-slate-50 p-3 rounded-xl">
                <div className="flex items-center gap-1.5 justify-end">
                    <FaStar size={14} className="text-amber-400" /> {props?.ratingAverage}
                </div>
            </div>

            {/* Giá & nút chọn */}
            <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                <div>
                    <span className="text-lg font-bold text-indigo-600">{vnd(props?.pricePerHour)}</span>
                    <span className="text-xs text-slate-400"> / ngày</span>
                </div>

                <button
                    disabled={!props.availability[0].isAvailable}
                    onClick={() => setPriceGuilde(props)}
                    className={`px-5 py-2 rounded-xl text-sm font-semibold shadow-sm transition-all
                        ${isSelected
                            ? "bg-rose-500 text-white hover:bg-rose-600"
                            : props.availability[0].isAvailable
                                ? "bg-slate-900 text-white hover:bg-indigo-600"
                                : "bg-rose-50 text-rose-500 border border-rose-100 cursor-not-allowed"
                        }`}

                >
                    {isSelected ? "Hủy" : "Chọn"}
                </button>
            </div>
        </div>
    );
}

export default ItemViewGuilde;

import { Link } from "react-router-dom";
import { IoStar } from "react-icons/io5";

function CustomItemProduct({ props }) {
    const fmt = (n) => (Number(n || 0)).toLocaleString("vi-VN") + "đ";

    return (
        <div className="group bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100">

            {/* Link bằng _id */}
            <Link to={`/tours/${props._id}`} className="relative h-60 block overflow-hidden">
                <img
                    src={props.images[0]}
                    alt={props.name}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                {String(props.tag || "") && (
                    <span className="absolute top-3 left-3 bg-gradient-to-r from-amber-500 to-orange-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg">
                        {props.tag}
                    </span>
                )}
                <span className="absolute bottom-3 right-3 bg-black/60 backdrop-blur-sm text-white px-3 py-1 rounded-lg text-xs font-medium">
                    {props.duration} ngày
                </span>
            </Link>

            <div className="p-5">
                <div className="flex items-center gap-1 text-xs font-semibold text-sky-600 mb-2">
                    <svg viewBox="0 0 24 24" fill="none" className="w-4 h-4">
                        <path d="M12 21s-7-5.686-7-11a7 7 0 1114 0c0 5.314-7 11-7 11z" stroke="currentColor" strokeWidth="1.5" />
                        <circle cx="12" cy="10" r="2.5" stroke="currentColor" strokeWidth="1.5" />
                    </svg>
                    {props.location}
                </div>

                {/* Link bằng _id */}
                <Link
                    to={`/tours/${props._id}`}
                    className="block text-lg font-bold leading-snug line-clamp-2 text-gray-800 group-hover:text-sky-600 transition-colors"
                >
                    {props.name}
                </Link>

                <div className="mt-4 flex items-end justify-between border-t pt-4 border-gray-100">
                    <div>
                        <p className="text-xs text-gray-400 line-through mb-0.5">
                            {props.oldPrice && fmt(props.oldPrice)}
                        </p>
                        <p className="text-xl font-bold text-rose-600">{fmt(props.price)}</p>
                    </div>
                    <div className="flex flex-col items-end">
                        <div className="flex items-center gap-1 mb-1">
                            <IoStar className="w-4 h-4 text-amber-400 fill-amber-400" />
                            <span className="text-sm font-bold text-gray-700">{props.rating}</span>
                        </div>

                        {/* Link bằng _id */}
                        <Link
                            to={`/tours/${props._id}`}
                            className="text-sm font-medium text-sky-600 hover:underline"
                        >
                            Chi tiết →
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default CustomItemProduct;

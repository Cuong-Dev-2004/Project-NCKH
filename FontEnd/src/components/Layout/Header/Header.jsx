import { Link } from "react-router-dom";

function Header() {
    return (
        <header className="bg-white shadow-md sticky top-0 z-50 min-w-screen">
            <div className="flex items-center justify-between px-8 py-4">

                {/* Logo */}
                <Link to="/" className="text-2xl font-bold text-blue-600">
                    TravelTour
                </Link>

                {/* Navigation */}
                <nav className="hidden md:flex space-x-8 font-medium text-gray-700">
                    <Link to="/" className="hover:text-blue-600">Trang Chủ</Link>
                    <Link to="/tours" className="hover:text-blue-600">Tour</Link>
                    <Link to="/destinations" className="hover:text-blue-600">Điểm Đến</Link>
                    <Link to="/blog" className="hover:text-blue-600">Blog</Link>
                    <Link to="/contact" className="hover:text-blue-600">Liên Hệ</Link>
                </nav>

                {/* Nút Đặt Tour */}
                <div className="flex">
                    <div className="ml-2">
                        <Link
                            to="/booking"
                            className="bg-blue-600 text-white px-5 py-2 rounded-lg hover:bg-blue-700 transition"
                        >
                            Đặt Tour
                        </Link>
                    </div>
                    <div className="ml-2">
                        <Link
                            to="/TourBookingFlow"
                            className="bg-blue-600 text-white px-5 py-2 rounded-lg hover:bg-blue-700 transition"
                        >
                            Thuê
                        </Link>
                    </div>
                </div>
            </div>
        </header>
    );
}

export default Header;

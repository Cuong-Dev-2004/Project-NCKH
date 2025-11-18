import React from "react";
import { FaFacebook, FaInstagram, FaYoutube, FaPhone, FaEnvelope, FaMapMarkerAlt } from "react-icons/fa";

export default function Footer() {
    return (
        <footer className="bg-blue-900 text-white py-10">
            <div className="max-w-6xl mx-auto px-5 grid grid-cols-1 md:grid-cols-4 gap-8">


                <div>
                    <h3 className="text-lg font-semibold mb-4">Về Chúng Tôi</h3>
                    <p className="text-gray-300">
                        Công ty du lịch ABC chuyên cung cấp tour trong và ngoài nước với giá tốt nhất.
                    </p>
                </div>
                <div>
                    <h3 className="text-lg font-semibold mb-4">Liên Kết Nhanh</h3>
                    <ul className="space-y-2">
                        <li><a href="/about" className="hover:text-yellow-400">Giới thiệu</a></li>
                        <li><a href="/tours" className="hover:text-yellow-400">Tours</a></li>
                        <li><a href="/blog" className="hover:text-yellow-400">Blog Du Lịch</a></li>
                        <li><a href="/contact" className="hover:text-yellow-400">Liên hệ</a></li>
                    </ul>
                </div>
                <div>
                    <h3 className="text-lg font-semibold mb-4">Liên Hệ</h3>
                    <p className="flex items-center gap-2"><FaMapMarkerAlt /> 123 Lê Lợi, Q.1, TP.HCM</p>
                    <p className="flex items-center gap-2"><FaPhone /> 0909 123 456</p>
                    <p className="flex items-center gap-2"><FaEnvelope /> info@abcdulich.com</p>
                </div>
                <div>
                    <h3 className="text-lg font-semibold mb-4">Kết nối với chúng tôi</h3>
                    <div className="flex space-x-4 text-2xl">
                        <a href="#" className="hover:text-yellow-400"><FaFacebook /></a>
                        <a href="#" className="hover:text-yellow-400"><FaInstagram /></a>
                        <a href="#" className="hover:text-yellow-400"><FaYoutube /></a>
                    </div>
                </div>
            </div>

            {/* Bottom */}
            <div className="mt-8 border-t border-gray-700 pt-4 text-center text-sm text-gray-400">
                &copy; 2025 Công Ty Du Lịch ABC. All rights reserved.
            </div>
        </footer>
    );
}

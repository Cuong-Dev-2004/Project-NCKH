import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { UserPlus, Mail, Lock, User, Phone, Globe } from "lucide-react";
import CustomuseApi from "../../Services/AxiosFetchApi";

export default function RegisterPage() {
  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
    phone: "",
    nationality: "Việt Nam"
  });

  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  { console.log(form) }
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await CustomuseApi({
        Url: "auth/RegisterUser",
        method: "POST",
        data: form
      })
      alert("Tạo thành công");
      navigate("/login");
    } catch (error) {
      if (error.response) {
        alert("Lỗi: " + error.response.data.message);
      } else {
        alert("Lỗi: " + error.message);
      }
    }



    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4 py-10">
      <div className="bg-white p-8 rounded-2xl shadow-lg max-w-md w-full border border-slate-100">
        <h2 className="text-2xl font-bold text-center text-slate-800 mb-6">Đăng ký Khách Du Lịch</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-600 mb-1">Họ và tên</label>
            <div className="relative">
              <User size={18} className="absolute left-3 top-3 text-slate-400" />
              <input
                required name="username"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-emerald-500 outline-none"
                value={form.fullName} onChange={handleChange}
                placeholder="TenDangNhap"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-600 mb-1">Mật khẩu</label>
              <div className="relative">
                <Lock size={18} className="absolute left-3 top-3 text-slate-400" />
                <input
                  type="password" required name="password"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-emerald-500 outline-none"
                  value={form.password} onChange={handleChange}
                  placeholder="••••••"
                />
              </div>
            </div>

          </div>
          <div>
            <label className="block text-sm font-medium text-slate-600 mb-1">Email</label>
            <div className="relative">
              <Mail size={18} className="absolute left-3 top-3 text-slate-400" />
              <input
                type="email" required name="email"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-emerald-500 outline-none"
                value={form.email} onChange={handleChange}
                placeholder="email@example.com"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-600 mb-1">Số điện thoại</label>
              <div className="relative">
                <Phone size={18} className="absolute left-3 top-3 text-slate-400" />
                <input
                  required name="phone"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-emerald-500 outline-none"
                  value={form.phone} onChange={handleChange}
                  placeholder="090..."
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-600 mb-1">Quốc tịch</label>
              <div className="relative">
                <Globe size={18} className="absolute left-3 top-3 text-slate-400" />
                <input
                  required name="nationality"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-emerald-500 outline-none"
                  value={form.nationality} onChange={handleChange}
                />
              </div>
            </div>
          </div>




          <button
            disabled={loading}
            className="w-full py-3 bg-emerald-600 text-white font-bold rounded-xl hover:bg-emerald-700 transition flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {loading ? "Đang xử lý..." : "Đăng ký ngay"}
          </button>
        </form>

        <p className="text-center text-sm text-slate-500 mt-4">
          Đã có tài khoản? <Link to="/login" className="text-emerald-600 font-bold hover:underline">Đăng nhập</Link>
        </p>
      </div>
    </div>
  );
}
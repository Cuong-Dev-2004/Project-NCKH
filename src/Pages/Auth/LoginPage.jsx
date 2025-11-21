import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../utils/authContext";
import { LogIn, Mail, Lock } from "lucide-react";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("tourist"); // Mặc định là Khách
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    const res = await login(email, password, role);
    
    setLoading(false);
    if (res.success) {
      alert("Đăng nhập thành công!");
      // Chuyển hướng
      if (role === "admin") navigate("/admin/bookings");
      else navigate("/");
    } else {
      alert(res.message);
    }
  };

  // Hàm tạo nhanh Admin (Dùng 1 lần rồi xóa)
  const createInitialAdmin = async () => {
    try {
        await fetch("http://localhost:3000/api/admin/create-admin", {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({ email: "admin@gmail.com", password: "123" })
        });
        alert("Đã tạo Admin: admin@gmail.com / 123");
    } catch (err) { alert("Lỗi: " + err.message); }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4">
      <div className="bg-white p-8 rounded-2xl shadow-lg max-w-md w-full border border-slate-100">
        <h2 className="text-2xl font-bold text-center text-slate-800 mb-6">Đăng nhập</h2>
        
        <form onSubmit={handleSubmit} className="space-y-5">
          
          {/* Chọn Vai trò */}
          <div>
             <label className="block text-sm font-medium text-slate-600 mb-2">Bạn là:</label>
             <div className="flex gap-2 p-1 bg-slate-100 rounded-xl">
                {['tourist', 'guide', 'admin'].map((r) => (
                  <button 
                    key={r}
                    type="button"
                    onClick={() => setRole(r)}
                    className={`flex-1 py-2 text-xs font-bold rounded-lg transition capitalize ${
                      role === r 
                      ? "bg-white text-indigo-600 shadow-sm" 
                      : "text-slate-500 hover:text-slate-700"
                    }`}
                  >
                    {r === 'tourist' ? 'Khách' : r === 'guide' ? 'HDV' : 'Admin'}
                  </button>
                ))}
             </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-600 mb-1">Email</label>
            <div className="relative">
              <Mail size={18} className="absolute left-3 top-3 text-slate-400" />
              <input 
                type="email" required 
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none"
                value={email} onChange={e => setEmail(e.target.value)}
                placeholder={role === 'admin' ? "admin@gmail.com" : "email@example.com"}
              />
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-slate-600 mb-1">Mật khẩu</label>
            <div className="relative">
              <Lock size={18} className="absolute left-3 top-3 text-slate-400" />
              <input 
                type="password" required 
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none"
                value={password} onChange={e => setPassword(e.target.value)}
              />
            </div>
          </div>

          <button 
            disabled={loading}
            className="w-full py-3 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 transition flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {loading ? "Đang xử lý..." : <><LogIn size={20} /> Đăng nhập</>}
          </button>
        </form>

        <p className="text-center text-sm text-slate-500 mt-4">
          Chưa có tài khoản? <Link to="/register" className="text-indigo-600 font-bold hover:underline">Đăng ký ngay</Link>
        </p>
        
        {/* Nút tạo nhanh Admin (Xóa sau khi dùng xong) */}
        <div className="mt-4 text-center">
            <button onClick={createInitialAdmin} className="text-xs text-gray-400 underline hover:text-gray-600">
                (Dev Only) Tạo nhanh tài khoản Admin
            </button>
        </div>
      </div>
    </div>
  );
}
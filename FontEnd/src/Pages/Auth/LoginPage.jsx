import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { getToken, setToken } from "../../utils/auth";

function LoginPage() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    username: "",
    password: ""
  });

  const [loading, setLoading] = useState(false);

  const onChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!form.username || !form.password) {
      alert("Vui lòng nhập đủ username và mật khẩu.");
      return;
    }

    try {
      setLoading(true);

      const res = await axios.post("http://localhost:3000/api/auth/Login", form);

      setToken(res.data.token);

      alert("Đăng nhập thành công!");

      navigate("/");

    } catch (error) {
      alert("Đăng nhập thất bại: " + error.response?.data?.message);
    } finally {
      setLoading(false);
    }
  };



  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-100 px-4">
      <div className="bg-white w-full max-w-sm p-8 rounded-2xl shadow-lg border border-slate-200">

        <h1 className="text-2xl font-bold text-slate-800 text-center mb-6">
          Đăng Nhập
        </h1>

        <form className="space-y-4" onSubmit={handleLogin}>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1">
              Username
            </label>
            <input
              type="text"
              name="username"
              placeholder="username"
              value={form.username}
              onChange={onChange}
              className="w-full px-4 py-3 rounded-xl border border-slate-300 outline-none focus:ring-2 focus:ring-rose-500"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1">
              Mật khẩu
            </label>
            <input
              type="password"
              name="password"
              placeholder="••••••••"
              value={form.password}
              onChange={onChange}
              className="w-full px-4 py-3 rounded-xl border border-slate-300 outline-none focus:ring-2 focus:ring-rose-500"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-xl bg-gradient-to-r from-rose-600 to-orange-500 text-white font-bold shadow-md hover:opacity-90 transition"
          >
            {loading ? "Đang đăng nhập..." : "Đăng Nhập"}
          </button>

        </form>

      </div>
    </div>
  );
}

export default LoginPage;

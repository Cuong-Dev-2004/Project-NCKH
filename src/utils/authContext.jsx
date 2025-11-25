// src/utils/authContext.jsx
import { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();

// 🔥 CẤU HÌNH API URL (Server bạn chạy port 3000)
const BASE_URL = "http://localhost:3000/api"; 

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem("access_token") || "");

  // 1. Kiểm tra đăng nhập khi F5 (Reload trang)
  useEffect(() => {
    const storedToken = localStorage.getItem("access_token");
    const storedRole = localStorage.getItem("user_role");
    const storedName = localStorage.getItem("user_name");

    if (storedToken) {
      setUser({ name: storedName || "User", role: storedRole });
      setToken(storedToken);
    }
  }, []);

  // --- GỌI API ĐĂNG NHẬP ---
  const login = async (email, password, role) => {
    try {
      let endpoint = "";
      let bodyData = {};

      // 🔥 Logic chọn API dựa trên Role
      if (role === "admin") {
        endpoint = `${BASE_URL}/admin/login-admin`;
        bodyData = { email, password }; 
      } else {
        endpoint = `${BASE_URL}/auth/login`;
        bodyData = { email, password, role };
      }

      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(bodyData),
      });

      const data = await res.json();

      if (!res.ok) {
        return { success: false, message: data.message || "Đăng nhập thất bại" };
      }

      // --- XỬ LÝ KHI THÀNH CÔNG ---
      const token = data.token;
      const displayName = role === 'admin' ? "Admin" : (data.user?.fullName || email.split('@')[0]);

      localStorage.setItem("access_token", token);
      localStorage.setItem("user_role", role);
      localStorage.setItem("user_name", displayName);
      
      setToken(token);
      setUser({ email, role, name: displayName });
      
      return { success: true };
    } catch (error) {
      console.error("Login Error:", error);
      return { success: false, message: "Lỗi kết nối server! Đảm bảo Backend port 3000 đang chạy." };
    }
  };

  // --- GỌI API ĐĂNG KÝ (CHO KHÁCH DU LỊCH) ---
  const registerTourist = async (userData) => {
    try {
      const res = await fetch(`${BASE_URL}/auth/register-tourist`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(userData),
      });

      const data = await res.json();

      if (!res.ok) {
        return { success: false, message: data.message || "Đăng ký thất bại" };
      }
      return { success: true, message: "Đăng ký thành công! Bạn có thể đăng nhập." };
    } catch (error) {
      return { success: false, message: "Lỗi kết nối server!" };
    }
  };

  // --- ĐĂNG XUẤT (ĐÃ SỬA) ---
  const logout = () => {
    setUser(null);
    setToken("");
    
    // ❌ KHÔNG DÙNG: localStorage.clear(); (Vì nó sẽ xóa sạch dữ liệu HDV)
    
    // ✅ CHỈ XÓA THÔNG TIN ĐĂNG NHẬP
    localStorage.removeItem("access_token");
    localStorage.removeItem("user_role");
    localStorage.removeItem("user_name");
    
    window.location.href = "/login";
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout, registerTourist }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
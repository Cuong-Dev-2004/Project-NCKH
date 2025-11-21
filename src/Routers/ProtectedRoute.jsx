import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../utils/authContext";

export default function ProtectedRoute({ requireAdmin = false }) {
  const { user } = useAuth();

  // 1. Chưa đăng nhập -> Đá về trang login
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // 2. Yêu cầu quyền Admin mà user không phải Admin -> Đá về trang chủ
  if (requireAdmin && user.role !== "admin") {
    return <Navigate to="/" replace />;
  }

  // 3. Hợp lệ -> Cho vào
  return <Outlet />;
}
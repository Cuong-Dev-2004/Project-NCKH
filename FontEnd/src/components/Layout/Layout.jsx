import { Outlet, useLocation } from "react-router-dom";
import Header from "./Header/Header";
import SideBar from "./SideBar/SideBar"; // (chưa dùng thì có thể bỏ import)
import Footer from "./Footer/Footer";
import ImageSlider from "../Ui/ImageSlider/ImageSlider";
import ChatBox from "../Ui/ChatBox/ChatBox";

function Layout() {
  const { pathname } = useLocation();
  const showImageSlider = pathname === "/" || pathname === "/tours";

  // Những route muốn padding lớn
  const paddedRoutes = new Set(["/", "/tours"]);
  const largePadding = paddedRoutes.has(pathname);

  return (
    <div className="min-h-screen flex flex-col w-full">
      <Header />

      {showImageSlider && <ImageSlider />}

      <main className="flex flex-1 w-full">
        <div className={`flex-1 ${largePadding ? "px-5 md:px-20 py-4" : "px-0 md:px-0 py-0"}`}>
          {/* Mỗi page tự quyết định max-width nếu muốn */}
          <Outlet />
        </div>

        {/* Ẩn chatbox ở mobile để khỏi che nội dung */}
        <div className="hidden lg:block">
          <ChatBox />
        </div>
      </main>

      <Footer />
    </div>
  );
}

export default Layout;

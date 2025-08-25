import { Outlet } from "react-router-dom";
import Header from "./Header/Header";
import SideBar from "./SideBar/SideBar";
import Footer from "./Footer/Footer";
import ImageSlider from "../Ui/ImageSlider/ImageSlider";
import ChatBox from "../Ui/ChatBox/ChatBox";

function Layout() {
    return (
        <div className="min-h-screen flex flex-col w-full">
            <Header />
            <ImageSlider />
            <div className="flex flex-1 w-full">
                <div className="flex-1 p-4 px-20">
                    <Outlet />
                </div>
                <ChatBox />
            </div>
            <Footer />
        </div>
    );
}

export default Layout;

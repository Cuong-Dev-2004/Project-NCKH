import { Routes, Route } from "react-router-dom";
import { HomePage, OtherAi, Booking, TourBookingFlow } from "../Pages/Pages";
import Layout from "../components/Layout/Layout";
function Routers() {
    return (
        <Routes>
            <Route path="/" element={<Layout />} >
                <Route index element={<HomePage />} />
                <Route path="/OtherAi" element={<OtherAi />} />
                <Route path="/Booking" element={<Booking />} />
                <Route path="/TourBookingFlow" element={<TourBookingFlow />} />

            </Route>
        </Routes>
    );
}

export default Routers;
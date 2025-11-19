// src/App.jsx
import { BrowserRouter } from "react-router-dom";
import Router from "./Routers/Router.jsx";     // đúng CHỮ HOA thư mục Routers
import { CartProvider } from "./utils/cartContext.jsx";

export default function App() {
  return (
    <CartProvider>
      <BrowserRouter>
        <Router />
      </BrowserRouter>
    </CartProvider>
  );
}

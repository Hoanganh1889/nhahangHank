import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext";

export default function Navbar() {
  const { cart } = useCart();

  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div style={{ padding: "16px", background: "#eee", marginBottom: "20px" }}>
      <Link to="/" style={{ marginRight: "12px" }}>
        Trang chủ
      </Link>
      <Link to="/booking" style={{ marginRight: "12px" }}>
        Đặt món ({totalItems})
      </Link>
      <Link to="/admin/foods" style={{ marginRight: "12px" }}>
        Quản lý món
      </Link>
      <Link to="/admin/bookings">Quản lý booking</Link>
    </div>
  );
}
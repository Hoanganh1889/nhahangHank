import { BrowserRouter, Routes, Route } from "react-router-dom";
import HomePage from "../pages/HomePage";
import FoodDetail from "../pages/FoodDetail";
import BookingPage from "../pages/BookingPage";
import AdminFoodsPage from "../pages/AdminFoodsPage";
import AdminFoodFormPage from "../pages/AdminFoodFormPage";
import AdminBookingsPage from "../pages/AdminBookingsPage";
import Navbar from "../components/Navbar";

export default function AppRoutes() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/foods/:id" element={<FoodDetail />} />
        <Route path="/booking" element={<BookingPage />} />
        <Route path="/admin/foods" element={<AdminFoodsPage />} />
        <Route path="/admin/foods/new" element={<AdminFoodFormPage />} />
        <Route path="/admin/foods/edit/:id" element={<AdminFoodFormPage />} />
        <Route path="/admin/bookings" element={<AdminBookingsPage />} />
      </Routes>
    </BrowserRouter>
  );
}
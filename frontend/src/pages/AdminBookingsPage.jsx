import { useEffect, useState } from "react";
import axiosClient from "../api/axiosClient";
import { toast } from "react-toastify";

export default function AdminBookingsPage() {
  const [bookings, setBookings] = useState([]);

  const fetchBookings = async () => {
    try {
      const res = await axiosClient.get("/bookings");
      setBookings(res.data.data);
    } catch (error) {
      console.error(error);
      toast.error("Không lấy được danh sách booking");
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const handleChangeStatus = async (id, newStatus) => {
    try {
      await axiosClient.patch(`/bookings/${id}/status`, {
        status: newStatus,
      });

      toast.success("Cập nhật trạng thái thành công");
      fetchBookings();
    } catch (error) {
      console.error(error);
      toast.error("Cập nhật trạng thái thất bại");
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>Quản lý Booking</h2>

      <table border="1" cellPadding="10" cellSpacing="0" width="100%">
        <thead>
          <tr>
            <th>Khách hàng</th>
            <th>SĐT</th>
            <th>Địa chỉ</th>
            <th>Món đã đặt</th>
            <th>Tổng tiền</th>
            <th>Ghi chú</th>
            <th>Trạng thái</th>
            <th>Ngày tạo</th>
          </tr>
        </thead>
        <tbody>
          {bookings.map((booking) => (
            <tr key={booking._id}>
              <td>{booking.customerName}</td>
              <td>{booking.phone}</td>
              <td>{booking.address}</td>
              <td>
                {booking.items && booking.items.length > 0 ? (
                  booking.items.map((item, index) => (
                    <div key={index}>
                      {item.foodName} x {item.quantity}
                    </div>
                  ))
                ) : (
                  <span>Không có món</span>
                )}
              </td>
              <td>{booking.total?.toLocaleString("vi-VN")} đ</td>
              <td>{booking.note || "Không có"}</td>
              <td>
                <select
                  value={booking.status}
                  onChange={(e) =>
                    handleChangeStatus(booking._id, e.target.value)
                  }
                >
                  <option value="pending">pending</option>
                  <option value="confirmed">confirmed</option>
                  <option value="done">done</option>
                  <option value="cancelled">cancelled</option>
                </select>
              </td>
              <td>
                {new Date(booking.createdAt).toLocaleString("vi-VN")}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
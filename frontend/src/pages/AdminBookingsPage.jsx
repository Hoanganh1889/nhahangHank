import { useEffect, useState } from "react";
/**
 * LƯU Ý: 
 * Trình xem trước (Preview) không thể truy cập các tệp cục bộ như "../api/axiosClient".
 * Mã này được thiết kế để hoạt động trong dự án thực tế của bạn.
 */
import axiosClient from "../api/axiosClient";
import { toast } from "react-toastify";

// Icons
const ClockIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
);
const UserIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
);
const MapPinIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>
);

export default function AdminBookingsPage() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      const res = await axiosClient.get("/bookings");
      setBookings(res.data.data);
    } catch (error) {
      console.error(error);
      toast.error("Không lấy được danh sách đơn hàng");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://cdn.tailwindcss.com";
    document.head.appendChild(script);
    
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

  const getStatusStyle = (status) => {
    switch (status) {
      case 'pending': return 'bg-amber-50 text-amber-600 ring-amber-100';
      case 'confirmed': return 'bg-blue-50 text-blue-600 ring-blue-100';
      case 'done': return 'bg-green-50 text-green-600 ring-green-100';
      case 'cancelled': return 'bg-red-50 text-red-400 ring-red-100';
      default: return 'bg-slate-50 text-slate-600 ring-slate-100';
    }
  };

  return (
    <div className="min-h-screen bg-[#faf9f6] p-4 lg:p-10 font-sans text-slate-800">
      <div className="max-w-7xl mx-auto">
        
        {/* Header */}
        <div className="mb-10">
          <span className="text-orange-600 font-bold tracking-[0.3em] text-[10px] uppercase mb-2 block">Hệ thống quản trị</span>
          <h2 className="text-3xl font-serif text-slate-900">Danh Sách Đơn Hàng</h2>
          <p className="text-slate-400 text-sm mt-1">Theo dõi và cập nhật trạng thái các đơn đặt món của khách hàng.</p>
        </div>

        {/* Desktop Table Container */}
        <div className="bg-white rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.03)] border border-slate-50 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-50">
                  <th className="px-8 py-6 text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400 w-64">Khách hàng & Liên hệ</th>
                  <th className="px-6 py-6 text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400">Chi tiết món ăn</th>
                  <th className="px-6 py-6 text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400 text-right">Tổng thanh toán</th>
                  <th className="px-6 py-6 text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400 text-center">Trạng thái</th>
                  <th className="px-8 py-6 text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400 text-right">Thời gian</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {loading ? (
                  Array(3).fill(0).map((_, i) => (
                    <tr key={i} className="animate-pulse">
                      <td colSpan="5" className="px-8 py-10"><div className="h-12 bg-slate-50 rounded-2xl w-full"></div></td>
                    </tr>
                  ))
                ) : bookings.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="px-8 py-20 text-center text-slate-400 italic font-light">Chưa có đơn hàng nào được ghi nhận.</td>
                  </tr>
                ) : (
                  bookings.map((booking) => (
                    <tr key={booking._id} className="hover:bg-slate-50/50 transition-colors group">
                      <td className="px-8 py-6">
                        <div className="flex flex-col gap-1.5">
                          <div className="flex items-center gap-2 font-serif text-slate-900">
                            <span className="p-1 bg-slate-100 rounded-md text-slate-400"><UserIcon /></span>
                            {booking.customerName}
                          </div>
                          <div className="text-xs text-slate-500 font-medium ml-7">{booking.phone}</div>
                          <div className="text-[10px] text-slate-400 flex items-start gap-1 mt-1 ml-7">
                            <span className="shrink-0 mt-0.5"><MapPinIcon /></span>
                            <span className="line-clamp-1 italic">{booking.address}</span>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-6">
                        <div className="space-y-1">
                          {booking.items?.map((item, idx) => (
                            <div key={idx} className="text-xs text-slate-600 flex justify-between gap-4">
                              <span>{item.foodName}</span>
                              <span className="text-slate-400 font-bold tracking-tighter">x{item.quantity}</span>
                            </div>
                          ))}
                          {booking.note && (
                            <div className="mt-2 p-2 bg-orange-50/50 rounded-lg text-[10px] text-orange-700 italic border border-orange-100/50 font-medium">
                              Lưu ý: {booking.note}
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-6 text-right">
                        <div className="font-bold text-slate-900 font-mono text-sm">
                          {booking.total?.toLocaleString("vi-VN")} đ
                        </div>
                      </td>
                      <td className="px-6 py-6">
                        <div className="flex justify-center">
                          <select
                            value={booking.status}
                            onChange={(e) => handleChangeStatus(booking._id, e.target.value)}
                            className={`px-3 py-1.5 rounded-xl text-[10px] font-bold uppercase tracking-wider outline-none ring-1 transition-all cursor-pointer appearance-none text-center min-w-[110px] ${getStatusStyle(booking.status)}`}
                          >
                            <option value="pending">Chờ xử lý</option>
                            <option value="confirmed">Đã nhận đơn</option>
                            <option value="done">Hoàn tất</option>
                            <option value="cancelled">Đã hủy</option>
                          </select>
                        </div>
                      </td>
                      <td className="px-8 py-6 text-right">
                        <div className="flex flex-col items-end gap-1">
                          <div className="text-[11px] font-bold text-slate-900 tracking-tight">
                            {new Date(booking.createdAt).toLocaleDateString("vi-VN")}
                          </div>
                          <div className="flex items-center gap-1 text-[10px] text-slate-400 font-medium">
                            <ClockIcon />
                            {new Date(booking.createdAt).toLocaleTimeString("vi-VN", { hour: '2-digit', minute: '2-digit' })}
                          </div>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Footer Info */}
        <div className="mt-6 flex justify-between items-center px-4">
          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Cập nhật tự động sau mỗi phiên</p>
          <div className="flex gap-4">
             <div className="flex items-center gap-1.5 text-[10px] font-bold text-slate-400 uppercase tracking-tighter">
                <span className="w-2 h-2 rounded-full bg-amber-400"></span> Chờ xử lý
             </div>
             <div className="flex items-center gap-1.5 text-[10px] font-bold text-slate-400 uppercase tracking-tighter">
                <span className="w-2 h-2 rounded-full bg-green-500"></span> Đã hoàn tất
             </div>
          </div>
        </div>
      </div>
    </div>
  );
}
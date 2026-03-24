import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axiosClient from "../api/axiosClient";
import { toast } from "react-toastify";

// Icons
const EditIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"/><path d="m15 5 4 4"/></svg>
);
const TrashIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/></svg>
);
const PlusIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="M12 5v14"/></svg>
);

export default function AdminFoodsPage() {
  const [foods, setFoods] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchFoods = async () => {
    try {
      setLoading(true);
      const res = await axiosClient.get("/foods");
      setFoods(res.data.data);
    } catch (error) {
      console.error(error);
      toast.error("Không thể tải danh sách món ăn");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Tích hợp Tailwind CDN để đảm bảo giao diện hiển thị đúng
    const script = document.createElement("script");
    script.src = "https://cdn.tailwindcss.com";
    document.head.appendChild(script);
    
    fetchFoods();
  }, []);

  const handleDelete = async (id, name) => {
    // Lưu ý: Trong ứng dụng thực tế nên dùng một Modal UI thay vì confirm mặc định
    if (!window.confirm(`Quý khách có chắc chắn muốn xóa món "${name}" khỏi thực đơn?`)) return;

    try {
      await axiosClient.delete(`/foods/${id}`);
      toast.success("Đã xóa món ăn thành công");
      fetchFoods();
    } catch (error) {
      toast.error("Xóa món ăn thất bại");
      console.error(error);
    }
  };

  return (
    <div className="min-h-screen bg-[#faf9f6] p-4 lg:p-10 font-sans text-slate-800">
      <div className="max-w-7xl mx-auto">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-6">
          <div>
            <span className="text-orange-600 font-bold tracking-[0.3em] text-[10px] uppercase mb-2 block">Cổng quản trị</span>
            <h2 className="text-3xl font-serif text-slate-900">Quản Lý Thực Đơn</h2>
          </div>
          
          <Link to="/admin/foods/new">
            <button className="flex items-center gap-2 bg-slate-900 text-white px-6 py-3 rounded-2xl font-bold text-xs uppercase tracking-widest hover:bg-orange-600 transition-all shadow-lg shadow-slate-900/10 active:scale-95">
              <PlusIcon />
              Thêm món mới
            </button>
          </Link>
        </div>

        {/* Stats Summary (Optional) */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Tổng số món</p>
            <p className="text-2xl font-serif">{foods.length}</p>
          </div>
          <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Đang kinh doanh</p>
            <p className="text-2xl font-serif text-green-600">{foods.filter(f => f.isAvailable).length}</p>
          </div>
        </div>

        {/* Table Container */}
        <div className="bg-white rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.03)] border border-slate-50 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-50">
                  <th className="px-8 py-6 text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400">Hình ảnh</th>
                  <th className="px-6 py-6 text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400">Thông tin món</th>
                  <th className="px-6 py-6 text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400 text-center">Trạng thái</th>
                  <th className="px-6 py-6 text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400 text-right">Giá niêm yết</th>
                  <th className="px-8 py-6 text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400 text-center">Hành động</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {loading ? (
                  Array(5).fill(0).map((_, i) => (
                    <tr key={i} className="animate-pulse">
                      <td colSpan="5" className="px-8 py-6"><div className="h-10 bg-slate-50 rounded-xl w-full"></div></td>
                    </tr>
                  ))
                ) : foods.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="px-8 py-20 text-center text-slate-400 italic font-light">
                      Chưa có món ăn nào trong thực đơn.
                    </td>
                  </tr>
                ) : (
                  foods.map((food) => (
                    <tr key={food._id} className="hover:bg-slate-50/50 transition-colors group">
                      <td className="px-8 py-5">
                        <div className="relative w-16 h-16 rounded-2xl overflow-hidden shadow-sm group-hover:shadow-md transition-shadow">
                          <img 
                            src={food.image} 
                            alt={food.name} 
                            className="w-full h-full object-cover"
                            onError={(e) => { e.target.src = "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?q=80&w=200" }}
                          />
                        </div>
                      </td>
                      <td className="px-6 py-5">
                        <div className="font-serif text-slate-900 group-hover:text-orange-600 transition-colors">{food.name}</div>
                        <div className="text-[10px] text-slate-400 mt-1 uppercase tracking-wider font-medium">{food.category}</div>
                      </td>
                      <td className="px-6 py-5 text-center">
                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-tighter ${
                          food.isAvailable 
                            ? 'bg-green-50 text-green-600' 
                            : 'bg-red-50 text-red-400'
                        }`}>
                          <span className={`w-1.5 h-1.5 rounded-full mr-2 ${food.isAvailable ? 'bg-green-500' : 'bg-red-400'}`}></span>
                          {food.isAvailable ? "Sẵn sàng" : "Hết món"}
                        </span>
                      </td>
                      <td className="px-6 py-5 text-right font-medium text-slate-900">
                        {food.price.toLocaleString("vi-VN")} đ
                      </td>
                      <td className="px-8 py-5">
                        <div className="flex items-center justify-center gap-2">
                          <Link 
                            to={`/admin/foods/edit/${food._id}`}
                            className="p-2 text-slate-400 hover:text-orange-600 hover:bg-white rounded-xl transition-all shadow-none hover:shadow-sm"
                            title="Chỉnh sửa"
                          >
                            <EditIcon />
                          </Link>
                          <button 
                            onClick={() => handleDelete(food._id, food.name)}
                            className="p-2 text-slate-400 hover:text-red-500 hover:bg-white rounded-xl transition-all shadow-none hover:shadow-sm"
                            title="Xóa món"
                          >
                            <TrashIcon />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
          
          <div className="p-6 bg-slate-50/30 flex justify-between items-center border-t border-slate-50">
            <span className="text-xs text-slate-400">Hiển thị {foods.length} kết quả</span>
            <div className="flex gap-2">
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
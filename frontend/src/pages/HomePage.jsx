import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

// Khởi tạo các Icon SVG nội bộ mang phong cách thanh mảnh (Professional Line Icons)
const SearchIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
);
const FilterIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M22 3H2l8 9.46V19l4 2v-8.54L22 3z"/></svg>
);
const SortIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="m3 16 4 4 4-4"/><path d="M7 20V4"/><path d="m21 8-4-4-4 4"/><path d="M17 4v16"/></svg>
);
const ChevronLeftIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
);
const ChevronRightIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6"/></svg>
);
const StarIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="#fbbf24" stroke="#fbbf24" strokeWidth="1"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
);

// Khởi tạo axios trực tiếp
const axiosClient = axios.create({
  baseURL: "http://localhost:5000/api",
  headers: {
    "Content-Type": "application/json",
  },
});

export default function HomePage() {
  const [foods, setFoods] = useState([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [sort, setSort] = useState("");
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://cdn.tailwindcss.com";
    document.head.appendChild(script);
  }, []);

  const fetchFoods = async () => {
    setLoading(true);
    try {
      const res = await axiosClient.get("/foods", {
        params: { search, category, sort, page, limit: 6 },
      });
      setFoods(res.data.data || []);
    } catch (error) {
      console.error("Lỗi:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFoods();
  }, [search, category, sort, page]);

  return (
    <div className="min-h-screen bg-[#faf9f6] py-12 px-4 sm:px-6 lg:px-8 font-sans text-slate-800">
      <div className="max-w-6xl mx-auto">
        
        {/* Hero Header */}
        <div className="text-center mb-16">
          <span className="text-orange-600 font-semibold tracking-[0.2em] text-xs uppercase mb-3 block">
            Trải nghiệm ẩm thực thượng hạng
          </span>
          <h2 className="text-4xl md:text-5xl font-serif font-light text-slate-900 mb-4">
            Thực Đơn Độc Đáo 
          </h2>
          <div className="h-1 w-20 bg-orange-600 mx-auto rounded-full"></div>
        </div>

        {/* Toolbar: Search & Filters */}
        <div className="flex flex-col lg:flex-row gap-6 mb-12 items-center justify-between">
          {/* Search Box - Elegant Design */}
          <div className="relative w-full lg:max-w-md">
            <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none text-slate-400">
              <SearchIcon />
            </div>
            <input
              type="text"
              placeholder="Tìm kiếm hương vị bạn yêu thích..."
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1); }}
              className="w-full pl-12 pr-4 py-3.5 bg-white border-none shadow-[0_4px_20px_rgba(0,0,0,0.03)] rounded-2xl focus:ring-2 focus:ring-orange-500/20 transition-all outline-none text-sm placeholder:text-slate-400"
            />
          </div>

          <div className="flex gap-4 w-full lg:w-auto">
            {/* Category Select */}
            <div className="relative flex-1 lg:w-48 group">
              <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none text-slate-400 group-hover:text-orange-500 transition-colors">
                <FilterIcon />
              </div>
              <select
                value={category}
                onChange={(e) => { setCategory(e.target.value); setPage(1); }}
                className="w-full pl-11 pr-8 py-3.5 bg-white border-none shadow-[0_4px_20px_rgba(0,0,0,0.03)] rounded-2xl appearance-none focus:ring-2 focus:ring-orange-500/20 outline-none text-sm cursor-pointer"
              >
                <option value="">Tất cả danh mục</option>
                <option value="Món chính">Món chính</option>
                <option value="Nước uống">Nước uống</option>
              </select>
            </div>

            {/* Sort Select */}
            <div className="relative flex-1 lg:w-48 group">
              <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none text-slate-400 group-hover:text-orange-500 transition-colors">
                <SortIcon />
              </div>
              <select
                value={sort}
                onChange={(e) => setSort(e.target.value)}
                className="w-full pl-11 pr-8 py-3.5 bg-white border-none shadow-[0_4px_20px_rgba(0,0,0,0.03)] rounded-2xl appearance-none focus:ring-2 focus:ring-orange-500/20 outline-none text-sm cursor-pointer"
              >
                <option value="">Sắp xếp</option>
                <option value="price_asc">Giá tăng dần</option>
                <option value="price_desc">Giá giảm dần</option>
              </select>
            </div>
          </div>
        </div>

        {/* Main Content Grid */}
        {loading ? (
          <div className="flex flex-col justify-center items-center h-80 gap-4">
            <div className="w-10 h-10 border-4 border-orange-100 border-t-orange-600 rounded-full animate-spin"></div>
            <span className="text-slate-400 text-sm font-light tracking-widest">ĐANG CHUẨN BỊ...</span>
          </div>
        ) : foods.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
            {foods.map((food) => (
              <div
                key={food._id}
                className="group bg-white rounded-[2rem] overflow-hidden shadow-[0_10px_40px_rgba(0,0,0,0.02)] hover:shadow-[0_20px_50px_rgba(0,0,0,0.08)] transition-all duration-500 flex flex-col relative border border-slate-50"
              >
                {/* Image Section */}
                <div className="relative h-64 overflow-hidden">
                  <img
                    src={food.image || "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&q=80&w=800"}
                    alt={food.name}
                    className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700 ease-out"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  
                  {/* Category Tag */}
                  <div className="absolute top-5 left-5">
                    <span className="bg-white/90 backdrop-blur-md text-[10px] font-bold uppercase tracking-widest text-slate-800 px-3 py-1.5 rounded-full shadow-sm">
                      {food.category || "Tuyệt hảo"}
                    </span>
                  </div>
                </div>

                {/* Info Section */}
                <div className="p-8 flex-grow flex flex-col">
                  <div className="flex items-center gap-1 mb-2">
                    {[...Array(5)].map((_, i) => <StarIcon key={i} />)}
                    <span className="text-[10px] text-slate-400 ml-1 font-medium">(4.9)</span>
                  </div>
                  
                  <h3 className="text-xl font-serif text-slate-900 mb-2 group-hover:text-orange-600 transition-colors">
                    {food.name}
                  </h3>
                  
                  <p className="text-slate-400 text-sm font-light leading-relaxed mb-6 line-clamp-2">
                    Món ăn được chế biến từ những nguyên liệu tươi ngon nhất trong ngày bởi đầu bếp hàng đầu.
                  </p>

                  <div className="mt-auto flex items-center justify-between">
                    <div>
                      <span className="text-xs text-slate-400 block mb-0.5 uppercase tracking-tighter">Giá thưởng thức</span>
                      <span className="text-xl font-medium text-slate-900">
                        {new Intl.NumberFormat('vi-VN').format(food.price)} <span className="text-sm font-light">đ</span>
                      </span>
                    </div>
                    
                    <Link 
                      to={`/foods/${food._id}`}
                      className="h-12 w-12 rounded-full bg-slate-900 text-white flex items-center justify-center hover:bg-orange-600 transition-all duration-300 shadow-lg shadow-slate-900/10 active:scale-95"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-32 bg-white rounded-[3rem] shadow-sm border border-slate-100">
            <div className="mb-4 text-slate-200 flex justify-center">
               <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"><path d="M3 3h18v18H3z"/><path d="M9 9h6v6H9z"/></svg>
            </div>
            <p className="text-slate-400 font-light text-lg">Chúng tôi chưa tìm thấy hương vị này trong bếp...</p>
          </div>
        )}

        {/* Pagination - Minimalist */}
        <div className="mt-20 flex justify-center items-center gap-8">
          <button
            onClick={() => setPage(Math.max(1, page - 1))}
            disabled={page === 1}
            className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.2em] text-slate-500 hover:text-orange-600 disabled:opacity-20 disabled:pointer-events-none transition-all group"
          >
            <span className="transform group-hover:-translate-x-1 transition-transform"><ChevronLeftIcon /></span>
            Trước
          </button>
          
          <div className="flex items-center gap-3">
             <span className="h-[1px] w-8 bg-slate-200"></span>
             <span className="text-sm font-serif italic text-slate-900">Trang {page}</span>
             <span className="h-[1px] w-8 bg-slate-200"></span>
          </div>

          <button
            onClick={() => setPage(page + 1)}
            disabled={foods.length < 6}
            className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.2em] text-slate-500 hover:text-orange-600 disabled:opacity-20 disabled:pointer-events-none transition-all group"
          >
            Sau
            <span className="transform group-hover:translate-x-1 transition-transform"><ChevronRightIcon /></span>
          </button>
        </div>
      </div>
    </div>
  );
}
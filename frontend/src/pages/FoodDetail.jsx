import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";

// Các Icon SVG nội bộ
const ArrowLeftIcon = ({ className = "" }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="m12 19-7-7 7-7" />
    <path d="M19 12H5" />
  </svg>
);

const ShoppingBagIcon = ({ className = "" }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z" />
    <path d="M3 6h18" />
    <path d="M16 10a4 4 0 0 1-8 0" />
  </svg>
);

const CheckIcon = ({ className = "" }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <polyline points="20 6 9 17 4 12" />
  </svg>
);

const axiosClient = axios.create({
  baseURL: "http://localhost:5000/api",
});

export default function FoodDetail() {
  const { id } = useParams();
  const [food, setFood] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Nếu bạn chưa cài Tailwind bằng npm thì giữ tạm đoạn này
  useEffect(() => {
    const existingScript = document.querySelector(
      'script[src="https://cdn.tailwindcss.com"]'
    );
    if (!existingScript) {
      const script = document.createElement("script");
      script.src = "https://cdn.tailwindcss.com";
      document.head.appendChild(script);
    }
  }, []);

  useEffect(() => {
    const fetchFoodDetail = async () => {
      try {
        setLoading(true);
        const res = await axiosClient.get(`/foods/${id}`);
        setFood(res.data.data);
        setError("");
      } catch (err) {
        setError("Không lấy được chi tiết món ăn");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchFoodDetail();
  }, [id]);

  const handleAddToCart = (food) => {
    const cart = JSON.parse(localStorage.getItem("cart")) || [];

    const existingItem = cart.find((item) => item._id === food._id);

    if (existingItem) {
      existingItem.quantity += 1;
    } else {
      cart.push({
        _id: food._id,
        name: food.name,
        price: food.price,
        image: food.image,
        quantity: 1,
      });
    }

    localStorage.setItem("cart", JSON.stringify(cart));
    alert("Đã thêm vào danh sách đặt món");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#faf9f6] flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-orange-100 border-t-orange-600 rounded-full animate-spin"></div>
      </div>
    );
  }

  if (error || !food) {
    return (
      <div className="min-h-screen bg-[#faf9f6] flex flex-col items-center justify-center p-4">
        <p className="text-slate-400 font-light mb-6">
          {error || "Không tìm thấy món ăn"}
        </p>
        <Link
          to="/"
          className="text-orange-600 font-bold uppercase tracking-widest text-xs border-b border-orange-600 pb-1"
        >
          Quay lại thực đơn
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#faf9f6] py-12 px-4 sm:px-6 lg:px-8 font-sans text-slate-800">
      <div className="max-w-5xl mx-auto">
        <div className="mb-10">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.2em] text-slate-500 hover:text-orange-600 transition-colors group"
          >
            <ArrowLeftIcon />
            Trở về thực đơn
          </Link>
        </div>

        <div className="bg-white rounded-[3rem] shadow-[0_20px_60px_rgba(0,0,0,0.04)] border border-slate-50 overflow-hidden">
          <div className="flex flex-col lg:flex-row">
            <div className="lg:w-1/2 relative h-[400px] lg:h-auto overflow-hidden">
              <img
                src={
                  food.image ||
                  "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&q=80&w=800"
                }
                alt={food.name}
                className="w-full h-full object-cover"
              />
              <div className="absolute top-8 left-8">
                <span className="bg-white/90 backdrop-blur-md text-[10px] font-bold uppercase tracking-widest text-slate-800 px-4 py-2 rounded-full shadow-sm">
                  {food.category}
                </span>
              </div>
            </div>

            <div className="lg:w-1/2 p-8 lg:p-16 flex flex-col justify-center">
              <div className="mb-8">
                <div className="flex items-center gap-2 mb-4">
                  <div
                    className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                      food.isAvailable
                        ? "bg-green-50 text-green-600"
                        : "bg-red-50 text-red-600"
                    }`}
                  >
                    <div
                      className={`w-1.5 h-1.5 rounded-full ${
                        food.isAvailable ? "bg-green-600" : "bg-red-600"
                      }`}
                    ></div>
                    {food.isAvailable ? "Sẵn sàng phục vụ" : "Tạm hết món"}
                  </div>
                </div>

                <h1 className="text-4xl lg:text-5xl font-serif font-light text-slate-900 mb-6 leading-tight">
                  {food.name}
                </h1>

                <div className="text-3xl font-medium text-orange-600 mb-8">
                  {new Intl.NumberFormat("vi-VN").format(food.price)}{" "}
                  <span className="text-sm font-light text-slate-400">VNĐ</span>
                </div>

                <div className="h-[1px] w-full bg-slate-100 mb-8"></div>

                <div className="space-y-4 mb-10 text-slate-500 leading-relaxed font-light">
                  <p className="italic underline decoration-orange-200 decoration-2 underline-offset-4 mb-4 text-slate-800">
                    Mô tả tinh hoa:
                  </p>
                  <p>
                    {food.description ||
                      "Món ăn đặc sắc được chuẩn bị thủ công từ những nguyên liệu đạt chuẩn GlobalGAP, kết hợp cùng công thức gia truyền mang đậm dấu ấn nghệ thuật ẩm thực."}
                  </p>
                </div>

                <ul className="space-y-3 mb-12">
                  {[
                    "Nguyên liệu tươi sạch trong ngày",
                    "Chế biến bởi đầu bếp 5 sao",
                    "Không chất bảo quản",
                  ].map((item, idx) => (
                    <li
                      key={idx}
                      className="flex items-center gap-3 text-sm text-slate-600"
                    >
                      <div className="flex-shrink-0 w-5 h-5 rounded-full bg-orange-50 text-orange-600 flex items-center justify-center">
                        <CheckIcon />
                      </div>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>

              <button
                disabled={!food.isAvailable}
                onClick={() => handleAddToCart(food)}
                className={`w-full py-3 rounded-xl flex items-center justify-center gap-2 font-semibold text-sm transition-all duration-300 shadow-md active:scale-95 ${
                  food.isAvailable
                    ? "bg-slate-900 text-white hover:bg-orange-500"
                    : "bg-slate-200 text-slate-400 cursor-not-allowed"
                }`}
              >
                <ShoppingBagIcon className="w-5 h-5" />
                {food.isAvailable ? "Thêm vào đặt món" : "Hết món"}
              </button>
            </div>
          </div>
        </div>

        <p className="mt-12 text-center text-[10px] text-slate-400 uppercase tracking-[0.3em]">
          Hương vị tinh hoa • Phục vụ tận tâm
        </p>
      </div>
    </div>
  );
}
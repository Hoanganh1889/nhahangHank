import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useCart } from "../context/CartContext";
import axiosClient from "../api/axiosClient";
import { toast } from "react-toastify";

// Icons
const TrashIcon = ({ className = "" }) => (
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
    <path d="M3 6h18" />
    <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
    <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
  </svg>
);

const MinusIcon = ({ className = "" }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="14"
    height="14"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.5"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="M5 12h14" />
  </svg>
);

const PlusIcon = ({ className = "" }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="14"
    height="14"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.5"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="M5 12h14" />
    <path d="M12 5v14" />
  </svg>
);

// Validation Schema
const schema = yup.object({
  customerName: yup.string().required("Vui lòng nhập tên quý khách"),
  phone: yup
    .string()
    .required("Vui lòng nhập số điện thoại")
    .matches(/^(0[0-9]{9,10})$/, "Số điện thoại không hợp lệ"),
  address: yup.string().required("Vui lòng cung cấp địa chỉ giao hàng"),
  note: yup.string(),
});

export default function BookingPage() {
  const { cart = [], total = 0, dispatch } = useCart();
  const [submitting, setSubmitting] = useState(false);

  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      customerName: "",
      phone: "",
      address: "",
      note: "",
    },
  });

  // Chỉ nhúng Tailwind CDN nếu chưa có
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

  const updateQuantity = (id, delta) => {
    if (delta === 1) {
      dispatch({ type: "INCREASE_QUANTITY", payload: id });
    } else {
      dispatch({ type: "DECREASE_QUANTITY", payload: id });
    }
  };

  const removeItem = (id) => {
    dispatch({ type: "REMOVE_FROM_CART", payload: id });
  };

  const onSubmit = async (formData) => {
    if (cart.length === 0) {
      toast.error("Quý khách chưa chọn món ăn nào");
      return;
    }

    try {
      setSubmitting(true);

      const orderData = {
        ...formData,
        items: cart.map((item) => ({
          foodName: item.name,
          quantity: item.quantity,
          price: item.price,
        })),
        total,
        status: "pending",
      };

      await axiosClient.post("/bookings", orderData);

      toast.success("Đặt món thành công! Chúng tôi sẽ liên hệ quý khách sớm nhất.");
      dispatch({ type: "CLEAR_CART" });
      reset();
    } catch (error) {
      console.error(error);
      toast.error("Đã có lỗi xảy ra khi gửi yêu cầu");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#faf9f6] py-16 px-4 font-sans text-slate-800">
      <div className="max-w-6xl mx-auto">
        <header className="mb-12 text-center">
          <span className="text-orange-600 font-semibold tracking-[0.3em] text-[10px] uppercase mb-2 block">
            Thủ tục
          </span>
          <h2 className="text-4xl font-serif font-light text-slate-900">
            Xác Nhận Đơn Hàng
          </h2>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          {/* Danh sách món ăn */}
          <div className="lg:col-span-7">
            <div className="bg-white rounded-[2.5rem] p-8 shadow-[0_20px_50px_rgba(0,0,0,0.03)] border border-slate-50">
              <h3 className="text-lg font-serif mb-8 flex items-center gap-3">
                Thực đơn quý khách chọn
                <span className="text-[10px] font-sans font-bold bg-slate-100 px-2 py-0.5 rounded text-slate-500 uppercase tracking-tighter">
                  {totalItems} phần
                </span>
              </h3>

              <div className="space-y-6">
                {cart.length === 0 ? (
                  <div className="text-center py-20">
                    <p className="text-slate-400 font-light italic mb-6">
                      Giỏ hàng hiện đang trống.
                    </p>
                    <Link
                      to="/"
                      className="text-xs font-bold uppercase tracking-widest text-orange-600 border-b border-orange-600 pb-1 hover:text-slate-900 hover:border-slate-900 transition-all"
                    >
                      Trở lại thực đơn
                    </Link>
                  </div>
                ) : (
                  cart.map((item) => (
                    <div
                      key={item._id}
                      className="flex items-center gap-5 pb-6 border-b border-slate-50 last:border-0 last:pb-0"
                    >
                      <img
                        src={
                          item.image ||
                          "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&q=80&w=200"
                        }
                        alt={item.name}
                        className="w-20 h-20 rounded-2xl object-cover shadow-sm"
                      />

                      <div className="flex-grow">
                        <h4 className="font-medium text-slate-900 mb-1">
                          {item.name}
                        </h4>
                        <p className="text-orange-600 text-sm font-medium">
                          {new Intl.NumberFormat("vi-VN").format(item.price)} đ
                        </p>
                      </div>

                      <div className="flex items-center gap-3 bg-slate-50 rounded-xl p-1">
                        <button
                          type="button"
                          onClick={() => updateQuantity(item._id, -1)}
                          className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-white transition-colors text-slate-400 hover:text-orange-600"
                        >
                          <MinusIcon />
                        </button>

                        <span className="text-sm font-bold w-4 text-center">
                          {item.quantity}
                        </span>

                        <button
                          type="button"
                          onClick={() => updateQuantity(item._id, 1)}
                          className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-white transition-colors text-slate-400 hover:text-orange-600"
                        >
                          <PlusIcon />
                        </button>
                      </div>

                      <button
                        type="button"
                        onClick={() => removeItem(item._id)}
                        className="p-2 text-slate-300 hover:text-red-500 transition-colors"
                      >
                        <TrashIcon />
                      </button>
                    </div>
                  ))
                )}
              </div>

              <div className="mt-10 pt-8 border-t border-slate-100 space-y-3">
                <div className="flex justify-between text-sm text-slate-400">
                  <span>Tạm tính</span>
                  <span>{new Intl.NumberFormat("vi-VN").format(total)} đ</span>
                </div>

                <div className="flex justify-between items-center pt-4 border-t border-slate-50 mt-4">
                  <span className="text-lg font-serif">
                    Tổng giá trị đơn hàng
                  </span>
                  <span className="text-2xl font-bold text-slate-900">
                    {new Intl.NumberFormat("vi-VN").format(total)} đ
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Form thông tin khách hàng */}
          <div className="lg:col-span-5">
            <div className="bg-white rounded-[2.5rem] p-8 lg:p-10 shadow-[0_20px_50px_rgba(0,0,0,0.03)] border border-slate-50 sticky top-8">
              <h3 className="text-lg font-serif mb-8">Thông tin nhận món</h3>

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                <div>
                  <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-2 block ml-1">
                    Quý danh
                  </label>
                  <input
                    placeholder="Nhập tên quý khách..."
                    {...register("customerName")}
                    className={`w-full px-5 py-4 bg-slate-50 border-none rounded-2xl outline-none focus:ring-2 focus:ring-orange-500/20 transition-all text-sm ${
                      errors.customerName ? "ring-2 ring-red-100" : ""
                    }`}
                  />
                  {errors.customerName && (
                    <p className="text-[10px] text-red-500 mt-2 ml-1 italic">
                      {errors.customerName.message}
                    </p>
                  )}
                </div>

                <div>
                  <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-2 block ml-1">
                    Số điện thoại
                  </label>
                  <input
                    placeholder="09xx xxx xxx"
                    {...register("phone")}
                    className={`w-full px-5 py-4 bg-slate-50 border-none rounded-2xl outline-none focus:ring-2 focus:ring-orange-500/20 transition-all text-sm ${
                      errors.phone ? "ring-2 ring-red-100" : ""
                    }`}
                  />
                  {errors.phone && (
                    <p className="text-[10px] text-red-500 mt-2 ml-1 italic">
                      {errors.phone.message}
                    </p>
                  )}
                </div>

                <div>
                  <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-2 block ml-1">
                    Địa chỉ giao hàng
                  </label>
                  <input
                    placeholder="Số nhà, đường, quận/huyện..."
                    {...register("address")}
                    className={`w-full px-5 py-4 bg-slate-50 border-none rounded-2xl outline-none focus:ring-2 focus:ring-orange-500/20 transition-all text-sm ${
                      errors.address ? "ring-2 ring-red-100" : ""
                    }`}
                  />
                  {errors.address && (
                    <p className="text-[10px] text-red-500 mt-2 ml-1 italic">
                      {errors.address.message}
                    </p>
                  )}
                </div>

                <div>
                  <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-2 block ml-1">
                    Yêu cầu đặc biệt
                  </label>
                  <textarea
                    placeholder="Quý khách có lưu ý gì cho nhà bếp không?"
                    rows="3"
                    {...register("note")}
                    className="w-full px-5 py-4 bg-slate-50 border-none rounded-2xl outline-none focus:ring-2 focus:ring-orange-500/20 transition-all text-sm resize-none"
                  />
                </div>

                <button
                  type="submit"
                  disabled={cart.length === 0 || submitting}
                  className={`w-full py-5 rounded-2xl font-bold uppercase tracking-[0.2em] text-xs transition-all duration-300 shadow-xl mt-4 active:scale-[0.98] ${
                    cart.length > 0 && !submitting
                      ? "bg-slate-900 text-white hover:bg-orange-600 shadow-slate-900/10"
                      : "bg-slate-100 text-slate-300 cursor-not-allowed"
                  }`}
                >
                  {submitting ? "Đang gửi..." : "Xác Nhận Đặt Món"}
                </button>
              </form>

              <div className="mt-8 flex items-center justify-center gap-4 opacity-20 grayscale scale-75 lg:scale-90">
                <img
                  src="https://upload.wikimedia.org/wikipedia/commons/5/5e/Visa_Inc._logo.svg"
                  alt="visa"
                  className="h-4"
                />
                <img
                  src="https://upload.wikimedia.org/wikipedia/commons/2/2a/Mastercard-logo.svg"
                  alt="mastercard"
                  className="h-6"
                />
                <div className="h-4 w-[1px] bg-slate-300"></div>
                <span className="text-[10px] font-bold tracking-widest">
                  THANH TOÁN AN TOÀN
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
import { useEffect, useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import axiosClient from "../api/axiosClient";
import { toast } from "react-toastify";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

// Icons
const ArrowLeftIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m12 19-7-7 7-7"/><path d="M19 12H5"/></svg>
);
const UploadIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
);

const schema = yup.object({
  name: yup.string().required("Tên món không được để trống"),
  category: yup.string().required("Vui lòng chọn loại món"),
  price: yup
    .number()
    .typeError("Giá phải là số")
    .positive("Giá phải lớn hơn 0")
    .required("Giá không được để trống"),
  image: yup.string().required("Vui lòng nhập link ảnh hoặc upload ảnh"),
  description: yup.string(),
  isAvailable: yup.boolean(),
});

export default function AdminFoodFormPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = !!id;
  const [uploading, setUploading] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      name: "",
      category: "",
      price: "",
      image: "",
      description: "",
      isAvailable: true,
    },
  });

  const imageValue = watch("image");

  useEffect(() => {
    // Tích hợp Tailwind CDN
    const script = document.createElement("script");
    script.src = "https://cdn.tailwindcss.com";
    document.head.appendChild(script);

    if (isEdit) {
      fetchFoodDetail();
    }
  }, [id]);

  const fetchFoodDetail = async () => {
    try {
      const res = await axiosClient.get(`/foods/${id}`);
      reset(res.data.data);
    } catch (error) {
      console.error(error);
      toast.error("Không lấy được dữ liệu món ăn");
    }
  };

  const handleUploadImage = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("image", file);

    try {
      setUploading(true);
      const res = await axiosClient.post("/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setValue("image", res.data.imageUrl);
      toast.success("Tải ảnh lên thành công");
    } catch (error) {
      console.error(error);
      toast.error("Tải ảnh thất bại");
    } finally {
      setUploading(false);
    }
  };

  const onSubmit = async (data) => {
    try {
      if (isEdit) {
        await axiosClient.put(`/foods/${id}`, data);
        toast.success("Cập nhật thực đơn thành công");
      } else {
        await axiosClient.post("/foods", data);
        toast.success("Thêm món mới thành công");
      }
      navigate("/admin/foods");
    } catch (error) {
      console.error(error);
      toast.error("Lưu thông tin thất bại");
    }
  };

  return (
    <div className="min-h-screen bg-[#faf9f6] py-12 px-4 font-sans text-slate-800">
      <div className="max-w-4xl mx-auto">
        
        {/* Navigation & Header */}
        <div className="mb-10">
          <Link 
            to="/admin/foods" 
            className="inline-flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-slate-400 hover:text-orange-600 transition-colors mb-4"
          >
            <ArrowLeftIcon /> Trở lại danh sách
          </Link>
          <h2 className="text-3xl font-serif text-slate-900">
            {isEdit ? "Chỉnh Sửa Món Ăn" : "Thêm Món Mới"}
          </h2>
          <p className="text-slate-400 text-sm mt-1">
            {isEdit ? "Cập nhật các thông tin chi tiết của món ăn trong thực đơn." : "Tạo món ăn mới để hiển thị trên thực đơn của nhà hàng."}
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          
          {/* Main Info */}
          <div className="lg:col-span-7 space-y-6">
            <div className="bg-white p-8 rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.03)] border border-slate-50 space-y-6">
              
              <div>
                <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-2 block ml-1">Tên món ăn</label>
                <input
                  type="text"
                  placeholder="Ví dụ: Phở Bò Wagyu"
                  {...register("name")}
                  className={`w-full px-5 py-4 bg-slate-50 border-none rounded-2xl outline-none focus:ring-2 focus:ring-orange-500/20 transition-all text-sm ${errors.name ? 'ring-2 ring-red-100' : ''}`}
                />
                {errors.name && <p className="text-[10px] text-red-500 mt-2 ml-1 italic">{errors.name.message}</p>}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-2 block ml-1">Phân loại</label>
                  <select
                    {...register("category")}
                    className={`w-full px-5 py-4 bg-slate-50 border-none rounded-2xl outline-none focus:ring-2 focus:ring-orange-500/20 transition-all text-sm appearance-none ${errors.category ? 'ring-2 ring-red-100' : ''}`}
                  >
                    <option value="">-- Chọn loại --</option>
                    <option value="Món chính">Món chính</option>
                    <option value="Nước uống">Nước uống</option>
                    <option value="Tráng miệng">Tráng miệng</option>
                  </select>
                </div>

                <div>
                  <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-2 block ml-1">Giá bán (VNĐ)</label>
                  <input
                    type="number"
                    placeholder="0"
                    {...register("price")}
                    className={`w-full px-5 py-4 bg-slate-50 border-none rounded-2xl outline-none focus:ring-2 focus:ring-orange-500/20 transition-all text-sm ${errors.price ? 'ring-2 ring-red-100' : ''}`}
                  />
                </div>
              </div>

              <div>
                <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-2 block ml-1">Mô tả chi tiết</label>
                <textarea
                  rows="5"
                  placeholder="Mô tả về nguyên liệu, hương vị..."
                  {...register("description")}
                  className="w-full px-5 py-4 bg-slate-50 border-none rounded-2xl outline-none focus:ring-2 focus:ring-orange-500/20 transition-all text-sm resize-none"
                />
              </div>

              <div className="flex items-center gap-3 ml-1">
                <input 
                  type="checkbox" 
                  id="isAvailable"
                  {...register("isAvailable")} 
                  className="w-5 h-5 rounded-lg border-slate-200 text-orange-600 focus:ring-orange-500/20"
                />
                <label htmlFor="isAvailable" className="text-sm font-medium text-slate-600 select-none cursor-pointer">
                  Món ăn này hiện đang sẵn sàng để phục vụ
                </label>
              </div>
            </div>
          </div>

          {/* Media & Action */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-white p-8 rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.03)] border border-slate-50">
              <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-4 block ml-1 text-center">Hình ảnh đại diện</label>
              
              <div className="relative aspect-square rounded-[2rem] bg-slate-50 border-2 border-dashed border-slate-200 overflow-hidden group mb-6">
                {imageValue ? (
                  <>
                    <img 
                      src={imageValue} 
                      alt="Preview" 
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" 
                    />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                       <p className="text-white text-[10px] font-bold uppercase tracking-widest">Thay đổi ảnh</p>
                    </div>
                  </>
                ) : (
                  <div className="flex flex-col items-center justify-center h-full text-slate-300">
                    <UploadIcon />
                    <p className="text-[10px] font-bold uppercase tracking-widest mt-2">Chưa có ảnh</p>
                  </div>
                )}
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleUploadImage}
                  className="absolute inset-0 opacity-0 cursor-pointer"
                />
              </div>

              <div className="space-y-4">
                <div>
                  <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-2 block ml-1">Hoặc dán URL ảnh</label>
                  <input
                    type="text"
                    placeholder="https://..."
                    {...register("image")}
                    className={`w-full px-4 py-3 bg-slate-50 border-none rounded-xl outline-none focus:ring-2 focus:ring-orange-500/20 transition-all text-xs ${errors.image ? 'ring-2 ring-red-100' : ''}`}
                  />
                </div>

                {uploading && (
                  <div className="flex items-center gap-3 px-4 py-3 bg-orange-50 rounded-xl text-orange-600 animate-pulse">
                    <div className="w-4 h-4 border-2 border-orange-600 border-t-transparent rounded-full animate-spin"></div>
                    <span className="text-[10px] font-bold uppercase tracking-widest">Đang tải ảnh lên...</span>
                  </div>
                )}
              </div>
            </div>

            <button
              type="submit"
              disabled={uploading || isSubmitting}
              className={`w-full py-5 rounded-2xl font-bold uppercase tracking-[0.2em] text-xs transition-all duration-300 shadow-xl active:scale-[0.98] ${
                uploading || isSubmitting
                ? 'bg-slate-100 text-slate-300 cursor-not-allowed'
                : 'bg-slate-900 text-white hover:bg-orange-600 shadow-slate-900/10'
              }`}
            >
              {isSubmitting ? "Đang xử lý..." : isEdit ? "Cập Nhật Món Ăn" : "Thêm Vào Thực Đơn"}
            </button>
            
            <button
              type="button"
              onClick={() => navigate("/admin/foods")}
              className="w-full py-4 text-[10px] font-bold uppercase tracking-widest text-slate-400 hover:text-slate-900 transition-colors"
            >
              Hủy bỏ thay đổi
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
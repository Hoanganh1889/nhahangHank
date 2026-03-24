import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axiosClient from "../api/axiosClient";
import { toast } from "react-toastify";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

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
    formState: { errors },
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
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      setValue("image", res.data.imageUrl);
      toast.success("Upload ảnh thành công");
    } catch (error) {
      console.error(error);
      toast.error("Upload ảnh thất bại");
    } finally {
      setUploading(false);
    }
  };

  const onSubmit = async (data) => {
    try {
      if (isEdit) {
        await axiosClient.put(`/foods/${id}`, data);
        toast.success("Cập nhật món ăn thành công");
      } else {
        await axiosClient.post("/foods", data);
        toast.success("Thêm món ăn thành công");
      }

      navigate("/admin/foods");
    } catch (error) {
      console.error(error);
      toast.error("Lưu món ăn thất bại");
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>{isEdit ? "Sửa món ăn" : "Thêm món ăn"}</h2>

      <form onSubmit={handleSubmit(onSubmit)} style={{ maxWidth: "500px" }}>
        <div style={{ marginBottom: "12px" }}>
          <label>Tên món</label>
          <br />
          <input
            type="text"
            {...register("name")}
            style={{ width: "100%", padding: "8px" }}
          />
          <p style={{ color: "red" }}>{errors.name?.message}</p>
        </div>

        <div style={{ marginBottom: "12px" }}>
          <label>Loại món</label>
          <br />
          <select
            {...register("category")}
            style={{ width: "100%", padding: "8px" }}
          >
            <option value="">-- Chọn loại món --</option>
            <option value="Món chính">Món chính</option>
            <option value="Nước uống">Nước uống</option>
            <option value="Tráng miệng">Tráng miệng</option>
          </select>
          <p style={{ color: "red" }}>{errors.category?.message}</p>
        </div>

        <div style={{ marginBottom: "12px" }}>
          <label>Giá</label>
          <br />
          <input
            type="number"
            {...register("price")}
            style={{ width: "100%", padding: "8px" }}
          />
          <p style={{ color: "red" }}>{errors.price?.message}</p>
        </div>

        <div style={{ marginBottom: "12px" }}>
          <label>Link ảnh</label>
          <br />
          <input
            type="text"
            {...register("image")}
            style={{ width: "100%", padding: "8px" }}
            placeholder="Nhập URL ảnh hoặc upload file bên dưới"
          />
          <p style={{ color: "red" }}>{errors.image?.message}</p>
        </div>

        <div style={{ marginBottom: "12px" }}>
          <label>Hoặc upload ảnh từ máy</label>
          <br />
          <input type="file" accept="image/*" onChange={handleUploadImage} />
          {uploading && <p>Đang upload ảnh...</p>}
        </div>

        {imageValue && (
          <div style={{ marginBottom: "12px" }}>
            <p>Xem trước ảnh:</p>
            <img
              src={imageValue}
              alt="preview"
              style={{
                width: "150px",
                height: "150px",
                objectFit: "cover",
                border: "1px solid #ccc",
              }}
            />
          </div>
        )}

        <div style={{ marginBottom: "12px" }}>
          <label>Mô tả</label>
          <br />
          <textarea
            rows="4"
            {...register("description")}
            style={{ width: "100%", padding: "8px" }}
          />
        </div>

        <div style={{ marginBottom: "12px" }}>
          <label>
            <input type="checkbox" {...register("isAvailable")} />
            Còn bán
          </label>
        </div>

        <button type="submit" disabled={uploading}>
          {isEdit ? "Cập nhật" : "Thêm mới"}
        </button>
      </form>
    </div>
  );
}
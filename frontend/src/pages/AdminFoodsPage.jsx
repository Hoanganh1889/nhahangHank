import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axiosClient from "../api/axiosClient";
import { toast } from "react-toastify";

export default function AdminFoodsPage() {
  const [foods, setFoods] = useState([]);

  const fetchFoods = async () => {
    try {
      const res = await axiosClient.get("/foods");
      setFoods(res.data.data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchFoods();
  }, []);

  const handleDelete = async (id) => {
  const confirmDelete = window.confirm("Bạn có chắc muốn xóa món này?");
  if (!confirmDelete) return;

  try {
    await axiosClient.delete(`/foods/${id}`);
    toast.success("Xóa món ăn thành công");
    fetchFoods();
  } catch (error) {
    toast.error("Xóa món ăn thất bại");
    console.error(error);
  }
};

  return (
    <div style={{ padding: "20px" }}>
      <h2>Quản lý món ăn</h2>

      <Link to="/admin/foods/new">
        <button style={{ marginBottom: "20px" }}>+ Thêm món ăn</button>
      </Link>

      <table border="1" cellPadding="10" cellSpacing="0" width="100%">
        <thead>
          <tr>
            <th>Ảnh</th>
            <th>Tên món</th>
            <th>Loại</th>
            <th>Giá</th>
            <th>Trạng thái</th>
            <th>Hành động</th>
          </tr>
        </thead>
        <tbody>
          {foods.map((food) => (
            <tr key={food._id}>
              <td>
                <img src={food.image} alt={food.name} width="80" />
              </td>
              <td>{food.name}</td>
              <td>{food.category}</td>
              <td>{food.price.toLocaleString("vi-VN")} đ</td>
              <td>{food.isAvailable ? "Còn bán" : "Hết món"}</td>
              <td>
                <Link to={`/admin/foods/edit/${food._id}`}>
                  <button style={{ marginRight: "8px" }}>Sửa</button>
                </Link>
                <button onClick={() => handleDelete(food._id)}>Xóa</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
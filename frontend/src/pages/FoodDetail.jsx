import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import axiosClient from "../api/axiosClient";
import { useCart } from "../context/CartContext";
import { toast } from "react-toastify";

export default function FoodDetail() {
  const { id } = useParams();
  const [food, setFood] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const { dispatch } = useCart();


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

  if (loading) {
    return <h3 style={{ padding: "20px" }}>Đang tải dữ liệu...</h3>;
  }

  if (error) {
    return <h3 style={{ padding: "20px", color: "red" }}>{error}</h3>;
  }

  if (!food) {
    return <h3 style={{ padding: "20px" }}>Không tìm thấy món ăn</h3>;
  }

  return (
    <div style={{ padding: "20px" }}>
      <Link to="/">← Quay lại trang chủ</Link>

      <div
        style={{
          display: "flex",
          gap: "30px",
          marginTop: "20px",
          alignItems: "flex-start",
        }}
      >
        <div style={{ flex: 1 }}>
          <img
            src={food.image}
            alt={food.name}
            style={{
              width: "100%",
              maxWidth: "400px",
              border: "1px solid #ccc",
            }}
          />
        </div>

        <div style={{ flex: 1 }}>
          <h2>{food.name}</h2>
          <p>
            <strong>Loại món:</strong> {food.category}
          </p>
          <p>
            <strong>Giá:</strong> {food.price.toLocaleString("vi-VN")} đ
            </p>
          <p>
            <strong>Trạng thái:</strong>{" "}
            {food.isAvailable ? "Còn phục vụ" : "Tạm hết"}
          </p>
          <p>
            <strong>Mô tả:</strong>{" "}
            {food.description ? food.description : "Chưa có mô tả"}
          </p>

          <button
                onClick={() => {
                    dispatch({
                    type: "ADD_TO_CART",
                    payload: {
                        _id: food._id,
                        name: food.name,
                        price: food.price,
                        image: food.image,
                    },
                    });

                    toast.success("Đã thêm vào danh sách đặt món");
                }}
                style={{
                    marginTop: "15px",
                    padding: "10px 16px",
                    cursor: "pointer",
                }}
                >
                Thêm vào danh sách đặt món
                </button>
        </div>
      </div>
    </div>
  );
}
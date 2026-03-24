import axiosClient from "../api/axiosClient";
import { toast } from "react-toastify";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useCart } from "../context/CartContext";

const schema = yup.object({
  customerName: yup.string().required("Vui lòng nhập tên khách hàng"),
  phone: yup
    .string()
    .required("Vui lòng nhập số điện thoại")
    .matches(/^(0[0-9]{9,10})$/, "Số điện thoại không hợp lệ"),
  address: yup.string().required("Vui lòng nhập địa chỉ"),
  note: yup.string(),
});

export default function BookingPage() {
  const { cart, total, dispatch } = useCart();

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
      toast.error("Chưa có món nào để đặt");
      return;
    }

    try {
      const data = {
        ...formData,
        items: cart.map((item) => ({
          foodName: item.name,
          quantity: item.quantity,
          price: item.price,
        })),
        total,
        status: "pending",
      };

      await axiosClient.post("/bookings", data);

      toast.success("Đặt món thành công");
      dispatch({ type: "CLEAR_CART" });
      reset();
    } catch (error) {
      console.error(error);
      toast.error("Lỗi khi đặt món");
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>Danh sách đặt món</h2>

      {cart.length === 0 && <p>Chưa có món nào</p>}

      {cart.map((item) => (
        <div key={item._id} style={{ marginBottom: "10px" }}>
          <strong>{item.name}</strong> - {item.price.toLocaleString("vi-VN")} đ
          <br />

          <button type="button" onClick={() => updateQuantity(item._id, -1)}>
            -
          </button>
          <span style={{ margin: "0 10px" }}>{item.quantity}</span>
          <button type="button" onClick={() => updateQuantity(item._id, 1)}>
            +
          </button>

          <button
            type="button"
            onClick={() => removeItem(item._id)}
            style={{ marginLeft: "10px" }}
          >
            Xóa
          </button>
        </div>
      ))}

      <h3>Tổng tiền: {total.toLocaleString("vi-VN")} đ</h3>

      <hr />

      <h3>Thông tin khách hàng</h3>

      <form onSubmit={handleSubmit(onSubmit)} style={{ maxWidth: "500px" }}>
        <div style={{ marginBottom: "12px" }}>
          <input
            placeholder="Tên khách hàng"
            {...register("customerName")}
            style={{ width: "100%", padding: "8px" }}
          />
          <p style={{ color: "red" }}>{errors.customerName?.message}</p>
        </div>

        <div style={{ marginBottom: "12px" }}>
          <input
            placeholder="Số điện thoại"
            {...register("phone")}
            style={{ width: "100%", padding: "8px" }}
          />
          <p style={{ color: "red" }}>{errors.phone?.message}</p>
        </div>

        <div style={{ marginBottom: "12px" }}>
          <input
            placeholder="Địa chỉ"
            {...register("address")}
            style={{ width: "100%", padding: "8px" }}
          />
          <p style={{ color: "red" }}>{errors.address?.message}</p>
        </div>

        <div style={{ marginBottom: "12px" }}>
          <textarea
            placeholder="Ghi chú"
            rows="4"
            {...register("note")}
            style={{ width: "100%", padding: "8px" }}
          />
        </div>

        <button type="submit" style={{ padding: "10px 16px" }}>
          Đặt món
        </button>
      </form>
    </div>
  );
}
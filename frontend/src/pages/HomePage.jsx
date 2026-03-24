import { useEffect, useState } from "react";
import axiosClient from "../api/axiosClient";
import { Link } from "react-router-dom";

export default function HomePage() {
  const [foods, setFoods] = useState([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [sort, setSort] = useState("");
  const [page, setPage] = useState(1);

  const fetchFoods = async () => {
    try {
      const res = await axiosClient.get("/foods", {
        params: {
          search,
          category,
          sort,
          page,
          limit: 6,
        },
      });

      setFoods(res.data.data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchFoods();
  }, [search, category, sort, page]);

  return (
    <div style={{ padding: "20px" }}>
      <h2>Danh sách món ăn</h2>

      {/* SEARCH */}
      <input
        placeholder="Tìm món..."
        value={search}
        onChange={(e) => {
        setSearch(e.target.value);
        setPage(1);
        }}
        style={{ marginRight: "10px" }}
      />

      {/* FILTER */}
      <select onChange={(e) => setCategory(e.target.value)}>
        <option value="">Tất cả</option>
        <option value="Món chính">Món chính</option>
        <option value="Nước uống">Nước uống</option>
      </select>

      {/* SORT */}
      <select onChange={(e) => setSort(e.target.value)}>
        <option value="">Mặc định</option>
        <option value="price_asc">Giá tăng</option>
        <option value="price_desc">Giá giảm</option>
      </select>

      <div style={{ marginTop: "20px" }}>
        <button onClick={() => setPage(page - 1)}>Prev</button>
        <span style={{ margin: "0 10px" }}>Trang {page}</span>
        <button onClick={() => setPage(page + 1)}>Next</button>
      </div>

      <div style={{ display: "flex", gap: "20px", flexWrap: "wrap", marginTop: "20px" }}>
            {foods.map((food) => (
            <div
            key={food._id}
            style={{
                border: "1px solid #ccc",
                padding: "10px",
                width: "220px",
            }}
            >
            <img src={food.image} alt={food.name} style={{ width: "100%" }} />
            <h4>{food.name}</h4>
            <p>{food.price} VND</p>

            <Link to={`/foods/${food._id}`}>
                <button>Xem chi tiết</button>
            </Link>
            </div>
            ))}
        </div>
    </div>
  );
}
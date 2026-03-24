const Food = require("../models/Food");

// GET danh sách món
exports.getFoods = async (req, res) => {
  try {
    const {
      search = "",
      category = "",
      page = 1,
      limit = 6,
      sort = "",
    } = req.query;

    const query = {};

    // search theo tên
    if (search) {
      query.name = { $regex: search, $options: "i" };
    }

    // filter category
    if (category) {
      query.category = category;
    }

    // sort
    let sortOption = { createdAt: -1 };

    if (sort === "price_asc") sortOption = { price: 1 };
    if (sort === "price_desc") sortOption = { price: -1 };
    if (sort === "newest") sortOption = { createdAt: -1 };
    if (sort === "oldest") sortOption = { createdAt: 1 };

    // pagination
    const skip = (page - 1) * limit;

    const total = await Food.countDocuments(query);

    const foods = await Food.find(query)
      .sort(sortOption)
      .skip(skip)
      .limit(Number(limit));

    res.json({
      success: true,
      data: foods,
      pagination: {
        total,
        page: Number(page),
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// GET chi tiết món
exports.getFoodById = async (req, res) => {
  try {
    const food = await Food.findById(req.params.id);

    if (!food) {
      return res.status(404).json({
        success: false,
        message: "Không tìm thấy món",
      });
    }

    res.json({
      success: true,
      data: food,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: "ID không hợp lệ",
    });
  }
};

exports.createFood = async (req, res) => {
  try {
    const food = await Food.create(req.body);

    res.status(201).json({
      success: true,
      data: food,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

// PUT cập nhật món
exports.updateFood = async (req, res) => {
  try {
    const food = await Food.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });

    if (!food) {
      return res.status(404).json({
        success: false,
        message: "Không tìm thấy món ăn",
      });
    }

    res.json({
      success: true,
      data: food,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

// DELETE xóa món
exports.deleteFood = async (req, res) => {
  try {
    const food = await Food.findByIdAndDelete(req.params.id);

    if (!food) {
      return res.status(404).json({
        success: false,
        message: "Không tìm thấy món ăn",
      });
    }

    res.json({
      success: true,
      message: "Xóa món ăn thành công",
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};
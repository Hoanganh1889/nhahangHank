const mongoose = require("mongoose");

const FoodSchema = new mongoose.Schema(
  {
    name: String,
    category: String,
    price: Number,
    image: String,
    description: String,
    isAvailable: Boolean,
  },
  {
    timestamps: true,
    collection: "foods",
  }
);

module.exports = mongoose.model("Food", FoodSchema);
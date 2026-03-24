const mongoose = require("mongoose");

const BookingSchema = new mongoose.Schema(
  {
    customerName: String,
    phone: String,
    address: String,
    items: [
      {
        foodName: String,
        quantity: Number,
        price: Number,
      },
    ],
    total: Number,
    status: {
      type: String,
      enum: ["pending", "confirmed", "done", "cancelled"],
      default: "pending",
    },
    note: String,
  },
  {
    timestamps: true,
    collection: "bookings",
  }
);

module.exports = mongoose.model("Booking", BookingSchema);
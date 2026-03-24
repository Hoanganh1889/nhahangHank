const express = require("express");
const router = express.Router();

const {
  getBookings,
  createBooking,
  updateBookingStatus,
} = require("../controllers/bookingController");

router.get("/", getBookings);
router.post("/", createBooking);
router.patch("/:id/status", updateBookingStatus);

module.exports = router;
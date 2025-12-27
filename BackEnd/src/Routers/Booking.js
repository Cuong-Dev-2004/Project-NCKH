const router = require("express").Router();
const { createBooking } = require("../Controllers/bookingController.js");
const CheckAuth = require("../Middleware/authentication.js");

router.post("/create-booking", CheckAuth, createBooking);
router.get("/getALLBooking", GetALLBooking);
router.get("/:id", getBookingById);
router.put("/:id", updateBooking);
router.delete("/:id", deleteBooking);


module.exports = router;
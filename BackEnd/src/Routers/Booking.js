const router = require("express").Router();
const { createBooking } = require("../Controllers/bookingController.js");
const CheckAuth = require("../Middleware/authentication.js");

router.post("/create-booking", CheckAuth, createBooking);


module.exports = router;
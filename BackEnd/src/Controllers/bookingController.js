const Booking = require("../model/booking/bookingSchema");
const ProductsProfile = require("../model/Products/ProductsProfile");
const Tourist = require("../model/User/Tourist");

exports.createBooking = async (req, res) => {
    try {
        const {
            touristId,
            guideId,
            tourId,
            dateFrom,
            dateTo,
            note,
            guests,
            paymentStatus = "Unpaid",
            status = "Pending",
            type
        } = req.body;

        if (!touristId || !guideId || !tourId) {
            return res.status(400).json({
                error: "Thiếu thông tin bắt buộc: Phải có Tourist, Guide và Tour (tourId)!"
            });
        }

        const booking = new Booking({
            touristId,
            guideId,
            tourId, // Lưu ID tour
            dateFrom,
            dateTo,
            note,
            guests,
            paymentStatus,
            status,
            type
        });

        await booking.save();
        res.status(201).json({ message: "Booking created", booking });

    } catch (err) {
        console.error("Create Booking Error:", err);
        res.status(500).json({ error: err.message });
    }
};
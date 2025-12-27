const Booking = require("../model/booking/bookingSchema");
const User = require("../model/User/User");

// CREATE BOOKING
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
            price,
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
            tourId,
            dateFrom,
            dateTo,
            note,
            guests,
            price,
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

// GET ALL BOOKINGS
exports.GetALLBooking = async (req, res) => {
    try {
        const bookings = await Booking.find()
            .populate("touristId", "username email")
            .populate("guideId", "fullName")
            .populate("tourId", "name price");

        res.status(200).json({ success: true, data: bookings });
    } catch (error) {
        console.error("Error fetching all bookings:", error);
        res.status(500).json({ success: false, message: error.message });
    }
};

// GET SINGLE BOOKING BY ID
exports.getBookingById = async (req, res) => {
    try {
        const booking = await Booking.findById(req.params.id)
            .populate("touristId", "username email")
            .populate("guideId", "fullName")
            .populate("tourId", "name price");

        if (!booking) return res.status(404).json({ error: "Booking không tồn tại!" });

        res.status(200).json({ success: true, data: booking });
    } catch (error) {
        console.error("Get Booking Error:", error);
        res.status(500).json({ success: false, message: error.message });
    }
};

// UPDATE BOOKING
exports.updateBooking = async (req, res) => {
    try {
        const updatedBooking = await Booking.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        )
            .populate("guideId", "fullName")
            .populate("tourId", "name price");

        if (!updatedBooking) return res.status(404).json({ error: "Booking không tồn tại!" });

        res.status(200).json({ success: true, message: "Updated booking", data: updatedBooking });
    } catch (error) {
        console.error("Update Booking Error:", error);
        res.status(500).json({ success: false, message: error.message });
    }
};

// DELETE BOOKING
exports.deleteBooking = async (req, res) => {
    try {
        const deletedBooking = await Booking.findByIdAndDelete(req.params.id);

        if (!deletedBooking) return res.status(404).json({ error: "Booking không tồn tại!" });

        res.status(200).json({ success: true, message: "Booking deleted" });
    } catch (error) {
        console.error("Delete Booking Error:", error);
        res.status(500).json({ success: false, message: error.message });
    }
};

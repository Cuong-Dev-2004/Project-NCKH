const Booking = require("../model/booking/bookingSchema");



exports.createBooking = async (req, res) => {
    try {
        const { touristId, guideId, startDate, endDate, location } = req.body;
        const booking = new Booking({ touristId, guideId, startDate, endDate, location }); ``
        await booking.save();
        res.status(201).json({ message: "Booking created", booking });
    } catch (err) { res.status(500).json({ error: err.message }); }
};

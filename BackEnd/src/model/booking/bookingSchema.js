const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
    touristId: { type: mongoose.Schema.Types.ObjectId, ref: "Tourist" },
    guideId: { type: mongoose.Schema.Types.ObjectId, ref: "Guide" },
    startDate: Date,
    endDate: Date,
    location: String,
    status: { type: String, enum: ["Pending", "Confirmed", "Completed", "Canceled"], default: "Pending" },
    paymentStatus: { type: String, enum: ["Unpaid", "Paid"], default: "Unpaid" },
    rating: Number,
    review: String
}, { timestamps: true });
module.exports = mongoose.model("Booking", bookingSchema);
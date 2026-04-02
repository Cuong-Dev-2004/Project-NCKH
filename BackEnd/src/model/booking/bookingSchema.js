const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
    touristId: { type: mongoose.Schema.Types.ObjectId, ref: "TouristProfile", required: true },
    guideId: { type: mongoose.Schema.Types.ObjectId, ref: "Guide" },
    tourId: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
    dateFrom: { type: Date, required: true },
    dateTo: { type: Date, required: true },
    status: { type: String, enum: ["Pending", "Confirmed", "Completed", "Canceled"], default: "Pending" },
    paymentStatus: { type: String, enum: ["Unpaid", "Paid"], default: "Unpaid" },
    guests: { type: Number, required: true },
    note: String,
    price: { type: Number, required: true },
    type: { type: String, enum: ["Global", "private"], default: "private" }
}, { timestamps: true });

module.exports = mongoose.model("Booking", bookingSchema);

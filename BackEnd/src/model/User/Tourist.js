const mongoose = require('mongoose');
// Du Khach Hang
const touristSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    phone: { type: String, require: true },
    nationality: String,
}, { timestamps: true });
module.exports = mongoose.model("TouristProfile", touristSchema);
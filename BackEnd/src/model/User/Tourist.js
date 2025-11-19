const mongoose = require('mongoose');
// Du Khach Hang
const touristSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    email: { type: String, unique: true },
    username: { type: String, required: true },
    password: { type: String, required: true },
    phone: String,
    nationality: String,
}, { timestamps: true });
module.exports = mongoose.model("TouristProfile", touristSchema);
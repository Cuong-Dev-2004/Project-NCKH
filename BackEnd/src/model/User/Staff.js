const mongoose = require("mongoose");

// Nhan Vien
const staffSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    FullName: { type: String, unique: true },
    Location: { type: String, required: true },
    CCCD: { type: String, required: true },
    Birthday: { type: String, required: true }
}, { timestamps: true });

module.exports = mongoose.model("StaffProfile", staffSchema);


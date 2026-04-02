const mongoose = require("mongoose");

const partnerSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    fullName: { type: String, default: "" },
    phone: { type: String, default: "" },
    avatar: { type: String, default: "" },
    HopDong: { type: Date, default: "" },

}, { timestamps: true });

module.exports = mongoose.model("PartnerSchema", partnerSchema);

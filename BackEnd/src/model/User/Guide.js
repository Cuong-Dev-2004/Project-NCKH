const mongoose = require('mongoose');

// Huong Dan Vien
const guideSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    fullName: { type: String, default: "" },
    image: { type: String, default: "" },
    phone: { type: String, default: "" },
    languages: [String],
    location: { type: String, default: "" },
    experience: { type: Number, default: 0 },
    pricePerHour: { type: Number, default: 0 },
    availability: [{
        date: { type: Date, default: Date.now },
        isAvailable: { type: Boolean, default: true }
    }],
    ratingAverage: { type: Number, default: 0 }
}, { timestamps: true });

module.exports = mongoose.model("Guide", guideSchema);
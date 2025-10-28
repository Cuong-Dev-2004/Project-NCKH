const mongoose = require('mongoose');

const guideSchema = new mongoose.Schema({
    fullName: String,
    email: { type: String, unique: true },
    password: String,
    image: String,
    phone: String,
    languages: [String],
    location: String,
    experience: Number,
    pricePerHour: Number,
    availability: [{ date: Date, isAvailable: Boolean }],
    ratingAverage: { type: Number, default: 0 }
}, { timestamps: true });

module.exports = mongoose.model("Guide", guideSchema);
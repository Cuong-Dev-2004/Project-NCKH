const mongoose = require("mongoose");


const ProductSchema = new mongoose.Schema({
    name: { type: String, required: true },
    locationText: { type: String, required: true },
    price: { type: Number, required: true },
    oldPrice: { type: Number, required: true },
    duration: { type: Number, required: true },
    capacity: { type: String, required: true },
    minAge: { type: String, required: true },
    pickup: { type: String, required: true },
    images: { type: [String], required: true },
    data1: { type: [String], required: true }
});
module.exports = mongoose.model("Product", ProductSchema);


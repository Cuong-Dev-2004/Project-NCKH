const Guide = require("../model/User/Guide");
const Product = require("../model/Products/ProductsProfile");
const User = require("../model/User/User");
const slugify = (s) =>
    s.toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/đ/g, "d")
        .replace(/[^a-z0-9 ]/g, "")
        .trim()
        .replace(/\s+/g, "-");


const StaffController = {
    CreateProductTour: async (req, res) => {
        try {
            const { name,
                locationText,
                location,
                price,
                oldPrice,
                duration,
                capacity,
                minAge,
                pickup,
                images,
                data1,
                guideId
            } = req.body;

            const product = new Product({
                name,
                locationText,
                location,
                price,
                oldPrice,
                duration,
                capacity,
                minAge,
                pickup,
                images,
                data1,
                guideId

            })
            await product.save();
            res.status(201).json({ message: "Create Pass ", product });

        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },
    UpdateProdcutTour: async (req, res) => {
        try {
            const {
                name,
                locationText,
                location,
                price,
                oldPrice,
                duration,
                capacity,
                minAge,
                pickup,
                images,
                data1
            } = req.body;

            console.log("REQ BODY:", req.body); // debug

            const product = await Product.findById(req.params.id);
            if (!product) {
                return res.status(404).json({ message: "Product tour not found" });
            }

            product.set({
                name,
                locationText,
                location,
                price,
                oldPrice,
                duration,
                capacity,
                minAge,
                pickup,
                images,
                data1
            });

            await product.save();
            res.status(200).json({ message: "Update successful", product });

        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },



    RmProdcutTour: async (req, res) => {
        try {
            const { id } = req.params;

            const product = await Product.findById(id);
            if (!product) {
                return res.status(404).json({ message: "Product tour not found" });
            }

            await Product.findByIdAndDelete(id); // xóa sản phẩm

            res.status(200).json({ message: "Xóa tour thành công" });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    GetALLProdcutTour: async (req, res) => {
        try {
            const products = await Product.find();
            res.status(201).json({ message: "Get ALL products Pass", products });

        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },


    GetProductTour: async (req, res) => {
        try {
            const { id } = req.params;

            if (!id) return res.status(400).json({ message: "ID không hợp lệ" });

            const product = await Product.findById(id);

            if (!product) {
                return res.status(404).json({ message: "Không tìm thấy tour" });
            }

            res.status(200).json({
                message: "OK",
                product
            });

        } catch (error) {
            console.error("GetProductTour error:", error);
            res.status(500).json({ error: error.message });
        }
    },

    // Guilde
    createGuide: async (req, res) => {
        try {
            const {
                email,
                username,
                password,
                fullName,
                image,
                phone,
                languages,
                style,
                location,
                experience,
                pricePerHour,
                availability,
                ratingAverage,
                role = "guide"
            } = req.body;
            const user = new User({ email, username, password, role });
            await user.save();
            const newGuide = new Guide({
                userId: user.id,
                fullName,
                image,
                phone,
                languages,
                location,
                experience,
                pricePerHour,
                availability,
                ratingAverage,
                style,
                role
            });

            await newGuide.save();
            res.status(201).json({ message: "Guide created successfully", newGuide });

        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },
    getAllGuides: async (req, res) => {
        try {
            const guides = await Guide.find().populate("userId", "email username role");
            res.status(200).json({ guides });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },
    getGuideById: async (req, res) => {
        try {
            const guide = await Guide.findById(req.params.id).populate("userId");
            if (!guide) return res.status(404).json({ message: "Guide not found" });

            res.status(200).json(guide);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },
    updateGuide: async (req, res) => {
        try {
            const updatedGuide = await Guide.findByIdAndUpdate(
                req.params.id,
                req.body,
                { new: true }
            );

            if (!updatedGuide)
                return res.status(404).json({ message: "Guide not found" });

            res.status(200).json({
                message: "Guide updated successfully",
                updatedGuide
            });

        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },
    deleteGuide: async (req, res) => {
        try {
            const guide = await Guide.findByIdAndDelete(req.params.id);
            if (!guide) return res.status(404).json({ message: "Guide not found" });

            res.status(200).json({ message: "Guide deleted successfully" });

        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

};
module.exports = StaffController;
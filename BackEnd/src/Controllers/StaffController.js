const Guide = require("../model/User/Guide");
const Product = require("../model/Products/ProductsProfile");
const StaffController = {
    CreateProductTour: async (req, res) => {
        try {
            const { name,
                locationText,
                price,
                oldPrice,
                duration,
                capacity,
                minAge,
                pickup,
                images,
                data1
            } = req.body;

            const product = new Product({
                name,
                locationText,
                price,
                oldPrice,
                duration,
                capacity,
                minAge,
                pickup,
                images,
                data1
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
}
module.exports = StaffController;
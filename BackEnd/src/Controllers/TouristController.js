const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../model/User/User");
const Tourist = require("../model/User/Tourist");





const TouristController = {
    CreateTouris: async (req, res) => {
        try {
            const { email, username, password, phone, nationality } = req.body;

            // Kiểm tra user đã tồn tại chưa
            const existingUser = await User.findOne({ email });
            if (existingUser) {
                return res.status(400).json({ message: "Email đã tồn tại" });
            }

            // Tạo User mới
            const user = new User({
                email,
                username,
                password
            });
            await user.save();

            const touristProfile = new Tourist({
                userId: user._id,
                phone,
                nationality
            });
            await touristProfile.save();

            res.status(200).json({ message: "Tạo người dùng thành công", touristProfile });

        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },
};

module.exports = TouristController;
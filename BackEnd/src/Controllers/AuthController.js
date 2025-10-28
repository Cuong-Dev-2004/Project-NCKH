const bcrypt = require("bcrypt");
const Tourist = require("../model/touristSchema");
const Guide = require("../model/guideSchema");
const jwt = require("jsonwebtoken");
const AuthControler = {
    registerTourist: async (req, res) => {
        try {
            const { fullName, email, password, phone, nationality } = req.body

            const exist = await Tourist.findOne({ email });
            if (exist) {
                return res.status(400).json({ message: "Email Đã Tồn Tại" })
            }
            const hashedPassword = bcrypt.hashSync(password, 10);
            const tourist = new Tourist({ fullName, email, password: hashedPassword, phone, nationality });
            await tourist.save();
            res.status(201).json({ message: "Đăng ký thành công", user: tourist });

        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },
    registerGuide: async (req, res) => {
        try {
            const { fullName, email, password, phone, languages, location, experience, pricePerHour } = req.body;
            const exist = await Guide.findOne({ email });
            if (exist) return res.status(400).json({ message: "Email đã tồn tại" });
            const hashedPassword = await bcrypt.hash(password, 10);
            const guide = new Guide({ fullName, email, password: hashedPassword, phone, languages, location, experience, pricePerHour });
            await guide.save();
            res.status(201).json({ message: "Đăng ký thành công", user: guide });
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    },

    login: async (req, res) => {
        try {
            const { email, password, role } = req.body;
            const Model = role === "tourist" ? Tourist : Guide;
            const user = await Model.findOne({ email });
            if (!user) return res.status(400).json({ message: "Sai email hoặc mật khẩu" });

            const isMatch = await bcrypt.compare(password, user.password);
            if (!isMatch) return res.status(400).json({ message: "Sai email hoặc mật khẩu" });

            const token = jwt.sign(
                { id: user._id, role: role }, // Dữ liệu muốn lưu vào token
                'YOUR_SECRET_KEY',             // Một chuỗi bí mật, không được để lộ
                { expiresIn: '1h' }            // Thời gian token hết hạn
            );

            res.json({ message: "Đăng nhập thành công", token });

        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    }
}

module.exports = AuthControler;


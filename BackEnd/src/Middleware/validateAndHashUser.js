

// middleware/validateAndHashUser.js
const bcrypt = require("bcrypt");
const User = require("../model/User/User");
const validRoles = ["admin", "staff", "guide", "tourist"];

const validateAndHashUser = async (req, res, next) => {
    try {
        const { email, username, password, role } = req.body;

        // 1. Kiểm tra bắt buộc
        if (!email || !username || !password) {
            return res.status(400).json({ message: "Thiếu thông tin bắt buộc" });
        }

        // 2. Kiểm tra email hợp lệ
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({ message: "Email không hợp lệ" });
        }

        // 3. Kiểm tra email đã tồn tại
        const exist = await User.findOne({ email });
        if (exist) {
            return res.status(400).json({ message: "Email đã tồn tại" });
        }

        // 4. Hash password
        req.body.password = bcrypt.hashSync(password, 10);

        // 5. Kiểm tra role hợp lệ
        if (!role || !validRoles.includes(role)) {
            req.body.role = "tourist"; // mặc định
        }

        next();
    } catch (error) {
        res.status(500).json({ message: "Lỗi server", error: error.message });
    }
};

module.exports = validateAndHashUser;

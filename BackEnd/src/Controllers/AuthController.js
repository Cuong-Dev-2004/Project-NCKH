const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../model/User/User")
const AuthControler = {
    Login: async (req, res) => {
        try {
            const { username, password } = req.body;
            const user = await User.findOne({ username });
            if (!user) {
                return res.status(500).json({ message: "Nguoi Dung Khong Ton Tai" });
            }
            const isMatch = await bcrypt.compare(password, user.password);
            { console.log(password, user.password, isMatch) };
            if (!isMatch) {
                return res.status(401).json({ message: "Sai mật khẩu" });
            }
            const token = jwt.sign(
                { userId: user._id, role: user.role },
                process.env.JWT_SECRET || "secretKey",
                { expiresIn: "1d" }
            );
            res.status(200).json({
                message: "Đăng nhập thành công",
                user: {
                    id: user._id,
                    username: user.username,
                    role: user.role,
                    email: user.email
                },
                token
            });
        } catch (error) {
            return res.status(500).json({ message: error });
        }
    },
    Logout: async (req, res) => {
        try {
            res.status(200).json({ message: "Đăng xuất thành công" });
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }

}

module.exports = AuthControler;


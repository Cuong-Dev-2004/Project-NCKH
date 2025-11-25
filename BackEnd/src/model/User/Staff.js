const mongoose = require("mongoose");

// Nhan Vien
const staffSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    FullName: { type: String, unique: true },
    Location: { type: String, required: true },
    CCCD: { type: String, required: true },
    Birthday: { type: String, required: true }
}, { timestamps: true });

module.exports = mongoose.model("StaffProfile", staffSchema);


// const Token = require("../model/TokenSchema");

// loginAttempts = {}; // bộ nhớ lưu tạm - có thể chuyển vào Redis nếu cần

// const MAX_ATTEMPTS = 5;
// const BLOCK_TIME = 5 * 60 * 1000; // 5 phút

// module.exports = {
//     login: async (req, res) => {
//         try {
//             const { email, password } = req.body;

//             const attempts = loginAttempts[email] || { count: 0 };

//             if (attempts.count >= MAX_ATTEMPTS && Date.now() - attempts.time < BLOCK_TIME) {
//                 return res.status(429).json({ message: "Thử lại sau 5 phút!" });
//             }

//             // kiểm tra tài khoản trong tất cả DB (tương tự như code trước bạn đã duyệt)
//             let user, role;
//             user = await Tourist.findOne({ email }) || await Guide.findOne({ email }) || await Staff.findOne({ email }) || await Admin.findOne({ email });

//             if (!user)
//                 return res.status(400).json({ message: "Sai email hoặc mật khẩu" });

//             if (await bcrypt.compare(password, user.password) === false) {
//                 loginAttempts[email] = {
//                     count: attempts.count + 1,
//                     time: Date.now()
//                 };
//                 return res.status(400).json({ message: "Sai email hoặc mật khẩu" });
//             }

//             // Reset attempts sau khi đăng nhập thành công
//             delete loginAttempts[email];

//             role = user.role || "admin";

//             const accessToken = jwt.sign(
//                 { id: user._id, role },
//                 process.env.JWT_SECRET,
//                 { expiresIn: "15m" }
//             );

//             const refreshToken = jwt.sign(
//                 { id: user._id },
//                 process.env.JWT_REFRESH_SECRET,
//                 { expiresIn: "7d" }
//             );

//             await Token.create({ userId: user._id, refreshToken });

//             return res.json({
//                 message: "Đăng nhập thành công",
//                 accessToken,
//                 refreshToken,
//                 role
//             });

//         } catch (err) {
//             res.status(500).json({ error: err.message });
//         }
//     }
// };

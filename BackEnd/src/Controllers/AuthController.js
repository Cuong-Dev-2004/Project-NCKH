const bcrypt = require("bcryptjs");
const Tourist = require("../model/touristSchema");
const Guide = require("../model/guideSchema");

const registerTourist = async (req, res) => {
    try {
        const { fullName, email, password, phone, nationality } = req.body
        const exist = await Guide.findOne({ email });
        if (exist) {
            return res.status(400).json({ message: "Email Đã Tồn Tại" })
        }
        const hashedPassword = bcrypt.hashSync(password, 10);
        const tourist = new Tourist({ fullName, email, hashedPassword, phone, nationality });
        await tourist.save();
        res.status(201).json({ message: "Đăng ký thành công", user: tourist });

    } catch (error) {
        res.status(500).json({ error: err.message });
    }
}
const registerGuide = async (req, res) => {
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
}
const login = async (req, res) => {
    try {
        const { email, password, role } = req.body;
        const Model = role === "tourist" ? Tourist : Guide;
        const user = await Model.findOne({ email });
        if (!user) return res.status(400).json({ message: "Sai email hoặc mật khẩu" });
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ message: "Sai email hoặc mật khẩu" });
        res.json({ message: "Đăng nhập thành công", user });
    } catch (err) { res.status(500).json({ error: err.message }); }
}
export { registerGuide, registerTourist, login }


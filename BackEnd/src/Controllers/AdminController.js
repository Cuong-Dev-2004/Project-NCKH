const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const Admin = require("../model/AdminSchema");
const { model } = require("mongoose");
const AdminController = {
    createAdmin: async (req, res) => {
        try {
            const { email, password } = req.body;
            const exist = await Admin.findOne({ email });
            if (exist) return res.status(400).json({ message: "Email đã tồn tại" });
            const hashedPassword = await bcrypt.hash(password, 10);
            const admin = new Admin({ email, password: hashedPassword });
            await admin.save();
            res.status(201).json({ message: "Admin created", admin });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },
    UpdateAdmin: async (req, res) => {
        try {
            const { email, password } = req.body;
            const admin = await Admin.findOne({ email });
            if (!admin) return res.status(400).json({ message: "Admin không tồn tại" });
            const hashedPassword = await bcrypt.hash(password, 10);
            admin.password = hashedPassword;
            await admin.save();
            res.status(200).json({ message: "Admin updated", admin });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },
    DeleteAdmin: async (req, res) => {
        try {
            const { email } = req.body;
            const admin = await Admin.findOne({ email });
            if (!admin) return res.status(400).json({ message: "Admin không tồn tại" });
            await admin.deleteOne();
            res.status(200).json({ message: "Admin deleted" });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },
    GetAdmin: async (req, res) => {
        try {
            const admin = await Admin.find();
            res.status(200).json({ admin });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },
    LoginAdmin: async (req, res) => {
        try {
            const { email, password } = req.body;
            const admin = await Admin.findOne({ email });
            if (!admin) return res.status(400).json({ message: "Admin không tồn tại" });
            const isMatch = await bcrypt.compare(password, admin.password);
            if (!isMatch) return res.status(400).json({ message: "Mật khẩu không đúng" });
            const token = jwt.sign({ id: admin._id }, process.env.JWT_SECRET, { expiresIn: "1h" });
            res.status(200).json({ message: "Admin đăng nhập thành công", token });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
}
module.exports = AdminController;
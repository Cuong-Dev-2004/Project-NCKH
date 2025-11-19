const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const User = require("../model/User/User");
const AdminProfile = require("../model/User/AdminProfile");
const Partner = require("../model/User/partner");
const bookingSchema = require("../model/booking/bookingSchema");

// Them Xoa Sua
const AdminController = {
    // Quan ly Phan Quyen Nguoi Dung
    // Create Admin or Phan Quyen 
    createAdminProfile: async (req, res) => {
        try {
            const { email, username, password, role = "admin", fullName, phone, avatar } = req.body;
            const hashpass = bcrypt.hashSync(password, 10);

            const user = new User({ email, username, password: hashpass, role });
            await user.save();

            const adminProfile = new AdminProfile({
                userId: user._id,
                fullName: fullName || "",
                phone: phone || "",
                avatar: avatar || "",
            });
            await adminProfile.save();

            res.status(201).json({ message: `${role} tạo thành công`, adminProfile });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },
    deleteAdminProfile: async (req, res) => {
        try {
            const { email } = req.body;

            const user = await User.findOne({ email });
            if (!user) {
                return res.status(404).json({ message: "Không có email này" });
            }

            await AdminProfile.findOneAndDelete({ userId: user._id });
            await User.findByIdAndDelete(user._id);

            res.status(200).json({ message: "Xóa Admin và profile Admin thành công" });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },
    // Quan Ly Doi Tac  
    // * tao Doi Tac 
    CreateDoiTac: async (req, res) => {
        try {
            const { email,
                username,
                password,
                role = "partner",
                fullName,
                phone,
                avatar,
                HopDong } = req.body;
            const user = new User({
                email,
                username,
                password,
                role
            });
            await user.save();

            const partner = new Partner({
                userId: user.id,
                fullName,
                phone,
                avatar,
                HopDong
            });
            await partner.save();
            res.status(201).json({ message: `Phan Quyen ${role} tạo thành công`, partner });


        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },
    // * Xoa Doi Tac 
    RemovePartner: async (req, res) => {
        try {
            const { email } = req.body;
            const user = User.findOne({ email });
            if (!user) {
                return res.status(404).json({ message: "Khong Co Doi Tac" });
            }
            await Partner.findOneAndDelete({ userId: user._id });
            await user.findByIdAndDelete(user._id);
            res.status(200).json({ message: "Xoa Doi Tac Thanh Cong" });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },
    // * Chinh sUA Doi Tac
    UpDatePartner: async (req, res) => {
        try {
            const { email,
                username,
                password,
                fullName,
                phone,
                avatar,
                HopDong } = req.body;
            const user = User.findOne({ email });
            if (!user) {
                res.status(500).json({ message: "Khong Co User" });
            }
            await user.replaceOne({
                username,
                password
            })
            await user.save();
            await parent.replaceOne({
                fullName,
                phone,
                avatar,
                HopDong
            })
            await parent.save();
            res.status(200).json({ message: "Update Thanh Cong" });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },
    // LAY tAT cA dOI tAC
    getAllPartner: async (req, res) => {
        try {
            const parent = await Partner.find();
            res.status(200).json({ message: "Get Pass ", parent });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },
    // QUAN lY Cac Dich Vu 
    GetAllBoking: async (req, res) => {
        try {
            const booking = await bookingSchema.find();
            res.status(500).json({ message: "Tat ca Boking ", booking })
        } catch (error) {
            res.status(500).json({ message: error });
        }
    },








}
module.exports = AdminController;
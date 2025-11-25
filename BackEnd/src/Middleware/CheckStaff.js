const CheckAdmin = (req, res, next) => {
    if (!req.user || req.user.role !== "staff") {
        return res.status(403).json({ message: "Bạn không có quyền truy cập. Chỉ staff  được phép!" });
    }
    next();
};

module.exports = CheckAdmin;

const router = require("express").Router();
const AdminController = require("../Controllers/AdminController");
const validateAndHashUser = require("../middleware/validateAndHashUser");
const CheckAuth = require("../Middleware/authentication");
const CheckAdmin = require("../Middleware/CheckAdmin");
// Admin
router.post("/create-admin-profile", CheckAuth, CheckAdmin, validateAndHashUser, AdminController.createAdminProfile);
router.delete("/Delete-admin", CheckAuth, CheckAdmin, AdminController.deleteAdminProfile);
router.get("/GetAllBoking-admin", CheckAuth, CheckAdmin, AdminController.GetAllBoking);
// Doi Tac
router.post("/Create-Partner-profile", CheckAuth, CheckAdmin, validateAndHashUser, AdminController.CreateDoiTac);
router.delete("/Delete-Partner-profile", CheckAuth, CheckAdmin, AdminController.RemovePartner);
router.post("/Update-Partner-profile", CheckAuth, CheckAdmin, AdminController.UpDatePartner);
router.get("/GetAllPartner-admin ", CheckAuth, CheckAdmin, AdminController.getAllPartner);

// Nhan Vien

router.post("/Create-Staff-profile", CheckAuth, CheckAdmin, validateAndHashUser, AdminController.CreateNhanVien);
router.delete("/Delete-Staff-profile", CheckAuth, CheckAdmin, AdminController.RemoveNhanVien);
router.post("/Update-Staff-profile", CheckAuth, CheckAdmin, AdminController.UpDateNhanVien);
router.get("/GetAllstaff-admin", CheckAuth, CheckAdmin, AdminController.getAllStaff);








module.exports = router;
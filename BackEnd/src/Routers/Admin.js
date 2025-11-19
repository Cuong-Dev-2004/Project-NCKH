const router = require("express").Router();
const AdminController = require("../Controllers/AdminController");
const validateAndHashUser = require("../middleware/validateAndHashUser");
const CheckAuth = require("../Middleware/authentication");
const CheckAdmin = require("../Middleware/CheckAdmin");
// Admin
router.post("/create-admin-profile", CheckAuth, CheckAdmin, validateAndHashUser, AdminController.createAdminProfile);
router.post("/Delete-admin", CheckAuth, CheckAdmin, AdminController.deleteAdminProfile);
router.get("/GetAllBoking-admin", CheckAuth, CheckAdmin, AdminController.GetAllBoking);
// Doi Tac
router.post("/Create-Partner-profile", CheckAuth, CheckAdmin, validateAndHashUser, AdminController.CreateDoiTac);
router.post("/Delete-Partner-profile", CheckAuth, CheckAdmin, AdminController.RemovePartner)
module.exports = router;
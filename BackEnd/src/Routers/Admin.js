const router = require("express").Router();
const AdminController = require("../Controllers/AdminController");

router.post("/create-admin", AdminController.createAdmin);
router.post("/login-admin", AdminController.loginAdmin);
router.get("/get-admin", AdminController.getAdmin);
router.put("/update-admin", AdminController.updateAdmin);
router.delete("/delete-admin", AdminController.deleteAdmin);
module.exports = router;
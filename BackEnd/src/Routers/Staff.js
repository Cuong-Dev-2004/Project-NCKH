const router = require("express").Router();
const StaffController = require("../Controllers/StaffController");
const CheckAuth = require("../Middleware/authentication");
const CheckAdmin = require("../Middleware/CheckAdmin");
const CheckStaff = require("../Middleware/CheckStaff");


// Staff
router.post("/CreateProductTour", CheckAuth, CheckAdmin, StaffController.CreateProductTour);
router.delete("/RmProdcutTour/:id", CheckAuth, CheckStaff, StaffController.RmProdcutTour);
router.post("/UpdateProdcutTour/:id/edit", CheckAuth, CheckStaff, StaffController.UpdateProdcutTour);
router.get("/GetAllProdcutTour", StaffController.GetALLProdcutTour);
router.get("/GetProduct/:id", StaffController.GetProductTour);



// CRUD ROUTES
router.post("/CreateGuide", CheckAuth, CheckStaff, StaffController.createGuide);
router.get("/Guides", StaffController.getAllGuides);
router.get("/:id", StaffController.getGuideById);
router.put("/:id", CheckAuth, CheckStaff, StaffController.updateGuide);
router.delete("/:id", CheckAuth, CheckStaff, StaffController.deleteGuide);

module.exports = router;
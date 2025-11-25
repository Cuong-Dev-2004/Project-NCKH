const router = require("express").Router();
const StaffController = require("../Controllers/StaffController");
const CheckAuth = require("../Middleware/authentication");
const CheckStaff = require("../Middleware/CheckStaff");


// Staff
router.post("/CreateProductTour", CheckAuth, CheckStaff, StaffController.CreateProductTour);
router.delete("/RmProdcutTour/:id", CheckAuth, CheckStaff, StaffController.RmProdcutTour);
router.post("/UpdateProdcutTour/:id/edit", CheckAuth, CheckStaff, StaffController.UpdateProdcutTour);
router.get("/GetAllProdcutTour", StaffController.GetALLProdcutTour);


module.exports = router;
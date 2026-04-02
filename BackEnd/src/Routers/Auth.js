const router = require("express").Router();
const AuthControler = require("../Controllers/AuthController");
const TouristController = require("../Controllers/TouristController");
const validateAndHashUser = require("../middleware/validateAndHashUser");

router.post("/Login", AuthControler.Login);
router.post("/Logout", AuthControler.Logout);
router.post("/RegisterUser", validateAndHashUser, TouristController.CreateTouris);

module.exports = router;
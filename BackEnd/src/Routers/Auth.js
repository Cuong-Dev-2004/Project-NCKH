const router = require("express").Router();
const AuthControler = require("../Controllers/AuthController");
const { registerTourist, registerGuide, login } = AuthControler;

router.post("/register-tourist", registerTourist);
router.post("/register-guide", registerGuide);
router.post("/login", login);
module.exports = router;
const router = require("express").Router();
const AuthControler = require("../Controllers/AuthController");

router.post("/Login", AuthControler.Login);


module.exports = router;
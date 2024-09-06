const express = require("express");
const { loginMaster, verify2FA } = require("../controllers/masterController");
const router = express.Router();


router.post("/loginMaster", loginMaster);
router.post("/verify2FA", verify2FA);

module.exports = router;

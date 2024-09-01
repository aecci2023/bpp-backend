const express = require("express");
const { loginMaster } = require("../controllers/masterController");
const router = express.Router();


router.post("/loginMaster", loginMaster);

module.exports = router;

const express = require("express");
const { createBppMember, getBppMember } = require("../controllers/bppMember");
const router = express.Router();



router.get("/getBppMember", getBppMember);
router.post("/createBppMember", createBppMember);

module.exports = router;

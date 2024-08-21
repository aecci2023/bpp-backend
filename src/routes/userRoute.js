const express = require("express");
const { createBppMember } = require("../controllers/bppMember");
const router = express.Router();


router.post("/createBppMember", createBppMember);

module.exports = router;

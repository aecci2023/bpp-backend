const express = require("express");
const { createBppMember } = require("../controllers/bppMember");
const router = express.Router();
const multer = require('multer');

// Setup multer for file uploads
const upload = multer();

router.post("/createBppMember", upload.fields([{ name: 'voterIdFront' }, { name: 'voterIdBack' }]), createBppMember);

module.exports = router;

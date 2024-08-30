const express = require("express");
const { createBppMember, getBppMember } = require("../controllers/bppMember");
const router = express.Router();
const multer = require('multer');

// Setup multer for file uploads
const upload = multer({
    limits: { fileSize: 20 * 1024 * 1024 } // Set limit to 10 MB (adjust as needed)
  });

router.get("/getBppMember", getBppMember);
router.post("/createBppMember", upload.fields([{ name: 'voterIdFront' }, { name: 'voterIdBack' }]), createBppMember);

module.exports = router;

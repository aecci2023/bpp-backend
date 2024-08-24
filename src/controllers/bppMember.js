const clientModel = require("../models/clientModel");
const dotenv = require("dotenv");
dotenv.config();



const createBppMember = async (req, res) => {
  try {
    let adBooking = req.body;
    const {
        firstName,
        lastName,
        fatherName,
        voterIdNo,
        email,
        phoneNo,
    } = adBooking;


    if (
      !firstName ||
      !lastName ||
      !fatherName ||
      !voterIdNo ||
      !phoneNo
    ) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // if (!companyLogo) {
    //   return res.status(400).json({ error: "Company Logo is required." });
    // }

    const createdUser = await clientModel.create({
        firstName,
        lastName,
        fatherName,
        voterIdNo,
        email,
        phoneNo,
    });

   
    res.status(201).json({
      status: true,
      message: "response submitted!",
      createdUser,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error while submitting form",
      error: error.toString(),
    });
  }
};


module.exports = {
    createBppMember,
};

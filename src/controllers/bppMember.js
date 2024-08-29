const userModel = require("../models/userModel");
const dotenv = require("dotenv");
dotenv.config();
const { uploadToS3Bucket } = require("../utils/fileUpload");


const folderName = "UsersData";
const createBppMember = async (req, res) => {

  const {
    firstName,
    lastName,
    fatherName,
    voterIdNo,
    email,
    phoneNo,
  } = req.body;

  const { voterIdFront, voterIdBack } = req.files;

  try {
    // Check if required fields are provided
    if (!firstName || !lastName || !fatherName || !voterIdNo || !phoneNo) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Check if files are provided
    if (!voterIdFront || !voterIdBack) {
      return res.status(400).json({ message: "Both voter ID front and back are required" });
    }

    const existingUser = await userModel.findOne({ email: email });
    if (existingUser) {
      return res.json({
        status: false,
        message: "Request already submitted!",
      });
    }

    // Ensure file data exists
    if (!voterIdFront[0] || !voterIdBack[0]) {
      return res.status(400).json({ message: "File data is missing" });
    }

    const voterIdFrontResult = await uploadToS3Bucket(
      folderName,
      firstName,
      voterIdFront[0].buffer, // Use buffer for file data
      voterIdFront[0].mimetype
    );
    const voterIdBackResult = await uploadToS3Bucket(
      folderName,
      firstName,
      voterIdBack[0].buffer, // Use buffer for file data
      voterIdBack[0].mimetype
    );

    // Create a new employee object with the uploaded image URLs
    const newEmployeeData = {
      firstName,
      lastName,
      fatherName,
      email,
      phoneNo,
      voterIdNo,
      voterIdFront: voterIdFrontResult.Location,
      voterIdBack: voterIdBackResult.Location,
    };

    // Create the new employee document in the database
    const createdEmp = await userModel.create(newEmployeeData);

    res.status(200).json({
      status: true,
      message: "Thank You! Your request has been submitted!",
      createdEmp,
    });
  } catch (error) {
    console.error("Error creating employee:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};


module.exports = {
  createBppMember,
};

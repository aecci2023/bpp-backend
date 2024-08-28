const clientModel = require("../models/clientModel");
const dotenv = require("dotenv");
const AWS = require("aws-sdk");
const { uploadToS3Bucket } = require("../utils/fileUpload");
dotenv.config();

AWS.config.update({
  accessKeyId: process.env.ACCESS_KEY_ID,
  secretAccessKey: process.env.SECRET_KEY,
  region: process.env.REGION,
});
const s3 = new AWS.S3({
  accessKeyId: process.env.ACCESS_KEY_ID,
  secretAccessKey: process.env.SECRET_KEY,
});

const folderName = "users";

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


    let { voterIdFront, voterIdBack } = req.files;

    if (
      !firstName ||
      !lastName ||
      !fatherName ||
      !voterIdNo ||
      !phoneNo
    ) {
      return res.status(400).json({ message: "All fields are required" });
    }

    //uploading files------------------------------------------
    // ----------------------------------------------------------
    if (req.files != null && Object.keys(req.files).length > 0) {
      const fileKeys = Object.keys(req.files);
      const uploadPromises = fileKeys.map(async (key) => {
        let S3Response;
        let userImageFileName = `${req.files[key].name}`;
        let userFileData = req.files[key].data;

        return uploadToS3Bucket(
          folderName,
          userImageFileName,
          userFileData,
          req.files[key].mimetype
        ).then(async (data) => {
          S3Response = data;
          switch (key) {
            case "voterIdFront":
              voterIdFront = S3Response.Location;
              break;
            case "voterIdBack":
              voterIdBack = S3Response.Location;
              break;
            default:
              break;
          }
        });
      });

      await Promise.all(uploadPromises);
    }


    const createdUser = await clientModel.create({
        firstName,
        lastName,
        fatherName,
        voterIdNo,
        email,
        phoneNo,
        voterIdFront,
        voterIdBack,
    });

    //uploading file
    const s3UploadResult = await uploadToS3Bucket(
      folderName,
      "Company Logo",
      companyLogoFile.data,
      companyLogoFile.mimetype
    );

    dirInfo.companyLogo = s3UploadResult.Location;

   
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

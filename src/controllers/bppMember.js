const userModel = require("../models/userModel");
const dotenv = require("dotenv");
const AWS = require("aws-sdk");
const { uploadToS3Bucket } = require("../utils/fileUpload");
dotenv.config();

const folderName = "UsersData";

const createBppMember = async (req, res) => {
  try {
    let bppMember = req.body;
    let {
      firstName,
      lastName,
      fatherName,
      voterIdNo,
      email,
      phoneNo,
      dob,
      gender,
      profession,
      state,
      city,
    } = bppMember;

    if (
      !firstName ||
      !lastName ||
      !fatherName ||
      !voterIdNo ||
      !phoneNo ||
      !dob ||
      !gender ||
      !profession ||
      !state ||
      !city
    ) {
      return res.status(400).json({
        status: false,
        message: "All fields are required.",
      });
    }

    let voterIdFront, voterIdBack;

    if (req.files != null) {
      if (Object.keys(req.files).length > 0) {
        for (const key in req.files) {
          let S3Response;
          let userFileName = `${req.files[key].name}`;
          let userFileData = req.files[key].data;

          await uploadToS3Bucket(
            folderName,
            userFileName,
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
        }
      }
    }

    const existingUserByEmail = await userModel.findOne({ email: email });
    if (existingUserByEmail) {
      return res.json({
        status: false,
        message: "Request already submitted with this email!",
      });
    }

    const existingUserByVoterIdNo = await userModel.findOne({
      voterIdNo: voterIdNo,
    });
    if (existingUserByVoterIdNo) {
      return res.json({
        status: false,
        message: "Request already submitted with this Voter ID number!",
      });
    }

    const newBppMember = new userModel({
      firstName,
      lastName,
      fatherName,
      email,
      phoneNo,
      voterIdNo,
      dob,
      gender,
      profession,
      state,
      city,
      voterIdFront,
      voterIdBack,
    });

    await newBppMember.save();

    res.status(201).json({
      status: true,
      message: "Thank You! Your request has been submitted!",
      data: newBppMember,
    });
  } catch (error) {
    res.status(500).send({ status: false, message: error.message });
  }
};

const getBppMember = async (req, res) => {
  try {
    let getAllData = await userModel.find({});
    if (getAllData.length === 0)
      return res.status(400).send({ status: false, message: "No data found" });
    res
      .status(200)
      .send({ status: true, message: "here's the data", data: getAllData });
  } catch (err) {
    return res.status(500).send({ status: false, message: err.message });
  }
};

module.exports = {
  createBppMember,
  getBppMember,
};

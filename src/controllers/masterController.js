const AWS = require("aws-sdk"); // For AWS SNS
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const crypto = require("crypto");
require('dotenv').config()

const secret = "aecci-eplatform".padEnd(32, " ");
AWS.config.update({
  accessKeyId: process.env.ACCESS_KEY_ID,
  secretAccessKey: process.env.SECRET_KEY,
  region: process.env.REGION
});// Ensure SNS is configured for the correct region

const sns = new AWS.SNS();

const loginMaster = async (req, res) => {
  try {
    let loginData = req.body;
    let { email, password } = loginData;

    // Basic validation for email and password
    if (!email || typeof email !== "string" || email.trim() === "") {
      return res
        .status(400)
        .send({ status: false, message: "Please provide a valid email" });
    }
    if (!password || typeof password !== "string" || password.trim() === "") {
      return res
        .status(400)
        .send({ status: false, message: "Please provide a valid password" });
    }

    email = email.trim().toLowerCase();
    password = password.trim();

    const collectionName = "masters";
    const collection = mongoose.connection.collection(collectionName);
    const result = await collection.findOne({ email: email });

    if (!result) {
      return res.status(400).send({ status: false, message: "User not found" });
    }
    if (!result.isApproved) {
      return res
        .status(401)
        .send({ status: false, message: "Unauthorized access" });
    }

    if (decryptString(result.password) !== password) {
      return res
        .status(400)
        .send({ status: false, message: "Incorrect password" });
    }

    // Generate 6-digit 2FA code
    const twoFACode = Math.floor(100000 + Math.random() * 900000); // Generates a 6-digit code
    const phoneNumber = result.phoneNumber; // Assume phone number is stored in the result

    // Send the 2FA code via SMS using AWS SNS
    const params = {
      Message: `Your 2FA verification code is: ${twoFACode}`,
      PhoneNumber: "+917057332679", // Ensure phone number is in E.164 format (+91XXXXXXXXXX for India)
    };

    await sns.publish(params).promise();

    // Store the 2FA code temporarily in the user's document (you can also use Redis)
    await collection.updateOne(
      { _id: result._id },
      { $set: { twoFACode, twoFAExpiry: Date.now() + 300000 } } // Code expires in 5 minutes (300000ms)
    );

    return res.status(200).send({
      status: true,
      message: "2FA code sent to your phone",
      data: { userId: result._id },
    });
  } catch (error) {
    return res.status(500).send({ status: false, message: error.message });
  }
};

// Function to verify the 2FA code
const verify2FA = async (req, res) => {
  try {
    const { userId, code } = req.body;

    if (!userId || !code) {
      return res
        .status(400)
        .send({ status: false, message: "userId and 2FA code are required" });
    }

    const collectionName = "masters";
    const collection = mongoose.connection.collection(collectionName);

    // Use findOne with _id and convert userId to ObjectId
    const user = await collection.findOne({ _id: new mongoose.Types.ObjectId(userId) });

    if (!user) {
      return res.status(400).send({ status: false, message: "User not found" });
    }
    // Check if the code is correct and within the expiry time
    if (user.twoFACode == Number(code)) {
      // Generate JWT token for login success
      const token = jwt.sign(
        { clientId: user.email, userId: user._id },
        "aeccisecurity",
        { expiresIn: "3m" }
      );

      // Remove sensitive information before sending the response
      delete user.password;

      return res.status(200).send({
        status: true,
        message: "2FA verified, login successful",
        data: { token, userId: user._id, result: JSON.stringify(user) },
      });
    } else {
      return res
        .status(400)
        .send({ status: false, message: "Invalid or expired 2FA code" });
    }
  } catch (error) {
    return res.status(500).send({ status: false, message: error.message });
  }
};


// Existing functions for password encryption/decryption
function generateIV() {
  return crypto.randomBytes(16);
}

function encryptPassword(plainPassword) {
  const iv = generateIV();
  const cipher = crypto.createCipheriv("aes-256-cbc", Buffer.from(secret), iv);
  let encrypted = cipher.update(plainPassword, "utf8", "base64");
  encrypted += cipher.final("base64");
  return `${iv.toString("hex")}:${encrypted}`;
}

function decryptString(encryptedText) {
  const [ivHex, encryptedData] = encryptedText.split(":");
  const iv = Buffer.from(ivHex, "hex");
  const decipher = crypto.createDecipheriv(
    "aes-256-cbc",
    Buffer.from(secret),
    iv
  );
  let decrypted = decipher.update(encryptedData, "base64", "utf8");
  decrypted += decipher.final("utf8");
  return decrypted;
}

module.exports = {
  loginMaster,
  verify2FA,
};

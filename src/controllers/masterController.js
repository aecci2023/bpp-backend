let mongoose = require("mongoose");

const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
const crypto = require("crypto");

const secret = "aecci-eplatform".padEnd(32, " ");

const loginMaster = async (req, res) => {
    try {
      let loginData = req.body;
      let { email, password } = loginData;
      //________________________________________________________
      if (!email)
        return res
          .status(400)
          .send({ status: false, message: "email is mandatory" });
      if (typeof email != "string") {
        return res
          .status(400)
          .send({ status: false, message: " please send proper email" });
      }
      email = loginData.email = email.trim().toLowerCase();
      if (email == "")
        return res
          .status(400)
          .send({ status: false, message: " please send proper email" });
      //_____________________________________________________
  
      if (!password)
        return res
          .status(400)
          .send({ status: false, message: "password is mandatory" });
  
      if (typeof password != "string")
        return res
          .status(400)
          .send({ status: false, message: "please provide password in string " });
  
      password = loginData.password = password.trim();
      if (password == "")
        return res
          .status(400)
          .send({ status: false, message: "Please provide password value" });
      //_____________________________________________________
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
  
      // if (password !== result.password)
      //   return res
      //     .status(400)
      //     .send({ status: false, message: "access restricted to Master only." });
  
      if (decryptString(result.password) !== password) {
        return res
          .status(400)
          .send({ status: false, message: "Access restricted to Master only." });
      }
  
      // let token = jwt.sign(
      //   { clientId: email, exp: Math.floor(Date.now() / 1000) + 86400 },
      //   "aeccisecurity"
      // );
  
      // let tokenInfo = { userId: result._id, token: token };
  
      // res.setHeader("x-api-key", token)
  
      // Generate JWT token
      const token = jwt.sign(
        { clientId: email, userId: result._id },
        "aeccisecurity",
        { expiresIn: "30m" } // Adjust expiration time as needed
      );
  
      // Remove the password field from the result
      delete result.password;
  
      return res.status(200).send({
        status: true,
        message: "Master login successfully",
        data: { token, userId: result._id, result: JSON.stringify(result) },
      });
    } catch (error) {
      return res.status(500).send({ status: false, message: error.message });
    }
  };


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
  }
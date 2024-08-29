const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      trim: true,
    },
    lastName: {
      type: String,
      trim: true,
    },
    fatherName: {
      type: String,
      trim: true,
    },
    voterIdNo: {
      type: String,
      trim: true,
    },
    email: {
      type: String,
      trim: true,
    },
    phoneNo: {
      type: String,
      trim: true,
    },
    address: {
      type: String,
      trim: true,
    },
    assemblyID: {
      type: String,
      trim: true,
    },
    voterIdFront: {
      type: String, // or use Buffer if storing binary data directly
      default: null,
    },
    voterIdBack: {
      type: String, // or use Buffer if storing binary data directly
      default: null,
    },
    userMessage: {
      type: String,
      trim: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);

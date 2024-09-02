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
    state: {
      type: String,
      trim: true,
    },
    city: {
      type: String,
      trim: true,
    },
    district: {
      type: String,
      trim: true,
    },
    gender: {
      type: String,
      trim: true,
    },
    profession: {
      type: String,
      trim: true,
    },
    dob: { 
      type: String,
      trim: true,
    },
    voterIdFront: {
      type: String, 
      default: null,
    },
    voterIdBack: {
      type: String, 
      default: null,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);

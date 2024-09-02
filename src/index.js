const express = require("express");
const mongoose = require("mongoose");
const fileUpload = require("express-fileupload");
const cors = require("cors");
const http = require("http");
require("dotenv").config();

const user = require("./routes/userRoute");
const auth = require("./routes/MasterauthRoute");

const app = express();  // Initialize express app

const port = process.env.PORT || 3001;
mongoose.set("strictQuery", true);  // Set Mongoose query options

// Enable CORS for all requests
app.use(cors());

// Middleware setup
app.use(express.json({ limit: "500mb" }));
app.use(fileUpload({
  limits: { fileSize: 100 * 1024 * 1024 } 
}));

// Route setup
app.use("/api/user", user);
app.use("/api/auth", auth);

app.get("/status", (req, res) => {
  return res
    .status(200)
    .send({ status: true, message: "Server running on :" + port });
});

// MongoDB connection setup
mongoose
  .connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log("MongoDB is connected");
  })
  .catch((err) => {
    console.log(err.message);
  });

// Start the server
app.listen(port, () => {
  console.log(`App is running on port ${port}`);
});

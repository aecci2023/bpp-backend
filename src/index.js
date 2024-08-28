const express = require("express");
const mongoose = require("mongoose");
const user = require("./routes/userRoute");
const multer = require('multer');
const upload = multer({ storage: multer.memoryStorage() });
const cors = require("cors");
require("dotenv").config();


const port = process.env.PORT || 3001;
const app = express();
app.use(cors());







app.use("/api/user", user);
mongoose.set("strictQuery", true);
app.use(express.json({ limit: "500mb" }));
app.use(express.urlencoded({ extended: true }));

app.get("/status", (req, res) => {
  return res
    .status(200)
    .send({ status: true, message: "Server running on :" + port });
});

// MongoDB connection setup
mongoose.connect(process.env.MONGODB_URI, {
  useUnifiedTopology: true,
})
.then(() => console.log("Connected to MongoDB"))
.catch((err) => console.error("Failed to connect to MongoDB", err));



app.listen(port, () => {
  console.log(`App is running on port ${port}`);
});

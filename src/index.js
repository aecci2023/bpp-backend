const express = require("express");
const mongoose = require("mongoose");
const fileUpload = require("express-fileupload");
const cors = require("cors");
const http = require("http");
require("dotenv").config();

const user = require("./routes/userRoute");
const auth = require("./routes/MasterauthRoute")

const port = process.env.PORT || 3001;
mongoose.set("strictQuery", true);
const app = express();
app.use(cors());
app.use(express.json({ limit: "500mb" }));
app.use(fileUpload());


app.use("/api/user", user);
app.use("/api/auth", auth);

app.get("/status", (req, res) => {
  return res
    .status(200)
    .send({ status: true, message: "Server running on :" + port });
});

// MongoDB connection setup
mongoose
  .connect(process.env.MONGODB_URI, { useNewUrlParser: true })
  .then(() => {
    console.log("MongoDB is connected");
  })
  .catch((err) => {
    console.log(err.message);
  });



app.listen(port, () => {
  console.log(`App is running on port ${port}`);
});

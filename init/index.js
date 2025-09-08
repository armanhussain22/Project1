const express = require("express");
const app = express();
const mongoose = require("mongoose");
const initData = require("./data");
const Listing = require("../models/listing");
const User = require("../models/user");

const MONGO_URL = "mongodb://localhost:27017/wanderlust";

// Connect to MongoDB
mongoose.connect(MONGO_URL)
  .then(() => {
    console.log("Connected to MongoDB successfully!");
  })
  .catch((err) => {
    console.error("MongoDB connection error:", err);
  });


// Routes
app.get("/", (req, res) => {
  res.send("its working - MongoDB connected!");
});


 const initDB= async () =>{
    await Listing.deleteMany({});
    initData.data = initData.data.map((obj) => ({...obj, owner: "68b7dc97f3f7f7128a0457ce"})), //Here is owner property will be insterded in all the listing with the owner id
      await Listing.insertMany(initData.data);
      console.log("data was initized");
};
 initDB();


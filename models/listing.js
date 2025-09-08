const { required } = require("joi");
const mongoose = require("mongoose");
const schema = mongoose.Schema;
const Review = require("./review.js");
const User = require("../models/user");

const listingSchema = new schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  location: {
    type: String,
    required: true,
  },
  country: {
    type: String,
    required: true,
  },
  image: {
    url: String,
    filename: String,
  },
  reviews: [        //This is an array where we will store the object of the review 
  {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Review",
  },
],
 owner: {
   type: schema.Types.ObjectId,
     ref: "User",
 },
});

listingSchema.post("findByIdAndDelete", async (listing) =>{  //its a mongoose middleware // when review delete route is called this delete review from the list in datebase
 if(listing) {
  await Review.deleteMany({_id: {$in: listing.reviews}});
 }
});

module.exports = mongoose.model("Listing", listingSchema);


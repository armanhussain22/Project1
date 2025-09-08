const express = require("express");
const router = express.Router({mergeParams: true}); // Here working of mergeParams is when were we want to connect parent id with child we use mergeParams Here parent id is lisitng:id
const wrapAsync = require("../utils/wrapAsync.js");
const Review = require("../models/review.js"); //To use this review we will require the review.js
const Listing = require("../models/listing.js");
const {validateReview, isLoggedIn} = require("../middleware.js");
const reviewController =require("../controllers/reviews.js");


//Review 
//post route
router.post("/",isLoggedIn, validateReview,  wrapAsync (reviewController.createReview));

//delete review route
router.delete("/:reviewId", isLoggedIn, wrapAsync (reviewController.destroyReview));

module.exports= router;
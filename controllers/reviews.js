const Listing = require("../models/listing");
const Review = require("../models/review");

//Create Review
module.exports.createReview = async (req, res) =>{
console.log("Request body:", req.body); // Debug log
let listing = await Listing.findById(req.params.id);
let newReview = new Review(req.body.review);
newReview.author = req.user._id; // Set the author to the current logged-in user
listing.reviews.push(newReview);  //Here new added reviews will be added and push into newReview which will be shown in listing.id
await newReview.save();
await listing.save();
 req.flash("success", "New review is Created!");
res.redirect(`/listings/${listing._id}`);
};

//Delete Review
module.exports.destroyReview = async (req , res) =>{
let {id ,reviewId} = req.params;
  await Listing.findByIdAndUpdate(id, {$pull: {reviews: reviewId}});
  await Review.findByIdAndDelete(reviewId);
   req.flash("success", "Created Review is deleted!");
  res.redirect(`/listings/${id}`);
};
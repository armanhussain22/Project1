const Listing = require("./models/listing");
const ExpressError = require("./utils/ExpressError.js");
const { listingSchema ,reviewSchema } = require("./schema.js");

module.exports.isLoggedIn = (req, res, next) =>{
    if(!req.isAuthenticated()) {  //Here is the authentication is a method used in passport for verfying wheather it is authenticated or not 
      req.session.redirectUrl= req.originalUrl; //Here session is used to store the information for this web to the other web req.originalUrl ia the Url where we want to go after the verification process
      req.flash("error","you must be logged in to create listing!");
      return res.redirect("/login");
  }
  next();
};

module.exports.saveRedirectUrl = (req, res, next) =>{ //saveRedirectUrl This middleware is make for redirect beacuse passport supports local variables
  if(req.session.redirectUrl){
    res.locals.redirectUrl = req.session.redirectUrl;
  }
  next();
};

// This middleware is for the authentication of a current user is the owner to update the listings
module.exports.isOwner = async (req, res, next) =>{
  let {id} = req.params; //Here id will come from request.params
  let listing = await Listing.findById(id);  //A new lisitng variable is created which stores the listing id
    if(!listing.owner.equals(res.locals.currUser._id)){   //This condition checks whather the a current user is a valid user or not
      req.flash("error", "You don't have permission to edit");
      return res.redirect(`/listings/${id}`);
    }
  next();
};

//This middleware is used for validate missing data
module.exports.validateListing = (req, res, next) =>{  //This validateListing is now a function which can be used as a middleware for validation of an error
 let {error} = listingSchema.validate(req.body); //listingSchema is Joi Schema
 if (error) {
    throw new ExpressError(400, error);
 }else {
  next();
 } 
};

//same as lisitngs but its for review
module.exports.validateReview = (req, res, next) =>{  //This validateListing is now a function which can be used as a middleware for validation of an error
 console.log("Validating request body:", req.body); // Debug log
 let {error} = reviewSchema.validate(req.body);
 if (error) {
    console.log("Validation error:", error.details); // Debug log
    throw new ExpressError(400, error);
 }else {
  next();
 }
};
const express = require("express");
const router = express.Router(); //Here express.Router is used to create a router
const wrapAsync = require("../utils/wrapAsync.js");
const Listing = require("../models/listing.js");
const { isLoggedIn, isOwner , validateListing} = require("../middleware.js");
const listingController = require("../controllers/listings.js");
const multer = require("multer");
const {storage} = require("../cloudConfig.js");
const upload = multer({storage}) //multer and upload both are npm package used for the use of multer and multer automatically creates a upload file where all the upload files will be saved to cloudinary storage


router.route("/") //this is a kind of function which store the similar starting routes in a single route which is router.route
   //INDEX route , routes are used for routing 
   .get(wrapAsync (listingController.index)) //This index is exported from the controller file which stores the value to the listing 
  // create route
   .post(isLoggedIn,upload.single("listing[image]"),validateListing, wrapAsync(listingController.createListing) //That line is part of Multer {upload.single("listing[image]")} used to upload one single file store in cloudinary
  );
  
  //new route
router.get("/new", isLoggedIn,listingController.renderNewForm); //Now here isloggedin is a new middleware for varification of the user logged in for the process
  // console.log(req.User); it is used to display the details of the entered data

 
router.route("/:id")
   //show route
  .get(wrapAsync (listingController.showListing)) //This hole file is only path or we can say routes 
   //Update route
   .put(isLoggedIn,isOwner,upload.single("listing[image]"),validateListing, wrapAsync (listingController.updateListing))
   //Delete route
   .delete(isOwner, isLoggedIn,wrapAsync (listingController.destroyListing)
  );


//edit route
router.get("/:id/edit",isOwner, isLoggedIn,wrapAsync (listingController.editListing));

module.exports= router;


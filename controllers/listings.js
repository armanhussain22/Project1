const Listing = require("../models/listing");  //This listing is user to render the listings in sperate file which work on MVC


//Index
module.exports.index = async (req, res) =>{   //this is the index listings
  const allListings = await Listing.find({});
  res.render("listings/index", {allListings});
};

//New Listing
module.exports.renderNewForm =  (req, res) =>{
      res.render("listings/new");
};


//show
module.exports.showListing = async (req, res) =>{
  console.log(req.params.id);
  const listing = await Listing.findById(req.params.id)
  .populate({
    path: "reviews",
     populate: {  //populate is use to discribe the value aur the data in detail
      path:"author", //This give the name of the author with the review
    },
  })
  .populate("owner"); //Here populate is use to show the input value and object along with the id
  if(!listing){
    req.flash("error", "Does not exist listing!"); //here if the user search for the lisitng and if it doesnot exist than it will redirect("/listings") res.flash uses error for error
    res.redirect("/listings");
  }
  res.render("listings/show", {listing});
};


//create
module.exports.createListing= async (req, res) =>{
  let url = req.file.path; //The url and filename from the image
  let filenname = req.file.filenname;

  const newListing = new Listing(req.body.listing);
  newListing.owner = req.user._id; //Here the owner id is saved form the req.user_id (passport gives a default user id)

  newListing.image = {url , filenname};
  await newListing.save();
  req.flash("success", "Welcome New Listing Created!");
  res.redirect("/listings");
};

//Edit
module.exports.editListing =async (req, res) =>{
  let {id} = req.params;
  const listing = await Listing.findById(id);
   if(!listing){
    req.flash("error", "Does not exist listing!"); //here if the user search for the lisitng and if it doesnot exist than it will redirect("/listings") res.flash uses error for error
    res.redirect("/listings");
  }

  let originalImageUrl = listing.image.url; //Here the original image is stored 
   originalImageUrl = originalImageUrl.replace("/upload","/upload/h_300,w_250"); //Where original image is replace with the new upload where (h_300,w_250) reduces its qality pixel we can also make more further changes here
  res.render("listings/edit", {listing, originalImageUrl});
};

//Update 
module.exports.updateListing = async (req ,res) =>{
  let {id} = req.params;
  let listing = await Listing.findByIdAndUpdate(id, {...req.body.listing});

  if(typeof req.file !="undefined") {  //Here we are checking that if the file exsist in req.file than the code under condition statement will work and typeof is a java operatore which help to check if the value is undefine or not
  let url = req.file.path;
  let filenname = req.file.filenname; 
  listing.image = {url , filenname};
  await listing.save();
  }
   req.flash("success", "Listing Updated!");
  res.redirect(`/listings/${id}`);
};

//Delete
module.exports.destroyListing= async (req, res) =>{
  let {id} = req.params;
  const deletelisting = await Listing.findByIdAndDelete(id);
   req.flash("success", "The expected Listing is deleted!");
  res.redirect("/listings");
};
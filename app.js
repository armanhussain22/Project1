if(process.env.NODE_ENV != "production"){ //This if statement is use because it let env file to deploy only for production time 
  require('dotenv').config(); //This dotenv is a npm package which is used to integrate the env file to the backend
}
console.log(process.env.SECRET); // we can access your env files by this process.env

const express = require("express");
const mongoose = require("mongoose");
const app = express();
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const ExpressError = require("./utils/ExpressError.js");
const { required } = require("joi");
const session = require("express-session");
const MongoStore = require('connect-mongo'); //for connection of mongo session which create mongostore for us
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user.js");


const dbUrl = process.env.ATLAS_URL;
//mongos storeage in cloud db
const store = MongoStore.create({  //MongoStore.create this is a method used to store new mongo
 mongoUrl: dbUrl, //This tell us the actual database will be stored in which place (dbUrl is a cloud db)
 crypto:{  // crypto :This is used to encrypt the session data before it is saved in MongoDB
  secret: process.env.SECRET,
 },
 touchAfter: 24 * 3600, //24hours * 3600 seconds
}); 

store.on("error", () =>{
  console.log("Error in Mongo Session Store", error)
});

//Cookie Route
const sessionOption= {     //This is used for exxpress-session
    store, //Now this sessoion will store in dbUrl in cloud
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: {
      expires: Date.now() + 7 * 24 * 60 * 60 * 1000, //Here date.now() is current date + 7 days * 60hours * 60 mintues * 60 seconds * 1000 milisecond
      maxAge: 7 * 24 * 60 * 60 * 1000, //This time expire cookies are use to maintain to store the data for the given time periods
      httpOnly: true, //this is use for security 
    },
};

// app.get("/", (req, res) =>{
//   res.send("Hii");
// });


//Passport route
app.use( session (sessionOption)); //session is a middle ware in express.js and sessionOption is a object this are use for cookies
app.use(flash());

app.use(passport.initialize()); // before using passport we have to initialize
app.use(passport.session()); //Here session is used so that if the user go to the other browser its should be login session stores the information in cookies
passport.use(new LocalStrategy(User.authenticate())); //authenticate() generates a function that is used passport's LocalStrategy here the passport should be authenticated by LocalStrategy

passport.serializeUser(User.serializeUser()); //store the information related to user in session
passport.deserializeUser(User.deserializeUser()); // to deserialize user in session

//Flash
app.use((req, res, next) =>{
  res.locals.success = req.flash("success"); //This local.success is called to store the flash value and if the flash value give or matchs the condition success it perform next()
  res.locals.error =req.flash("error");
  res.locals.currUser =req.user; //Here this currUser is used to store the current value(req.user) of thr local
  next();
});

// //DemoUser
// app.get("/demouser", async(req, res) =>{
//   let fakeUser = new User({
//     email: "student@gmail.com",
//     username: "Arman",
//   });

// let registeredUser = await User.register(fakeUser, "Hello world"); //register(user, password) this register methord is also used to check the username is unique or not
// res.send(registeredUser);
// });


//Require the listing and review files
const listingRouter = require("./routes/listing.js");
const reviewRouter = require("./routes/review.js");
const userRouter = require("./routes/user.js");

// const MONGO_URL = "mongodb://localhost:27017/wanderlust"; //This was used for connection with mongosh local database or we can say to store in local database

// Connect to MongoDB
mongoose.connect(dbUrl)
  .then(() => {
    console.log("Connected to MongoDB successfully!");
  })
  .catch((err) => {
    console.error("MongoDB connection error:", err);
  });

app.set("view engine", "ejs");
app.set("views", path.join(__dirname,"views"));
app.use(express.urlencoded ({extended:true}));
app.use (methodOverride("_method"));
app.engine('ejs', ejsMate);
app.use(express.static(path.join(__dirname, "/public")));


app.use("/listings", listingRouter); //commen part of both listing and review are cut and pasted in app to connect the listing and review files
app.use("/listings/:id/reviews" , reviewRouter); //This app.js is the main file where we create a route and app.use is used to match the condition inside it and id its matches with the condition of the other file it will execute the condition 
app.use("/", userRouter);

app.get("/testListing", async (req, res) =>{
  let sampListing = new Listing({
    title: " My new villa ",
    description: "It's Good",
    price: 1200,
    location: "Delhi",
    country: "India",
  });

await sampListing.save();
  console.log("sample of the list");
  res.send("succesfully tested");
});

app.all("*", (req, res, next) =>{
  next(new ExpressError(404, "Page not found!"));
});

 app.use((err, req, res, next) =>{
  let {statusCode = 500, message =" Something went wrong!" } = err;  //this give a error status code as well as error message for all the error in the app.js which is being exported from the new file 
  res.status(statusCode).render("listings/error",{message});
});

let port = 8080;
 app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

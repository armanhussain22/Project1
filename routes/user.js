const express = require("express");
const router = express.Router();
const User = require("../models/user.js");
const wrapAsync = require("../utils/wrapAsync.js");
const passport = require("passport");
const {saveRedirectUrl} = require("../middleware.js");
const  userController = require("../controllers/users.js");

router.route("/signup")
   //signup router
  .get(userController.renderSignUpForm)
  //User detail
  .post( wrapAsync (userController.signup));


router.route("/login")
  //login Route
  .get(userController.renderLoginForm)
   //Login details
  .post(    //The main login process is this in the route file and in the controller file its the after login information
    saveRedirectUrl, //This middleware have local variable whivh passport will processed
    passport.authenticate("local", { //HERE passport.authenticate is an middleware which used in post in passport for authentication 
        failureRedirect: "/login",  //This state's that if the user doesnot authenticate it will redirect to /login along with the flash message 
        failureFlash: true,
    }),
    userController.login
);



router.get("/logout", userController.logout);

module.exports = router;
const User = require("../models/user");


//render Signup For,
module.exports.renderSignUpForm = (req, res) =>{
    res.render("users/signup.ejs");
};


//Signup
module.exports.signup =async (req, res) => {
    try{
    let{ username, email, password } = req.body;
    const newUser = new User({email, username});
    const registerdUser = await User.register(newUser, password);   // register this is a Passport-Local-Mongoose method that Stores the username, email, and the hashed password in MongoDB
    console.log(registerdUser);  //this stores the current user value which has been entered
    req.login(registerdUser, (error) =>{   //Here login is passport method which automatically esablish a loggin session in another words this login method help to login automatically if we signup or login 
        if(error){
            return next(error);
        }
         req.flash("success", "Welcome to Wanterlust");
          res.redirect("/listings");
    });
    }catch(error){
        req.flash("error",error.message);
        res.redirect("/signup");
    }
};

//Render Login From
module.exports.renderLoginForm = (req, res) =>{
    res.render("users/login.ejs");
};

//Login
module.exports.login = async (req, res) =>{
        req.flash("success", "Welcome to Wanterlust");
        let redirectUrl = res.locals.redirectUrl || "/listings" // Here redirectUrl is a variable stores the value of where the value state that (res.locals.redirectUrl || "/listings") is res.locals.redirectUrl is present than redirect to the redirectUrl (||) or if any redirectUrl is not predent redirect to /listings
        res.redirect(redirectUrl); // redirect to where we are interested after login page rather or we can say that place from where we came from
};

//Logout 
module.exports.logout = (req, res, next) =>{
    req.logout((error) =>{
        if(error) {
            return next(error);
        }
        req.flash("success","You are logged out!");
        res.redirect("/listings");
    });
};
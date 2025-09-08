const { required } = require("joi");  //joi is an npm package used for the validation of wheather the schema of the given is valid or not required : true
const mongoose = require("mongoose");
const Schema = mongoose.Schema; 
const passportlocalmongoose = require("passport-local-mongoose");

const userSchema = new Schema ({
    email: {
        type: String,
        required: true,
    }
});

userSchema.plugin(passportlocalmongoose); //This User Plugin is used because it implement username password , hashing and salting by its own

module.exports = mongoose.model("User", userSchema);



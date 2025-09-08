const cloudinary = require('cloudinary').v2;  //This 2 line of code is copyed from npm package of cloudinary 
const { CloudinaryStorage } = require('multer-storage-cloudinary');

cloudinary.config({  // config means to add and here we are adding backend with coludinary account
   cloud_name: process.env.CLOUD_NAME,  //This are the requirement of the connection
   api_key: process.env.CLOUD_API_KEY, 
   api_secret: process.env.CLOUD_API_SECRET,
});

//Storge
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'wanderlust_DEV',
    allowerdformat: ["png","jpg","jpeg"] // which files are allowerd to store
  },
});

module.exports ={
    cloudinary,
    storage,
};

//This file is used as a configuration file that connects your backend (Express app) to your Cloudinary account.
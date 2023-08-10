require('dotenv').config();
const cloudinary = require('cloudinary').v2;

const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');


cloudinary.config({
    cloud_name:process.env.CLOUDINARY_CLOUD_NAME,
    api_key:process.env.CLOUDINARY_KEY,
    api_secret:process.env.CLOUDINARY_SECRETKEY
});

const storage = new CloudinaryStorage({
    cloudinary,
    allowedFormats:['jpeg','png','jpg'],

    params:{
        folder:'Fullstack_Blog',
        transformation:[{width:500,height:500, crop:'limit'}]
    }
});
module.exports = storage;

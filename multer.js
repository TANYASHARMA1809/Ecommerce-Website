const multer = require('multer');
const { v4: uuidv4 } = require('uuid');
const path=require('path');
const { log } = require('console');

// multer middleware se the image will upload on my local server means in my folder
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'public/images')
  },
  
  filename: function (req, file, cb) {
    console.log("Image has been uploaded on my local server");
    const newFilename = uuidv4() + path.extname(file.originalname);
    cb(null,newFilename);
  }
})

const upload = multer({ storage: storage })

module.exports = upload;
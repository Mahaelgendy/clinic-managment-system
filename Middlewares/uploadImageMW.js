

const path = require("path");
const multer = require('multer');

const storage = multer.diskStorage({
    destination:'./uploads/images/',

    filename:(req , file , cb)=>{
       return cb(null ,  `${file.fieldname}_${Date.now()} ${path.extname(file.originalname)}`)
    }
})

const upload = multer({
    storage: storage,
    limits:1024*1024*5
});

module.exports = upload



const path = require("path");
const multer = require('multer');

const storage = multer.diskStorage({
    destination:'./uploads/images/',

    filename:(req , file , cb)=>{
       return cb(null ,  `${file.fieldname}_${Date.now()} ${path.extname(file.originalname)}`)
    }
})
 
const multerFilter = (req, file, cb) =>{
	if(file.mimetype.startsWith('image')){
		cb(null,true)
	} else{
        cb("Not an image! please upload only image.",false);
	}
}


const upload = multer({
    storage: storage,
    fileFilter:multerFilter,
    limits:1024*1024*5
});

module.exports = upload

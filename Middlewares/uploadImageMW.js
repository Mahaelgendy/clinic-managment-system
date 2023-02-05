
const path = require("path");
const multer = require("multer");

const storage = multer.diskStorage({

    destination:(req , file , cb)=>{
        if(file.fieldname === 'image'){
            cb(null , "./../uploads");
        }
    },

    filename:(req , file , cb)=>{
        cb(null , Date.now()+path.extname(file.originalname));
    }
})

const upload = multer({storage:storage}).single('image');

module.exports = upload;

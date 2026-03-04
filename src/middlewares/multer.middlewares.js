import multer from "multer";

/*
Multer is a node.js middleware for handling multipart/form-data, 
which is primarily used for uploading files.
 It is written on top of busboy for maximum efficiency.

NOTE: Multer will not process any form which is not multipart (multipart/form-data).

*/

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./public/temp")
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname)
  }
})

export const upload = multer({ 
    storage, 
})
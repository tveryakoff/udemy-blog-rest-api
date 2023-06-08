const multer = require("multer");

const storage = (dest) => multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, dest)
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
    cb(null, `${uniqueSuffix}-${file.originalname}`)
  }
})

const fileImageFilter = (req,file,cb) => {
  if (file.mimetype.includes('image')) {
    cb(null, true)
  }
  else {
    cb(null, false)
  }
}

module.exports = {
  storage,
  fileImageFilter
}

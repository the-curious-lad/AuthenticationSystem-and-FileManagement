const multer = require("multer");
const fileHelpers = require("../utils/fileHelpers");

const maxSize = 100 * 1024 * 1024;

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = fileHelpers.getUserUploadPath(req.user);
    cb(null, uploadPath);
  },

  filename: (req, file, cb) => {
    const filename = fileHelpers.randomFileName(file.originalname);
    cb(null, filename);
  }
});

const fileFilter = (req, file, cb) => {
  const notAllowedTypes = [
    "application/x-msdownload",
    "application/x-sh",
    "application/x-csh",
    "application/x-executable"
  ];

  if (notAllowedTypes.includes(file.mimetype)) {
    return cb(new Error("File type not allowed"), false);
  }

  cb(null, true);
};

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: maxSize } 
});

const uploadMiddleware = upload.single("file");

module.exports = uploadMiddleware;
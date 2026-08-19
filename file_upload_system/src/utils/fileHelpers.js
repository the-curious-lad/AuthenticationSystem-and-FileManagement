const { v4: uuidv4 } = require("uuid");
const path = require("path");
const fs = require("fs");

const randomFileName = (original) => {
  const uniquePart = uuidv4();
  const extension = path.extname(original);
  return `${uniquePart}${extension}`;
};

const getUserUploadPath = (user) => {
  const userId = user.id;

  const uploadPath = path.join(
    process.env.UPLOAD_STORAGE_PATH,
    userId.toString(),
  );
  // ensure directory exists
  if (!fs.existsSync(uploadPath)) {
    fs.mkdirSync(uploadPath, { recursive: true });
  }

  return uploadPath;
};

module.exports = { randomFileName, getUserUploadPath };

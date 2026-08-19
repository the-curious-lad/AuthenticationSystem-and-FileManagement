const fileDatabaseServices = require("./filesdatabaseServices");
const fs = require("fs");

const fileUpload = async (fileData) => {
  try {
    const createdFile =
      await fileDatabaseServices.createFileRecord(fileData);

    return createdFile;

  } catch (err) {
    if (fs.existsSync(fileData.path)) {
      fs.unlinkSync(fileData.path);
    }

    console.error("File upload error:", err);
    throw new Error("File upload failed");
  }
};

const getFiles = async (userId, userRole, page, limit) => {
  try {
    if (userRole === "admin") {
      return await fileDatabaseServices.selectAllFiles(page, limit);
    } else {
      return await fileDatabaseServices.selectFilesByUserId(userId, page, limit);
    }
  } catch (err) {
    throw new Error("Error fetching files: " + err.message);
  }
};

const getAFile = async (fileId, userId, userRole) => {
  try {
    const file = await fileDatabaseServices.selectFileById(fileId);

    if (!file) return null;

    if (userRole !== "admin" && file.userId !== userId) {
      const err = new Error("Forbidden");
      err.code = "FORBIDDEN";
      throw err;
    }

    return file;

  } catch (err) {
    throw err;
  }
};

const deleteAFile = async (file, userId, userRole) => {
  try {
    if (userRole !== "admin" && file.userId !== userId) {
      const err = new Error("Forbidden");
      err.code = "FORBIDDEN";
      throw err;
    }

    if (fs.existsSync(file.path)) {
      fs.unlinkSync(file.path);
    }

    await fileDatabaseServices.deleteFileById(file.id);

    return file;

  } catch (err) {
    throw err;
  }
};

module.exports = {
  fileUpload,
  getFiles,
  getAFile,
  deleteAFile,
};
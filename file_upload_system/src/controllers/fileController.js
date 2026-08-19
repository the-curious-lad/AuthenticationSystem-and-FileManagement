const fileService = require("../services/fileService");
const fs = require("fs");

const uploadFile = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        message: "No file uploaded",
      });
    }

    const fileData = {
      userId: req.user.id,
      originalName: req.file.originalname,
      storedName: req.file.filename,
      path: req.file.path,
      size: req.file.size,
      mimeType: req.file.mimetype,
    };

    const createdFile = await fileService.fileUpload(fileData);

    return res.status(201).json({
      message: "File uploaded successfully",
      file: createdFile,
    });
  } catch (err) {
    console.error("File upload error:", err);
    return res.status(500).json({
      message: "Internal Server Error",
    });
  }
};

const getFiles = async (req, res) => {
  const userId = req.user.id;
  const userRole = req.user.role;

  const page = parseInt(req.query.page, 10) || 1;
  const limit = Math.min(parseInt(req.query.limit, 10) || 10, 50);

  try {
    if (page < 1 || limit < 1) {
      return res.status(400).json({
        message: "Invalid page or limit values",
      });
    }

    const result = await fileService.getFiles(userId, userRole, page, limit);

    return res.status(200).json(result);
  } catch (err) {
    console.error("Error fetching files:", err);
    return res.status(500).json({
      message: "Internal Server Error",
    });
  }
};

const downloadFile = async (req, res) => {
  try {
    const fileId = parseInt(req.params.id, 10);
    if (isNaN(fileId)) {
      return res.status(400).json({
        message: "Invalid file ID",
      });
    }

    const userId = req.user.id;
    const userRole = req.user.role;

    const file = await fileService.getAFile(fileId, userId, userRole);

    if (!file) {
      return res.status(404).json({
        message: "File not found",
      });
    }

    if (!fs.existsSync(file.path)) {
      return res.status(404).json({
        message: "File missing on server",
      });
    }

    return res.download(file.path, file.originalName);
  } catch (err) {
    if (err.code === "FORBIDDEN") {
      return res.status(403).json({
        message: "Access denied",
      });
    }

    console.error("Download error:", err);
    return res.status(500).json({
      message: "Internal Server Error",
    });
  }
};

const deleteFile = async (req, res) => {
  try {
    const userId = req.user.id;
    const userRole = req.user.role;
    const fileId = parseInt(req.params.id, 10);

    if (isNaN(fileId)) {
      return res.status(400).json({
        message: "Invalid file ID",
      });
    }

    const file = await fileService.getAFile(fileId, userId, userRole);

    if (!file) {
      return res.status(404).json({
        message: "File not found",
      });
    }

    const deletedFile = await fileService.deleteAFile(file, userId, userRole);

    return res.status(200).json({
      message: "File deleted successfully",
      file: deletedFile,
    });

  } catch (err) {
    if (err.code === "FORBIDDEN") {
      return res.status(403).json({
        message: "Access denied",
      });
    }

    console.error("Delete error:", err);
    return res.status(500).json({
      message: "Internal Server Error",
    });
  }
};

module.exports = { uploadFile, getFiles, downloadFile, deleteFile };
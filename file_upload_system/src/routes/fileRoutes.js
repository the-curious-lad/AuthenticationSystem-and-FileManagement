const express = require("express");
const router = express.Router();
const { generalRateLimiter } = require("../middleware/rateLimiter");

router.use(generalRateLimiter);

const { authMiddleware } = require("../middleware/authMiddleware");
const { roleMiddleware } = require("../middleware/roleMiddleware");
const uploadMiddleware = require("../middleware/uploadMiddleware");

const fileController = require("../controllers/fileController");

router.post("/upload", authMiddleware, roleMiddleware(["user", "admin"]), uploadMiddleware, fileController.uploadFile);

router.get("/", authMiddleware, fileController.getFiles);

router.get("/:id/download", authMiddleware, roleMiddleware(["user", "admin"]), fileController.downloadFile);
router.delete("/:id", authMiddleware, fileController.deleteFile);

module.exports = router;
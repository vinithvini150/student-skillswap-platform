const express = require("express");
const {
  createSupportMessage,
  getMySupportMessages
} = require("../controllers/supportController");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/", protect, createSupportMessage);
router.get("/my-messages", protect, getMySupportMessages);

module.exports = router;
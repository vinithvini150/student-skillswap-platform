const express = require("express");
const { chatWithReceptionist } = require("../controllers/aiController");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/chat", protect, chatWithReceptionist);

module.exports = router;
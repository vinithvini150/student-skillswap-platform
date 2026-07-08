const express = require("express");

const { protect } = require("../middleware/authMiddleware");

const {
  createSkillRequest,
  getMySkillRequests,
  updateSkillRequestStatus,
  cancelSkillRequest
} = require("../controllers/requestController");

const router = express.Router();

router.post("/", protect, createSkillRequest);
router.get("/my-requests", protect, getMySkillRequests);
router.patch("/:requestId/status", protect, updateSkillRequestStatus);
router.patch("/:requestId/cancel", protect, cancelSkillRequest);

module.exports = router;
const express = require("express");
const {
  createSchedule,
  getMySchedules,
  updateScheduleStatus
} = require("../controllers/scheduleController");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/", protect, getMySchedules);
router.post("/", protect, createSchedule);
router.patch("/:scheduleId/status", protect, updateScheduleStatus);

module.exports = router;
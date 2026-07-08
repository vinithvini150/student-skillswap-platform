const express = require("express");
const {
  getMyProfile,
  updateMyProfile,
  searchStudents,
  uploadMyProfileImage
} = require("../controllers/userController");
const { protect } = require("../middleware/authMiddleware");
const uploadProfileImage = require("../middleware/uploadMiddleware");

const router = express.Router();

router.get("/me", protect, getMyProfile);

router.put("/me", protect, updateMyProfile);

router.post(
  "/me/profile-image",
  protect,
  uploadProfileImage.single("profileImage"),
  uploadMyProfileImage
);

router.get("/search", protect, searchStudents);

module.exports = router;
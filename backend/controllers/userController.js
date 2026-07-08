const User = require("../models/User");

const getMyProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id).select("-password");

    if (!user) {
      res.status(404);
      throw new Error("User not found");
    }

    res.status(200).json({
      success: true,
      user
    });
  } catch (error) {
    next(error);
  }
};

const updateMyProfile = async (req, res, next) => {
  try {
    const { name, bio, skillsToTeach, skillsToLearn } = req.body;

    const user = await User.findById(req.user._id);

    if (!user) {
      res.status(404);
      throw new Error("User not found");
    }

    if (name !== undefined) {
      user.name = name.trim();
    }

    if (bio !== undefined) {
      user.bio = bio.trim();
    }

    if (skillsToTeach !== undefined) {
      user.skillsToTeach = skillsToTeach;
    }

    if (skillsToLearn !== undefined) {
      user.skillsToLearn = skillsToLearn;
    }

    await user.save();

    const updatedUser = await User.findById(user._id).select("-password");

    res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      user: updatedUser
    });
  } catch (error) {
    next(error);
  }
};

const searchStudents = async (req, res, next) => {
  try {
    const skill = req.query.skill?.trim();

    if (!skill) {
      res.status(400);
      throw new Error("Skill search text is required");
    }

    const students = await User.find({
      _id: { $ne: req.user._id },
      isActive: true,
      skillsToTeach: {
        $regex: skill,
        $options: "i"
      }
    })
      .select("name email bio skillsToTeach profileImage rating totalReviews")
      .sort({ rating: -1, totalReviews: -1 });

    res.status(200).json({
      success: true,
      students
    });
  } catch (error) {
    next(error);
  }
};

const uploadMyProfileImage = async (req, res, next) => {
  try {
    if (!req.file) {
      res.status(400);
      throw new Error("Please choose an image file");
    }

    const profileImageUrl = `${req.protocol}://${req.get(
      "host"
    )}/uploads/${req.file.filename}`;

    const user = await User.findByIdAndUpdate(
      req.user._id,
      {
        profileImage: profileImageUrl
      },
      {
        new: true,
        runValidators: true
      }
    ).select("-password");

    res.status(200).json({
      success: true,
      message: "Profile image uploaded successfully",
      user
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getMyProfile,
  updateMyProfile,
  searchStudents,
  uploadMyProfileImage
};
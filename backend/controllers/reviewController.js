const Review = require("../models/Review");
const SkillRequest = require("../models/SkillRequest");
const User = require("../models/User");

const createReview = async (req, res, next) => {
  try {
    const { requestId, rating, comment } = req.body;

    if (!requestId || !rating) {
      res.status(400);
      throw new Error("Request ID and rating are required");
    }

    if (rating < 1 || rating > 5) {
      res.status(400);
      throw new Error("Rating must be between 1 and 5");
    }

    const skillRequest = await SkillRequest.findOne({
      _id: requestId,
      sender: req.user._id,
      status: "completed"
    });

    if (!skillRequest) {
      res.status(404);
      throw new Error("Completed skill request not found");
    }

    const existingReview = await Review.findOne({
      skillRequest: requestId
    });

    if (existingReview) {
      res.status(409);
      throw new Error("A review already exists for this request");
    }

    const review = await Review.create({
      reviewer: req.user._id,
      reviewee: skillRequest.receiver,
      skillRequest: requestId,
      rating: Number(rating),
      comment
    });

    const ratingData = await Review.aggregate([
      {
        $match: {
          reviewee: skillRequest.receiver
        }
      },
      {
        $group: {
          _id: "$reviewee",
          averageRating: { $avg: "$rating" },
          totalReviews: { $sum: 1 }
        }
      }
    ]);

    if (ratingData.length > 0) {
      await User.findByIdAndUpdate(skillRequest.receiver, {
        rating: Number(ratingData[0].averageRating.toFixed(1)),
        totalReviews: ratingData[0].totalReviews
      });
    }

    res.status(201).json({
      success: true,
      message: "Review submitted successfully",
      review
    });
  } catch (error) {
    next(error);
  }
};

const getUserReviews = async (req, res, next) => {
  try {
    const reviews = await Review.find({
      reviewee: req.params.userId
    })
      .populate("reviewer", "name profileImage")
      .populate("skillRequest", "skill preferredMode scheduledDate")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: reviews.length,
      reviews
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createReview,
  getUserReviews
};
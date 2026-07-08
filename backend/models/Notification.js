const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema(
  {
    recipient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null
    },
    type: {
      type: String,
      enum: [
        "skill_request",
        "request_accepted",
        "request_rejected",
        "request_cancelled",
        "review_received"
      ],
      required: true
    },
    message: {
      type: String,
      required: true,
      trim: true,
      maxlength: 300
    },
    relatedRequest: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "SkillRequest",
      default: null
    },
    isRead: {
      type: Boolean,
      default: false
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model("Notification", notificationSchema);
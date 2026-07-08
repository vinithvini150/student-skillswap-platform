const mongoose = require("mongoose");

const skillRequestSchema = new mongoose.Schema(
  {
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },

    receiver: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },

    skill: {
      type: String,
      required: [true, "Skill is required"],
      trim: true,
      maxlength: 80
    },

    message: {
      type: String,
      trim: true,
      maxlength: 500,
      default: ""
    },

    preferredMode: {
      type: String,
      enum: ["online", "offline", "either"],
      default: "online"
    },

    status: {
      type: String,
      enum: ["pending", "accepted", "rejected", "cancelled", "completed"],
      default: "pending"
    },

    scheduledDate: {
      type: Date,
      default: null
    }
  },
  {
    timestamps: true
  }
);

skillRequestSchema.index(
  { sender: 1, receiver: 1, skill: 1, status: 1 }
);

module.exports = mongoose.model("SkillRequest", skillRequestSchema);
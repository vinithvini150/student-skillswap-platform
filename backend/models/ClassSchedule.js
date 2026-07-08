const mongoose = require("mongoose");

const classScheduleSchema = new mongoose.Schema(
  {
    request: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "SkillRequest",
      required: true
    },

    teacher: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },

    learner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },

    skill: {
      type: String,
      required: true,
      trim: true
    },

    title: {
      type: String,
      required: true,
      trim: true,
      maxlength: 120
    },

    startTime: {
      type: Date,
      required: true
    },

    durationMinutes: {
      type: Number,
      required: true,
      min: 15,
      max: 300
    },

    meetingLink: {
      type: String,
      required: true,
      trim: true
    },

    notes: {
      type: String,
      trim: true,
      maxlength: 500,
      default: ""
    },

    status: {
      type: String,
      enum: ["scheduled", "completed", "cancelled"],
      default: "scheduled"
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model("ClassSchedule", classScheduleSchema);
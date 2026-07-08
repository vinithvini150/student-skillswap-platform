const ClassSchedule = require("../models/ClassSchedule");
const SkillRequest = require("../models/SkillRequest");

const createSchedule = async (req, res, next) => {
  try {
    const {
      requestId,
      title,
      startTime,
      durationMinutes,
      meetingLink,
      notes
    } = req.body;

    if (
      !requestId ||
      !title ||
      !startTime ||
      !durationMinutes ||
      !meetingLink
    ) {
      res.status(400);
      throw new Error(
        "Request, title, date and time, duration, and meeting link are required"
      );
    }

    const request = await SkillRequest.findOne({
      _id: requestId,
      receiver: req.user._id,
      status: "accepted"
    });

    if (!request) {
      res.status(404);
      throw new Error(
        "Accepted skill request not found. Only the teacher can schedule a class."
      );
    }

    const classDate = new Date(startTime);

    if (Number.isNaN(classDate.getTime())) {
      res.status(400);
      throw new Error("Please enter a valid class date and time");
    }

    if (classDate <= new Date()) {
      res.status(400);
      throw new Error("Class date and time must be in the future");
    }

    const schedule = await ClassSchedule.create({
      request: request._id,
      teacher: req.user._id,
      learner: request.sender,
      skill: request.skill,
      title: title.trim(),
      startTime: classDate,
      durationMinutes: Number(durationMinutes),
      meetingLink: meetingLink.trim(),
      notes: notes?.trim() || ""
    });

    const populatedSchedule = await schedule.populate([
      {
        path: "teacher",
        select: "name email profileImage"
      },
      {
        path: "learner",
        select: "name email profileImage"
      }
    ]);

    res.status(201).json({
      success: true,
      message: "Class scheduled successfully",
      schedule: populatedSchedule
    });
  } catch (error) {
    next(error);
  }
};

const getMySchedules = async (req, res, next) => {
  try {
    const schedules = await ClassSchedule.find({
      $or: [
        { teacher: req.user._id },
        { learner: req.user._id }
      ]
    })
      .populate("teacher", "name email profileImage")
      .populate("learner", "name email profileImage")
      .sort({ startTime: 1 });

    res.status(200).json({
      success: true,
      schedules
    });
  } catch (error) {
    next(error);
  }
};

const updateScheduleStatus = async (req, res, next) => {
  try {
    const { status } = req.body;

    if (!["completed", "cancelled"].includes(status)) {
      res.status(400);
      throw new Error("Status must be completed or cancelled");
    }

    const schedule = await ClassSchedule.findOne({
      _id: req.params.scheduleId,
      teacher: req.user._id
    });

    if (!schedule) {
      res.status(404);
      throw new Error("Schedule not found or you do not have permission");
    }

    schedule.status = status;
    await schedule.save();

    res.status(200).json({
      success: true,
      message: `Class marked as ${status}`,
      schedule
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createSchedule,
  getMySchedules,
  updateScheduleStatus
};
const SkillRequest = require("../models/SkillRequest");
const User = require("../models/User");
const Notification = require("../models/Notification");

const createSkillRequest = async (req, res, next) => {
  try {
    const { receiverId, skill, message, preferredMode } = req.body;

    if (!receiverId || !skill) {
      res.status(400);
      throw new Error("Receiver and skill are required");
    }

    if (receiverId === req.user._id.toString()) {
      res.status(400);
      throw new Error("You cannot send a request to yourself");
    }

    const receiver = await User.findOne({
      _id: receiverId,
      isActive: true
    });

    if (!receiver) {
      res.status(404);
      throw new Error("Receiver was not found");
    }

    const alreadyRequested = await SkillRequest.findOne({
      sender: req.user._id,
      receiver: receiverId,
      skill: skill.trim(),
      status: "pending"
    });

    if (alreadyRequested) {
      res.status(409);
      throw new Error("A pending request already exists for this skill");
    }

    const request = await SkillRequest.create({
      sender: req.user._id,
      receiver: receiverId,
      skill: skill.trim(),
      message,
      preferredMode
    });

    await Notification.create({
      recipient: receiverId,
      sender: req.user._id,
      type: "skill_request",
      message: `${req.user.name} sent you a request to learn ${skill.trim()}.`,
      relatedRequest: request._id
    });

    const populatedRequest = await request.populate([
      {
        path: "sender",
        select: "name email profileImage"
      },
      {
        path: "receiver",
        select: "name email profileImage"
      }
    ]);

    res.status(201).json({
      success: true,
      message: "Skill request sent successfully",
      request: populatedRequest
    });
  } catch (error) {
    next(error);
  }
};

const getMySkillRequests = async (req, res, next) => {
  try {
    const receivedRequests = await SkillRequest.find({
      receiver: req.user._id
    })
      .populate("sender", "name email bio profileImage rating")
      .sort({ createdAt: -1 });

    const sentRequests = await SkillRequest.find({
      sender: req.user._id
    })
      .populate("receiver", "name email bio profileImage rating")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      receivedRequests,
      sentRequests
    });
  } catch (error) {
    next(error);
  }
};

const updateSkillRequestStatus = async (req, res, next) => {
  try {
    const { status, scheduledDate } = req.body;

    const allowedStatuses = [
      "accepted",
      "rejected",
      "completed"
    ];

    if (!allowedStatuses.includes(status)) {
      res.status(400);
      throw new Error("Invalid request status");
    }

    const request = await SkillRequest.findOne({
      _id: req.params.requestId,
      receiver: req.user._id
    });

    if (!request) {
      res.status(404);
      throw new Error("Skill request not found");
    }

    if (status === "accepted" || status === "rejected") {
  if (request.status !== "pending") {
    res.status(400);
    throw new Error("Only pending requests can be accepted or rejected");
  }
}

if (status === "completed") {
  if (request.status !== "accepted") {
    res.status(400);
    throw new Error("Only accepted requests can be marked as completed");
  }
}

    request.status = status;

    if (status === "accepted" && scheduledDate) {
      request.scheduledDate = new Date(scheduledDate);
    }

    await request.save();

    if (status === "accepted" || status === "rejected") {
      await Notification.create({
        recipient: request.sender,
        sender: req.user._id,
        type:
          status === "accepted"
            ? "request_accepted"
            : "request_rejected",
        message:
          status === "accepted"
            ? `${req.user.name} accepted your request for ${request.skill}.`
            : `${req.user.name} rejected your request for ${request.skill}.`,
        relatedRequest: request._id
      });
    }

    res.status(200).json({
      success: true,
      message: `Skill request ${status} successfully`,
      request
    });
  } catch (error) {
    next(error);
  }
};

const cancelSkillRequest = async (req, res, next) => {
  try {
    const request = await SkillRequest.findOne({
      _id: req.params.requestId,
      sender: req.user._id
    });

    if (!request) {
      res.status(404);
      throw new Error("Skill request not found");
    }

    if (request.status !== "pending") {
      res.status(400);
      throw new Error("Only pending requests can be cancelled");
    }

    request.status = "cancelled";

    await request.save();

    await Notification.create({
      recipient: request.receiver,
      sender: req.user._id,
      type: "request_cancelled",
      message: `${req.user.name} cancelled the request for ${request.skill}.`,
      relatedRequest: request._id
    });

    res.status(200).json({
      success: true,
      message: "Skill request cancelled successfully",
      request
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createSkillRequest,
  getMySkillRequests,
  updateSkillRequestStatus,
  cancelSkillRequest
};
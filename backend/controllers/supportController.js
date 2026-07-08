const SupportMessage = require("../models/SupportMessage");

const createSupportMessage = async (req, res, next) => {
  try {
    const { subject, message } = req.body;

    if (!subject?.trim() || !message?.trim()) {
      res.status(400);
      throw new Error("Subject and message are required");
    }

    const supportMessage = await SupportMessage.create({
      sender: req.user._id,
      subject: subject.trim(),
      message: message.trim()
    });

    res.status(201).json({
      success: true,
      message: "Your message was sent to support successfully.",
      supportMessage
    });
  } catch (error) {
    next(error);
  }
};

const getMySupportMessages = async (req, res, next) => {
  try {
    const messages = await SupportMessage.find({
      sender: req.user._id
    }).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      messages
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createSupportMessage,
  getMySupportMessages
};
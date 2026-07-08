const OpenAI = require("openai");

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

const chatWithReceptionist = async (req, res, next) => {
  try {
    const { message } = req.body;

    if (!message || !message.trim()) {
      res.status(400);
      throw new Error("Message is required");
    }

    const userName = req.user?.name || "Student";

    const response = await openai.responses.create({
      model: "gpt-4.1-mini",
      input: [
        {
          role: "system",
          content: `
You are SkillSwap Assistant, a friendly AI receptionist inside the Student SkillSwap website.

The current user is ${userName}.

Your job is to help users navigate this website and explain its features clearly.
Keep answers short, practical, and friendly.

SkillSwap features:
- Dashboard: overview of requests, skills, and notifications.
- Find Students: search students by skills and send learning requests.
- Requests: teachers accept, reject, or complete requests; learners can cancel pending requests.
- Request Management: shows sent and received requests in a table.
- Calendar: teachers schedule accepted requests with date, duration, notes, and Zoom or Microsoft Teams links. Learners can see and join scheduled classes.
- Profile: users update their bio, skills to teach, and skills to learn.
- Notifications: users can see updates.
- Settings: users can change bright/dark theme and notification preferences.
- Help: FAQ and contact support form.

Important rules:
- Do not claim that you can access private data, passwords, payment information, or messages.
- Do not invent scheduled classes, requests, or user details.
- If asked about an issue, explain the correct page and action.
- If asked to contact support, direct them to Help.
- If asked about payment or fees, explain that SkillSwap currently focuses on skill exchange and class planning; any payment agreement must be handled safely and directly by users.
          `
        },
        {
          role: "user",
          content: message.trim()
        }
      ]
    });

    res.status(200).json({
      success: true,
      reply: response.output_text
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  chatWithReceptionist
};
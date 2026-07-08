const dotenv = require("dotenv");
const bcrypt = require("bcryptjs");
const connectDatabase = require("./config/db");
const User = require("./models/User");

dotenv.config();

const seedUsers = async () => {
  try {
    await connectDatabase();

    const hashedPassword = await bcrypt.hash("SkillSwap2026", 10);

    await User.deleteMany({
      email: {
        $in: [
          "arun.skillswap@example.com",
          "priya.skillswap@example.com",
          "karthik.skillswap@example.com"
        ]
      }
    });

    await User.create([
      {
        name: "Arun Kumar",
        email: "arun.skillswap@example.com",
        password: hashedPassword,
        bio: "Frontend learner who enjoys helping students with React and JavaScript.",
        skillsToTeach: ["React.js", "JavaScript"],
        skillsToLearn: ["Node.js", "MongoDB"],
        role: "student",
        isActive: true
      },
      {
        name: "Priya S",
        email: "priya.skillswap@example.com",
        password: hashedPassword,
        bio: "Web design student focused on clean interfaces and responsive pages.",
        skillsToTeach: ["HTML5", "CSS", "Bootstrap"],
        skillsToLearn: ["React.js"],
        role: "student",
        isActive: true
      },
      {
        name: "Karthik R",
        email: "karthik.skillswap@example.com",
        password: hashedPassword,
        bio: "Student learning backend development and database design.",
        skillsToTeach: ["Node.js", "MongoDB"],
        skillsToLearn: ["JavaScript", "React.js"],
        role: "student",
        isActive: true
      }
    ]);

    console.log("Demo users created successfully.");
    process.exit(0);
  } catch (error) {
    console.error("Demo data error:", error.message);
    process.exit(1);
  }
};

seedUsers();
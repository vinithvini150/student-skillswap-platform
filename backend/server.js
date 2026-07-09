const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const rateLimit = require("express-rate-limit");
const path = require("path");

const connectDatabase = require("./config/db");

const {
  notFound,
  errorHandler
} = require("./middleware/errorMiddleware");

dotenv.config();

const app = express();

/* Security middleware */
app.use(
  helmet({
    crossOriginResourcePolicy: {
      policy: "cross-origin"
    }
  })
);

/* Allowed frontend websites */
const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:5174",
  "http://localhost:5175",
  "https://vinithvini150.github.io"
];

/* CORS configuration */
const corsOptions = {
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      return callback(null, true);
    }

    return callback(new Error("Not allowed by CORS"));
  },
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true
};

app.use(cors(corsOptions));
app.options("*", cors(corsOptions));

/* Parse JSON request bodies */
app.use(express.json());

/* Make uploaded images publicly available */
app.use(
  "/uploads",
  express.static(path.join(__dirname, "uploads"), {
    setHeaders: (res) => {
      res.setHeader("Cross-Origin-Resource-Policy", "cross-origin");
    }
  })
);

/* Development request logs */
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

/* API rate limiter */
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 300,
  message: {
    success: false,
    message: "Too many requests. Please try again later."
  }
});

app.use("/api", apiLimiter);

/* Test route */
app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "Student SkillSwap API is running"
  });
});

/* API routes */
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/users", require("./routes/userRoutes"));
app.use("/api/requests", require("./routes/requestRoutes"));
app.use("/api/reviews", require("./routes/reviewRoutes"));
app.use("/api/notifications", require("./routes/notificationRoutes"));
app.use("/api/schedules", require("./routes/scheduleRoutes"));
app.use("/api/support", require("./routes/supportRoutes"));

/* Error handlers — always last */
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

connectDatabase()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.error(`Database connection failed: ${error.message}`);
    process.exit(1);
  });

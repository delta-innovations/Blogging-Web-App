const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const helmet = require("helmet");
const morgan = require("morgan");
const rateLimit = require("express-rate-limit");
const mongoSanitize = require("express-mongo-sanitize");
const xss = require("xss-clean");
const compression = require("compression");
const connectDB = require("./config/database");
const redisClient = require("./config/redis");
const errorHandler = require("./controllers/middleware/errorHandler");

// Load environment variables
dotenv.config();

// Connect to MongoDB
connectDB();

// Initialize Express app
const app = express();

// 🔒 Security Middleware
app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        styleSrc: ["'self'", "'unsafe-inline'"],
        scriptSrc: ["'self'"],
      },
    },
    permissionsPolicy: {
      features: {
        // Explicitly disable experimental features causing warnings
        "browsing-topics": ["none"],
        "run-ad-auction": ["none"],
        "join-ad-interest-group": ["none"],
        "private-state-token-redemption": ["none"],
        "private-state-token-issuance": ["none"],
        "private-aggregation": ["none"],
        "attribution-reporting": ["none"],
        // Add supported features if needed
        geolocation: ["none"],
        microphone: ["none"],
        camera: ["none"],
      },
    },
  })
);

// Enable CORS with explicit configuration
app.use(
  cors({
    origin: function (origin, callback) {
      const allowedOrigins = [
        "http://localhost:3000",
        "https://nivox.vercel.app",
      ];
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        console.log(`CORS rejected origin: ${origin}`); // Debug log
        callback(new Error("Not allowed by CORS"));
      }
    },
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);

// Handle CORS preflight requests explicitly
app.options("*", cors()); // Respond to OPTIONS requests

app.use(mongoSanitize());
app.use(xss());
app.use(compression());

// 📜 Logging Middleware
app.use(morgan("combined")); // Use 'combined' for detailed logs in production

// Rate Limiting Middleware
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: "Too many requests from this IP, please try again after 15 minutes",
});
app.use(limiter);

// Middleware for parsing JSON & URL-encoded data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Debug middleware to log incoming requests and headers
app.use((req, res, next) => {
  console.log(`Request: ${req.method} ${req.url} from origin: ${req.headers.origin}`);
  console.log("Request Headers:", req.headers); // Log all headers for debugging
  next();
});

// ✅ API Test Route
app.get("/api/test", (req, res) => {
  res.status(200).json({ message: "Server is running successfully" });
});

// 🛠 Routes
app.use("/api/blogs", require("./routes/blogRoutes")); // Blog Routes
app.use("/api/auth", require("./routes/authRoutes")); // Auth Routes

// ❌ Error Handling Middleware (Must be last!)
app.use(errorHandler);

// 🌐 Start Server
const PORT = process.env.PORT || 5000;
const server = app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});

// 🔥 Handle Uncaught Errors & Rejections
process.on("unhandledRejection", (err) => {
  console.error("❌ Unhandled Promise Rejection:", err.message, err.stack);
  server.close(() => process.exit(1));
});

process.on("uncaughtException", (err) => {
  console.error("❌ Uncaught Exception:", err.message, err.stack);
  process.exit(1);
});

// 🔄 Graceful Shutdown (Cleanup MongoDB & Redis on exit)
process.on("SIGINT", async () => {
  console.log("🔻 Gracefully shutting down...");
  await redisClient.quit(); // Close Redis connection
  process.exit(0);
});
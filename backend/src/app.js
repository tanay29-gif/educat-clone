import express from "express"
import cors from "cors"
import cookieParser from "cookie-parser"

const app = express()

app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true
}))

app.use(express.json({limit: "16kb"}))
app.use(express.urlencoded({extended: true, limit: "16kb"}))
app.use(express.static("public"))
app.use(cookieParser())
app.use((req, res, next) => {
    console.log(req.method, req.originalUrl);
    next();
});

// Import routes
import userRoutes from "./routes/user.route.js"
import courseRoutes from "./routes/course.route.js"
import sectionRoutes from "./routes/section.route.js"
import lectureRoutes from "./routes/lecture.route.js"
// import searchRoutes from "./routes/search.route.js"

// Use routes
app.use("/api/users", userRoutes)
app.use("/api/courses", courseRoutes)
app.use("/api/sections", sectionRoutes)
app.use("/api/lectures", lectureRoutes)
app.use("/api/health", (req, res) => {
    res.status(200).json({ status: "ok" });
})

// Error handling middleware
app.use((err, req, res, next) => {
    const status = err.statusCode || 500;
    const message = err.message || "Internal Server Error";
    
    res.status(status).json({
        success: false,
        statusCode: status,
        message: message,
        errors: err.errors || []
    });
});

export default app;
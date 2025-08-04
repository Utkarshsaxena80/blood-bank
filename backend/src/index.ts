import express from "express";
import cors from "cors";
import patientRegistration from "../routes/patientRegistration.routes.js";
import donorRegistration from "../routes/donorRegistration.routes.js";
import bloodBank from "../routes/bloodBank.routes.js";
import authRoutes from "../routes/auth.routes.js";
import exampleRoutes from "../routes/example.routes.js";
//import morgan from 'morgan'
import cookieParser from "cookie-parser";

const app = express();

// Enable CORS with credentials
app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:3000",
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);

// app.use(morgan('dev'))
app.use(express.json()); // Parse JSON request bodies
app.use(cookieParser()); // Parse cookies

const PORT: number = 3000;

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/example", exampleRoutes);
app.use("/", patientRegistration);
app.use("/", donorRegistration);
app.use("/", bloodBank);

app.listen(PORT, () => {
  console.log(`listening on port ${PORT}`);
});

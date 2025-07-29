// index.js or app.js
import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import { userRouter } from "./src/routes/user.route.js";
import { courseRoute } from "./src/routes/course.route.js";
import './config/db.config.js';
import { stripeWebhook } from "./src/controller/purchase.controller.js";
import { lectureProgree } from "./src/routes/lecturprogress.route.js";

dotenv.config();

const app = express();

// ✅ Mount the Stripe webhook route BEFORE using express.json()
// ✅ NO middleware before this route
app.post(
  "/api/v1/course/webhook",
  express.raw({ type: "application/json" }),
  stripeWebhook
);


// ✅ Other middleware (after webhook route)
app.use(cors({
  origin: "http://localhost:5173",
  credentials: true,
}));
app.use(cookieParser());
app.use(express.json()); // will not interfere with webhook now
app.use(express.urlencoded({ extended: true }));

// ✅ Your other routes
app.use("/api/v1/user", userRouter);
app.use("/api/v1/course", courseRoute);
app.use("/api/v1/lectureprogress",lectureProgree)

app.listen(process.env.PORT, () => {
  console.log(`✅ Server listening on port ${process.env.PORT}`);
});

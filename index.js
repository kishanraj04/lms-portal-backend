import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors'
dotenv.config();

import './config/db.config.js';
import { userRouter } from './src/routes/user.route.js';
import cookieParser from 'cookie-parser';

const app = express();



// Middleware to parse JSON
app.use(express.json());
app.use(cors({
  origin: "http://localhost:5173",
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  credentials: true,
}));
app.use(cookieParser())
// User routes
app.use("/api/v1/user", userRouter);

app.listen(process.env.PORT, () => {
    console.log("✅ Server listening on", process.env.PORT);
});

import express from 'express';
import dotenv from 'dotenv';

dotenv.config();

import './config/db.config.js';
import { userRouter } from './src/routes/user.route.js';

const app = express();

// Middleware to parse JSON
app.use(express.json());

// User routes
app.use("/api/v1/user", userRouter);

app.listen(process.env.PORT, () => {
    console.log("✅ Server listening on", process.env.PORT);
});

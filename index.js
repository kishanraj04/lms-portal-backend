// index.js or app.js
import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import { userRouter } from "./src/routes/user.route.js";
import { courseRoute } from "./src/routes/course.route.js";
import "./config/db.config.js";
import { stripeWebhook } from "./src/controller/purchase.controller.js";
import { lectureProgree } from "./src/routes/lecturprogress.route.js";
import { instructorRoute } from "./src/routes/instructor.route.js";
import { groupRoute } from "./src/routes/group.route.js";
import { createServer } from "http";
import { Server } from "socket.io";
import cookie from "cookie";
import { socketAut } from "./src/middleware/socketAuth.js";
import { Message } from "./src/models/Message.model.js";
import { User } from "./src/models/User.model.js";
dotenv.config();

const app = express();

const server = createServer(app);

export const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
    credentials: true,
  },
});

socketAut(io);

app.post(
  "/api/v1/course/webhook",
  express.raw({ type: "application/json" }),
  stripeWebhook
);

// ✅ Other middleware (after webhook route)
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);
app.use(cookieParser());
app.use(express.json()); // will not interfere with webhook now
app.use(express.urlencoded({ extended: true }));
// app.use((err, req, res, next) => {
//   console.error("Global Error Handler:", err);
//   res.status(400).json({ success: false, message: err.message });
// });

// ✅ Your other routes
app.use("/api/v1/user", userRouter);
app.use("/api/v1/course", courseRoute);
app.use("/api/v1/lectureprogress", lectureProgree);
app.use("/api/v1/instructor", instructorRoute);
app.use("/api/v1/group", groupRoute);

io.on("connection", async (socket) => {
  const { user } = socket;
  const usr = await User.findOne({ _id: user?._id });
  const { avatar, name, _id } = usr;

  socket.on("join-room", (roomId) => {
    socket.join(roomId);
  });

  socket.on("message", async (msg) => {
    const { content, group, roomId } = msg; // <-- yaha groupId nahi, group

    const msgToSave = {
      content,
      group, // consistent name
      sender: socket.user?._id,
    };

    try {
      await Message.create(msgToSave);
    } catch (error) {
      console.log(error?.message);
    }

    io.to(roomId).emit("msg-from-server", {
      message: {
        content,
        group, // same name as DB
        sender: {
          name,
          _id,
          avatar,
        },
      },
    });
  });

  socket.on("disconnect", () => {
    console.log("❌ User disconnected:", socket.id);
  });
});


server.listen(process.env.PORT, () => {
  console.log(`✅ Server listening on port ${process.env.PORT}`);
});

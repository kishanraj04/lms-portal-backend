import { User } from "../models/User.model.js";
import jwt from "jsonwebtoken";
import cookie from "cookie";

export const socketAut = (io) => {
  io.use(async (socket, next) => {


    try {
      const cookies = cookie.parse(socket.handshake.headers.cookie || "");
      const token = cookies.token;

    
      if (!token) return next(new Error("Authentication error: No token"));

      const decoded = jwt.verify(token, process.env.JWT_SECRET);
    //   const user = await User.findById(decoded.id).select("-password");
      if (!decoded) return next(new Error("Authentication error: User not found"));

      socket.user = decoded;
      next();
    } catch (err) {
      console.error("Socket authentication error:", err.message);
      next(new Error("Authentication error"));
    }
  });
};

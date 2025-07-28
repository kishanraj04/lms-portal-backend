import dotenv from 'dotenv';
dotenv.config(); // 👈 Make sure this is before using process.env

import mongoose from "mongoose";

(async () => {
  try {
    await mongoose.connect(process.env.MONGODBURI);
    console.log("✅ DB connected");
  } catch (error) {
    console.log("❌ Error:", error?.message);
  }
})();

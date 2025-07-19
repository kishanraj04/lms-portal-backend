import mongoose from "mongoose";

(async()=>
{
    try {
        await mongoose.connect("mongodb://localhost:27017/lms")
        console.log("db connected");
    } catch (error) {
        console.log(error?.message);
    }
})()
import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema({
    review:{
        type:String,
        required:true
    },
    courseId:{
        type:mongoose.Types.ObjectId,
        required:true
    },
    reviewer:{
        type:mongoose.Types.ObjectId,
        required:true,
        ref:"User"
    },
    rating:{
        type:Number,
        required:true,
        enum:[1,2,3,4,5]
    }
})

export const Review = mongoose.model("ReviewModel",reviewSchema)
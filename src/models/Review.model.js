import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema({
    review:{
        type:String
    },
    reviewer:{
        type:mongoose.Types.ObjectId,
        ref:"User"
    }
})

const ReviewModel = mongoose.model("ReviewModel",reviewSchema)
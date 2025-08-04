import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema({
    review:{
        type:String
    },
    reviewer:{
        type:mongoose.Types.ObjectId,
        ref:"User"
    },
    rating:{
        type:Number,
        enum:[1,2,3,4,5]
    }
})

const ReviewModel = mongoose.model("ReviewModel",reviewSchema)
import mongoose from 'mongoose'
const lectureProgressSchema = new mongoose.Schema({
    userId:{
        type:mongoose.Types.ObjectId,
        res:"User",
        required:true
    },
    progress:{
        type:Number,
        required:true
    },
    lectureId:{
        type:mongoose.Types.ObjectId,
        ref:"Lecture",
        required:true
    },
    duration:{
        type:Number,
        required:true
    },
    courseId:{
        type:mongoose.Types.ObjectId,
        ref:"Course",
        required:true
    }
})

export const LectureProgress = mongoose.model("LectureProgress",lectureProgressSchema)


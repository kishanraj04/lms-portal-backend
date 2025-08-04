import mongoose from "mongoose";

const resourcesSchema = mongoose.Schema({
     courseId:{
        type:mongoose.Types.ObjectId,
        ref:"Course",
        required:true
     },
     lectureId:{
        type:mongoose.Types.ObjectId,
        ref:"Lecture",
        required:true
     },
     instructor:{
        type:mongoose.Types.ObjectId,
        ref:"User",
        required:true
     },
     resources:[{
        public_id:{
            type:String,
            required:true
        },
        url:{
            type:String,
            required:true
        }
     }]
})

export const Resources = mongoose.model("Resources",resourcesSchema)
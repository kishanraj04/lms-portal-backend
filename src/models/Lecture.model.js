import mongoose from "mongoose";

const lectureSchema = new mongoose.Schema({
      content:{
        public_id:{
            type:String,
        },
        url:{
            type:String
        }
      },
      creator:{
        type:mongoose.Types.ObjectId,
        ref:"User"
      }
})

const LectureSchema = mongoose.model("LectureSchema",lectureSchema)
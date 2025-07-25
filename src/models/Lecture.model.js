import mongoose from "mongoose";

const lectureSchema = new mongoose.Schema({
      vedio:{
        public_id:{
            type:String,
        },
        url:{
            type:String
        }
      },
      lectureTitle:{
        type:String,
        required:true
      }
})

const LectureSchema = mongoose.model("LectureSchema",lectureSchema)
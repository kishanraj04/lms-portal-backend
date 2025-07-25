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
      },
      courseId:{
        type:mongoose.Types.ObjectId,
        ref:"Course"
      },
      isFree:{
        type:Boolean,
        default:false
      }
})

export const Lecture = mongoose.model("Lecture",lectureSchema)
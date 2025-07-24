import mongoos, { Mongoose } from "mongoose";
const courseSchema = new mongoos.Schema({
  title: {
    type: String,
    required: true,
  },
  thumbnail:{
    public_id:{
      type:String,
      required:true
    },
    url:{
      type:String,
      required:true
    }
  },
  price:{
    type:String,
    required:true
  },
  discountPrice:{
    type:String,
    required:true
  },
  description:{
    type:String,
    required:true
  },
  courselevel:{
    type:String,
    required:true,
    enum:["basic","medium","advance"]
  },
  creator:{
    type:mongoos.Schema.ObjectId,
    ref:"User",
    required:true
  },
  enrolledStudent:[{
    type:mongoos.Types.ObjectId,
    ref:"User",
    required:true
  }],
  lectures:[{
    type:mongoos.Types.ObjectId,
    ref:"Lecture"
  }]
});

export const Course = mongoos.model("Course", courseSchema);

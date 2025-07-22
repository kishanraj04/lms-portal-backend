import mongoose, { get } from "mongoose";
import bcrypt from 'bcrypt'
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    match: [
      /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
      "Please enter a valid email address",
    ],
    unique:true
  },
  password:{
   type:String,
   required:true
  },
  email:{
   type:String,
   required:true
  },
  avatar: {
    type: String,
  },
  course:{
    type:mongoose.Types.ObjectId,
    ref:"Course"
  },
  role:{
    type:String,
    enum:["instructor","student"],
    default:"student"
  },
  enrolled:[{
    type:mongoose.Types.ObjectId,
    ref:"Courses"
  }]
}
)

// userSchema.virtual("nameemail").get(function (){
//     return this.name+" "+this.password
// }).set(function (value){
// //    console.log(value);
// })

userSchema.pre("save",async function (next){
   if (!this.isModified('password')) return next();
   
   try {
    const salt = await bcrypt.genSalt(10)
    this.password = await bcrypt.hash(this.password,salt)
    next()
   } catch (error) {
     next(error?.message)
   }
})

export const User = mongoose.model("User", userSchema);


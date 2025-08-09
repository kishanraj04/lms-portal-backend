import mongoose from "mongoose";

const messageSchema = new mongoose.Schema({
      content:{
        type:String,
        required:true
      },
      group:{
        type:mongoose.Types.ObjectId,
        ref:"Group",
        required:true
      },
      sender:{
        type:mongoose.Types.ObjectId,
        ref:"User"
      }
})

export const Message = mongoose.model("Message",messageSchema)
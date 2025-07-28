import mongoose from 'mongoose'
const purchaseSchema = new mongoose.Schema({
    courseId:{
        type:String,
        required:true
    },
    userId:{
        type:String,
        required:true
    },
    paymentStatus:{ 
        type:String,
        enum:["pending","completed","failed"],
        default:"pending"
    },
    amount:{
        type:Number,
        required:true
    },
    paymentId:{
      type:String,
      required:true
    }
},{timestamps:true})

export const Purchase = mongoose.model("Purchase",purchaseSchema)
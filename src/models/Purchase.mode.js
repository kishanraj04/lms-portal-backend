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
    },
    month:{
        type:String
    }
},{timestamps:true})

purchaseSchema.pre('save',async function(next){
    const createdAt = new Date(this.createdAt)
    const createdMonth = createdAt.toLocaleString("en-US",{month:"short"})
    this.month = createdMonth
    next()
})

export const Purchase = mongoose.model("Purchase",purchaseSchema)
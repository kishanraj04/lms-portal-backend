import mongoose from 'mongoose';

const groupSchema = new mongoose.Schema({
  name:{
    type:String,
    required:true
  }, 
  avatar:{
    type:String,
    required:true
  },
  course: { type: mongoose.Schema.Types.ObjectId, ref: 'Course' },
  roomId: { type: String, required: true, unique: true },
  members: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
});

export const Group =  mongoose.model('Group', groupSchema);

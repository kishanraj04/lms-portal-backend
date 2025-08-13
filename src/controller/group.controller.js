import mongoose from "mongoose";
import { Group } from "../models/Group.mode.js";
import { Message } from "../models/Message.model.js";
import { User } from "../models/User.model.js";

export const getGroup = async (req, res) => {
  try {
    const { _id } = req?.user;
    const groups = await Group.find({ members: _id });

    const modifyGroup = groups?.map(
      ({
        _id: groupId,
        name: groupName,
        avatar: groupTheam,
        roomId,
        createdBy: creator,
      }) => ({
        groupId,
        groupName,
        groupTheam,
        roomId,
        creator,
      })
    );
    return res.status(200).json({ success: true, group: modifyGroup });
  } catch (error) {
    return res.status(500).json({ success: false, message: error?.message });
  }
};

export const getGroupMessage = async (req, res) => {
  try {
    const { groupId } = req?.params;
    const { _id: userId } = req?.user;

    if (!groupId) {
      return res
        .status(400)
        .json({ success: false, message: "group not found", data: [] });
    }

    // Check if user is in deniedStudents array
    const deniedRecord = await Group.findOne({
      _id: groupId,
      deniedStudents: userId,
    });

    const allToSendMsg = !deniedRecord; // true if user is allowed (NOT in deniedStudents)

    // Get messages for the group, populate sender info
    const messages = await Message.find({ group: groupId }).populate(
      "sender",
      "name avatar"
    );

    return res
      .status(200)
      .json({ success: true, message: messages, allToSendMsg });
  } catch (error) {
    return res.status(500).json({ success: false, message: error?.message });
  }
};

export const getMyGroup = async (req, res) => {
  try {
    const userId = req?.user?._id || req?.user; // ensure _id access
    const group = await Group.find({ createdBy: userId })
      .select("name")
      .populate({ path: "course", select: "thumbnail" });

    return res.status(200).json({ success: true, group });
  } catch (error) {
    return res.status(500).json({ success: false, message: error?.message });
  }
};

export const getGroupStudents = async (req, res) => {
  try {
    const { groupId } = req.params;

    const group = await Group.findById(groupId)
      .populate("members", "name email avatar")
      .select("deniedStudents members") // ensure deniedStudents is fetched
      .lean();

    if (!group) {
      return res.status(404).json({ success: false, message: "Group not found" });
    }

    const deniedStudents = (group.deniedStudents || []).map(String);

    const studentsWithStatus = group.members.map((member) => {
      const memberIdStr = member._id.toString();
      return {
        ...member,
        allowToSendMsg: !deniedStudents.includes(memberIdStr),
      };
    });

    return res.status(200).json({ success: true, students: studentsWithStatus });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};


export const stopUserFromSendingMsg = async (req, res) => {
  try {
    const { studentId } = req.params;
    const { groupId } = req?.body;

    // Add studentId to deniedStudents (avoid duplicates with $addToSet)
    await Group.updateOne(
      { _id: groupId },
      { $addToSet: { deniedStudents: studentId } }
    );

    return res
      .status(200)
      .json({ success: true, message: "Now, user can't send message" });
  } catch (error) {
    return res.status(500).json({ success: false, message: error?.message });
  }
};

export const allowUserFromSendingMsg = async (req, res) => {
  try {
    const { studentId } = req.params;
    const { groupId } = req?.body;

    // Remove studentId from deniedStudents
    await Group.updateOne(
      { _id: groupId },
      { $pull: { deniedStudents: studentId } }
    );

    return res
      .status(200)
      .json({ success: true, message: "Now, user can send message" });
  } catch (error) {
    return res.status(500).json({ success: false, message: error?.message });
  }
};


export const removeUserFromGroup = async(req,res)=>{
  try {
    const {groupId} = req?.params;
    const {studentId} = req?.body;

    if(!studentId){
      return res.status(400).json({success:false,message:"student not found"})
    }
    const removeFromDeneid = await Group.findByIdAndUpdate(groupId,{$pull:{deniedStudents:studentId}},{new:true})
    
    const removeFromMember = await Group.findByIdAndUpdate(groupId,{$pull:{members:studentId}},{new:true})

    return res.status(200).json({success:true,message:"student removed"})
  } catch (error) {
    return res.status(500).json({success:false,message:error?.message})
  }
}

export const addStudentInGroup = async(req,res)=>{
  try {
    const {groupId} = req?.params;
    const {email} = req?.body;
    console.log(groupId , email);
    const group = await Group.findOne({_id:groupId})
    if(!group){
      return res.status(404).json({success:false,message:"group not found"})
    }
    const student = await User.findOne({email:email}).select({"email":1})
    if(!student){
      return res.status(404).json({success:false,message:"student not found"})
    }

    const {_id:studentId} = student;
     group.members.push(studentId)
    await group.save()

    return res.status(200).json({success:true,message:"student added"})
  } catch (error) {
    return res.status(500).json({success:false,message:error?.message})
  }
}
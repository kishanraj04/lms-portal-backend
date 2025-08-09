import { Group } from "../models/Group.mode.js";
import { Message } from "../models/Message.model.js";

export const getGroup = async(req,res)=>{
    try {
        const {_id} = req?.user;
        
        const groups = await Group.find({members:_id})
        
        const modifyGroup =groups?.map(({_id:groupId,name:groupName,avatar:groupTheam,roomId,createdBy:creator})=>({
            groupId,
            groupName,
            groupTheam,
            roomId,
            creator
        }))

        return res.status(200).json({success:true,group:modifyGroup})
    } catch (error) {
        return res.status(500).json({success:false,message:error?.message})
    }
}

export const getGroupMessage = async(req,res)=>{
    try {
        const {groupId} = req?.params
        if(!groupId){
            return res.status(400).json({success:false,message:"group not found" , data:[]})
        }

        const messages = await Message.find({group:groupId}).populate("sender","name avatar")
        
        return res.status(200).json({success:true,message:messages})
    } catch (error) {
        return res.status(500).json({success:false,message:error?.message})
    }
}
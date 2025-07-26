import { User } from "../models/User.model.js"

export const isInstructor = async(req,res,next)=>{
    try {
        
        const user = req.user
        const userDet = await User.findOne({email:user?.email})
        if(!userDet){
            return res.status(404).json({success:false,message:"user not found"})
        }
        if(userDet?.role!="Instructor"){
            return res.status(400).json({success:false,message:"unauthorized user"})
        }
        req.user = userDet;
        next()
    } catch (error) {
        return res.status(500).json({success:false,message:error?.message})
    }
}
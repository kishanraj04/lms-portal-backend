import { User } from "../models/User.model.js"

export const isUserExist = async(email)=>{
    try {
        const isExist = await User.findOne({email})
        return isExist
    } catch (error) {
        return false;
    }
}
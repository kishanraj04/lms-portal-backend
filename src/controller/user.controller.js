import { User } from "../models/User.model.js";
import { genAndSaveToken } from "../utils/genAndSaveToken.js";
import { isUserExist } from "../utils/isUserExist.js";
import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt'
export const userRegister = async(req,res)=>{
    try {
        const {name,email,password,avatar} = req.body
        if(!name || !email || !password){
            return res.status(400).json({success:false,message:"all fields are required"})
        }

        const isExistUser = await User.findOne({email})
        if(isExistUser){
            return res.status(400).json({success:false,message:"user exist with this email"})
        }

        const user = await User.create({name,email,password})
        return res.status(200).json({success:true,message:"user created",user})
    } catch (error) {
        return res.status(500).json({success:false,message:error?.message})
    }
}

export const userLogin = async(req,res)=>{
    try {
        const {email,password} = req.body
        const isExist = await isUserExist(email)
        if(!isExist){
            return res.status(400).json({success:false,message:"user not found"})
        }
        const isCorrect = await bcrypt.compare(password,isExist?.password)
        if(!isCorrect){
            return res.status(404).json({success:false,message:"invalid email or password"})
        }
        genAndSaveToken(req,res,isExist)
    } catch (error) {
        console.log(error?.message);
    }
}

export const directLogin = async(req,res)=>{
    try {
    const token = req.cookies.token
        if(!token){
            return res.status(401).json({success:false,message:"unauthorized access"})
        }
    const user = await jwt.verify(token,process.env.JWT_SECRET)
    if(!user){
       return res.status(401).json({success:false,message:"unauthorized access"})
    }

    return res.status(200).json({success:true,message:"valid user",user})
    } catch (error) {
        console.log(error?.message);
    }
}
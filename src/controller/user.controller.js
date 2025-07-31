import { User } from "../models/User.model.js";
import { genAndSaveToken } from "../utils/genAndSaveToken.js";
import { isUserExist } from "../utils/isUserExist.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import cloudinary from "../../config/cloudinary.config.js";
import { getPublicId } from "../helper/helper.js";
import { model } from "mongoose";
export const userRegister = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!req.file || req.file.length === 0) {
      return res
        .status(400)
        .json({ success: false, message: "Upload You Avatar" });
    }

    if (!name || !email || !password) {
      return res
        .status(400)
        .json({ success: false, message: "all fields are required" });
    }

    const fileUrl = req?.file?.path;
    const isExistUser = await User.findOne({ email });
    if (isExistUser) {
      return res
        .status(400)
        .json({ success: false, message: "user exist with this email" });
    }

    const user = await User.create({ name, email, password, avatar: fileUrl });
    return res
      .status(200)
      .json({ success: true, message: "user created", user });
  } catch (error) {
    return res.status(500).json({ success: false, message: error?.message });
  }
};

export const userLogin = async (req, res) => {
  try {
    const { email, password } = req.body;
    const isExist = await isUserExist(email);
    if (!isExist) {
      return res
        .status(400)
        .json({ success: false, message: "user not found" });
    }
    const isCorrect = await bcrypt.compare(password, isExist?.password);
    if (!isCorrect) {
      return res
        .status(404)
        .json({ success: false, message: "invalid email or password" });
    }
    genAndSaveToken(req, res, isExist);
  } catch (error) {
    console.log(error?.message);
  }
};

export const directLogin = async (req, res) => {
  try {
    const token = req.cookies.token;
    if (!token) {
      return res
        .status(401)
        .json({ success: false, message: "unauthorized access" });
    }
    const user = await jwt.verify(token, process.env.JWT_SECRET);
    if (!user) {
      return res
        .status(401)
        .json({ success: false, message: "unauthorized access" });
    }
    const email = user?.email;
    if (!email) {
      return res
        .status(401)
        .json({ success: false, message: "unauthorized access" });
    }

    const usr = await User.findOne({ email });
    if (!usr) {
      return res
        .status(404)
        .json({ success: false, message: "unauthorized user" });
    }

    return res
      .status(200)
      .json({ success: true, message: "valid user", user: usr });
  } catch (error) {
    console.log(error?.message);
  }
};

export const logoutUser = async (req, res) => {
  try {
    const token = req.cookies.token;
    if (!token) {
      return res
        .status(400)
        .json({ success: false, message: "user already logout" });
    }

    res.clearCookie("token").json({ success: true, message: "user logout" });
  } catch (error) {
    return res.status(500).json({ success: false, message: error?.message });
  }
};

export const updateUserProfile = async (req, res) => {
  try {
    const { name, role } = req.body;
    const file = req?.file;
    

    const { email } = req.user;
    const oldUser = await User.findOne({ email });
    if (!oldUser) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    // If new image uploaded but no new avatar URL (old image still exists)
    let fileUrl = "";
    if (file && oldUser?.avatar) {
      const publicId = getPublicId(oldUser.avatar);
      fileUrl = req?.file?.path;
      const result = await cloudinary.uploader.destroy(publicId, {
        invalidate: true,
      });

      const updatedUser = await User.findOneAndUpdate(
        { email: email },
        {
          $set: {
            name: name,
            avatar: fileUrl,
          },
        },
        { new: true }
      );
    }else{
      await User?.findOneAndUpdate({email:email},{
        name:name,
        role:role
      })
    }

    return res
      .status(200)
      .json({ success: true, message: "Profile updated successfully" });
  } catch (error) {
    return res.status(500).json({ success: false, message: error?.message });
  }
};

export const getUserProfile = async(req,res)=>{
  try {
    const {email} = req?.user
    if(!email){
      return res.status(500).json({success:false,message:"unauthorized user"})
    }

    const user = await User.findOne({email}).populate({path:"enrolled",populate:{
      path:"creator",
      model:"User"
    }})
    if(!user){
      return res.status(404).json({success:false,message:"user not found"})
    }

    return res.status(200).json({success:true,message:"user found",user})
  } catch (error) {
    return res.status(500).json({success:false,message:error?.message})
  }
}
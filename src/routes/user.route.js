import express from 'express'
import { directLogin, getUserProfile, logoutUser, updateUserProfile, userLogin, userRegister } from '../controller/user.controller.js'
import { uploadSingle } from '../middleware/multer.js'
import { isAuthenticated } from '../middleware/isAuthenticated.js'

const userRouter = express.Router()

userRouter.post("/register",uploadSingle,userRegister)
userRouter.post("/login",userLogin)
userRouter.get("/directlogin",directLogin)
userRouter.get("/logout",logoutUser)
userRouter.put("/update/profile",uploadSingle,isAuthenticated, updateUserProfile)
userRouter.get("/user/profile",isAuthenticated,getUserProfile)
export {userRouter}
import express from 'express'
import { directLogin, logoutUser, userLogin, userRegister } from '../controller/user.controller.js'
import { uploadSingle } from '../middleware/multer.js'

const userRouter = express.Router()

userRouter.post("/register",uploadSingle,userRegister)
userRouter.post("/login",userLogin)
userRouter.get("/directlogin",directLogin)
userRouter.get("/logout",logoutUser)
export {userRouter}
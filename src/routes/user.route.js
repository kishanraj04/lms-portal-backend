import express from 'express'
import { directLogin, userLogin, userRegister } from '../controller/user.controller.js'
import { uploadSingle } from '../middleware/multer.js'

const userRouter = express.Router()

userRouter.post("/register",uploadSingle,userRegister)
userRouter.post("/login",userLogin)
userRouter.get("/directlogin",directLogin)
export {userRouter}
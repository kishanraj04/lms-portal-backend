import express from 'express'
import { directLogin, userLogin, userRegister } from '../controller/user.controller.js'

const userRouter = express.Router()

userRouter.post("/register",userRegister)
userRouter.post("/login",userLogin)
userRouter.get("/directlogin",directLogin)
export {userRouter}
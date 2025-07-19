import express from 'express'
import { userLogin, userRegister } from '../controller/user.controller.js'

const userRouter = express.Router()

userRouter.post("/register",userRegister)
userRouter.post("/login",userLogin)

export {userRouter}
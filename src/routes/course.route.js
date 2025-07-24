import express from 'express'
import { isAuthenticated } from '../middleware/isAuthenticated.js'
import { createCourse } from '../controller/course.controller.js'
import { isInstructor } from '../middleware/isInstructor.js'
import {  uploadThumbnail } from '../middleware/multer.js'

const courseRoute = express.Router()

courseRoute.post("/create",uploadThumbnail,isAuthenticated,isInstructor,createCourse)

export {courseRoute}
import express from 'express'
import { isAuthenticated } from '../middleware/isAuthenticated.js'
import { createCourse, getAllCourses } from '../controller/course.controller.js'
import { isInstructor } from '../middleware/isInstructor.js'
import {  uploadThumbnail } from '../middleware/multer.js'

const courseRoute = express.Router()

courseRoute.post("/create",uploadThumbnail,isAuthenticated,isInstructor,createCourse)

courseRoute.get("/allCourse",isAuthenticated,getAllCourses)

export {courseRoute}
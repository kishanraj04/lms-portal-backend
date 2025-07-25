import express from 'express'
import { isAuthenticated } from '../middleware/isAuthenticated.js'
import { createCourse, editCourse, getAllCourses, getCourseById, getMyCourses } from '../controller/course.controller.js'
import { isInstructor } from '../middleware/isInstructor.js'
import {  uploadThumbnail } from '../middleware/multer.js'

const courseRoute = express.Router()

courseRoute.post("/create",uploadThumbnail,isAuthenticated,isInstructor,createCourse)

courseRoute.get("/allCourse",isAuthenticated,getAllCourses)

courseRoute.get("/me",isAuthenticated,isInstructor,getMyCourses)

courseRoute.get("/:id",isAuthenticated,isInstructor,getCourseById)

courseRoute.put("/:id",isAuthenticated,isInstructor,editCourse) 

export {courseRoute}
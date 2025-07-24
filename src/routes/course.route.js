import express from 'express'
import { isAuthenticated } from '../middleware/isAuthenticated.js'
import { createCourse } from '../controller/course.controller.js'
import { isInstructor } from '../middleware/isInstructor.js'

const courseRoute = express.Router()

courseRoute.post("/create",isAuthenticated,isInstructor,createCourse)

export {courseRoute}
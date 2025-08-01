import express from 'express'
import { isAuthenticated } from '../middleware/isAuthenticated.js'
import { enrolledStudentInSpecificCourse, getInstructoCourse } from '../controller/instructor.controller.js'
import { isInstructor } from '../middleware/isInstructor.js'

const instructorRoute = express.Router()

instructorRoute.get("/instructor-course",isAuthenticated,isInstructor,getInstructoCourse)

instructorRoute.get("/instructor/course/enrolled/:courseId",isAuthenticated,isInstructor,enrolledStudentInSpecificCourse)

export {instructorRoute}
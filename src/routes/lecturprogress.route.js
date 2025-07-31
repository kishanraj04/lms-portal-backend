import express from 'express'
import { isAuthenticated } from '../middleware/isAuthenticated.js'
import { courseWithEnrollStudent, getCompletedLecture, instructorCourseWithPrice, monthRevenue, saveLectureProgress } from '../controller/lectureprogress.controller.js'
import { isInstructor } from '../middleware/isInstructor.js'

const lectureProgree = express.Router()

lectureProgree.post("/lecture/progress",isAuthenticated,saveLectureProgress)

lectureProgree.get("/lecture/pregress/completed/:courseId",isAuthenticated,isInstructor ,getCompletedLecture)

lectureProgree.get("/instructorcourse/with-price",isAuthenticated,isInstructor,instructorCourseWithPrice)

lectureProgree.get("/course/with-enrolled-student",isAuthenticated,isInstructor,courseWithEnrollStudent)

lectureProgree.get("/month/revenue",isAuthenticated,isInstructor,monthRevenue)

export {lectureProgree}
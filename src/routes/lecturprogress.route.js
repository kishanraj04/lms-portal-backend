import express from 'express'
import { isAuthenticated } from '../middleware/isAuthenticated.js'
import { getCompletedLecture, saveLectureProgress } from '../controller/lectureprogress.controller.js'

const lectureProgree = express.Router()

lectureProgree.post("/lecture/progress",isAuthenticated,saveLectureProgress)

lectureProgree.get("/lecture/pregress/completed/:courseId",isAuthenticated,getCompletedLecture)

export {lectureProgree}
import express from 'express'
import { isAuthenticated } from '../middleware/isAuthenticated.js'
import { addStudentInGroup, allowUserFromSendingMsg, getGroup, getGroupMessage, getGroupStudents, getMyGroup, removeUserFromGroup, stopUserFromSendingMsg } from '../controller/group.controller.js'
import { isInstructor } from '../middleware/isInstructor.js'
const groupRoute = express.Router()

groupRoute.get("/group",isAuthenticated,getGroup)

groupRoute.get("/message/:groupId",isAuthenticated,getGroupMessage)

groupRoute.get("/group/me",isAuthenticated,isInstructor,getMyGroup)

groupRoute.get("/group/student/:groupId",isAuthenticated,isInstructor,getGroupStudents)


groupRoute.put("/stop/user-msg/:studentId",isAuthenticated,isInstructor,stopUserFromSendingMsg)

groupRoute.put("/allow/user-msg/:studentId",isAuthenticated,isInstructor,allowUserFromSendingMsg)

groupRoute.delete("/group/delete-student/:groupId",isAuthenticated,isInstructor,removeUserFromGroup)

groupRoute.post("/group/add-student/:groupId",isAuthenticated,isInstructor,addStudentInGroup)

export  {groupRoute}
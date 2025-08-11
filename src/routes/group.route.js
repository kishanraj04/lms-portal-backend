import express from 'express'
import { isAuthenticated } from '../middleware/isAuthenticated.js'
import { getGroup, getGroupMessage, getMyGroup } from '../controller/group.controller.js'
import { isInstructor } from '../middleware/isInstructor.js'
const groupRoute = express.Router()

groupRoute.get("/group",isAuthenticated,getGroup)

groupRoute.get("/message/:groupId",isAuthenticated,getGroupMessage)

groupRoute.get("/group/me",isAuthenticated,isInstructor,getMyGroup)

export  {groupRoute}
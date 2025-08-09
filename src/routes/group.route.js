import express from 'express'
import { isAuthenticated } from '../middleware/isAuthenticated.js'
import { getGroup, getGroupMessage } from '../controller/group.controller.js'
const groupRoute = express.Router()

groupRoute.get("/group",isAuthenticated,getGroup)

groupRoute.get("/message/:groupId",isAuthenticated,getGroupMessage)

export  {groupRoute}
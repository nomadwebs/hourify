import { Router } from "express"

import { authorizationHandler, jsonBodyParser } from "../helpers/index.js"

import {
    addActivityCommentHandler,
    getActivityByPackIdHandler,
} from './handlers/index.js'


const activitiesRouter = Router()

activitiesRouter.get('/get-activities/:packId', authorizationHandler, getActivityByPackIdHandler)
activitiesRouter.put('/add-comment/:activityId', authorizationHandler, addActivityCommentHandler, jsonBodyParser)

export default activitiesRouter
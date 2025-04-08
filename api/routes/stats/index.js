import { Router, json } from "express"

import { authorizationHandler } from "../helpers/index.js"

import {
    getMonthEarnedHandler,
    getMonthHoursTrackedHandler,
    getMonthUnitsTrackedHandler,
    getMonthPaymentsHandler,
} from './handlers/index.js'

const statsRouter = Router()

statsRouter.get('/get-earned', authorizationHandler, getMonthEarnedHandler)
statsRouter.get('/get-payments', authorizationHandler, getMonthPaymentsHandler)
statsRouter.get('/get-hours-tracked', authorizationHandler, getMonthHoursTrackedHandler)
statsRouter.get('/get-units-tracked', authorizationHandler, getMonthUnitsTrackedHandler)

export default statsRouter
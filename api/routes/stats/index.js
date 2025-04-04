import { Router, json } from "express"

import { jsonBodyParser, authorizationHandler } from "../helpers/index.js"

import {
    getMonthEarnedHandler
} from './handlers/index.js'

const statsRouter = Router()

statsRouter.get('/get-earned', authorizationHandler, jsonBodyParser, getMonthEarnedHandler)

export default statsRouter
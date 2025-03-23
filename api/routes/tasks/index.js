import { Router } from 'express'

import { authorizationHandler, jsonBodyParser } from '../helpers/index.js'

import { addTaskHandler } from './handlers/index.js'

const tasksRouter = Router()

tasksRouter.post('/add-task', authorizationHandler, jsonBodyParser, addTaskHandler)

export default tasksRouter

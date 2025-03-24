import { Router } from 'express'

import { authorizationHandler, jsonBodyParser } from '../helpers/index.js'

import { addTaskHandler, getTasksHandler } from './handlers/index.js'

const tasksRouter = Router()

tasksRouter.post('/add-task', authorizationHandler, jsonBodyParser, addTaskHandler)
tasksRouter.get('/get-tasks', authorizationHandler, getTasksHandler)

export default tasksRouter

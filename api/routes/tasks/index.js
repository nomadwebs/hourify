import { Router } from 'express'

import { authorizationHandler, jsonBodyParser } from '../helpers/index.js'

import { addTaskHandler, getTasksHandler, deleteTaskHandler, updateTaskHandler } from './handlers/index.js'

const tasksRouter = Router()

tasksRouter.post('/add-task', authorizationHandler, jsonBodyParser, addTaskHandler)
tasksRouter.get('/get-tasks', authorizationHandler, getTasksHandler)
tasksRouter.delete('/delete/:taskId', authorizationHandler, deleteTaskHandler)
tasksRouter.put('/update/:taskId', authorizationHandler, jsonBodyParser, updateTaskHandler)

export default tasksRouter
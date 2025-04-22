import { Router } from 'express'

import { authorizationHandler, jsonBodyParser } from '../helpers/index.js'

import { addEventHandler, getEventsHandler, deleteEventHandler, updateEventHandler } from './handlers/index.js'

const calendarRouter = Router()

calendarRouter.post('/add-event', authorizationHandler, jsonBodyParser, addEventHandler)
calendarRouter.get('/get-events', authorizationHandler, getEventsHandler)
calendarRouter.delete('/delete/:eventId', authorizationHandler, deleteEventHandler)
calendarRouter.put('/update/:eventId', authorizationHandler, jsonBodyParser, updateEventHandler)

export default calendarRouter
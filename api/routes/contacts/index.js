import { Router } from 'express'

import { authorizationHandler, jsonBodyParser } from '../helpers/index.js'

import { createContactHandler, getContactsHandler } from './handlers/index.js'

const contactsRouter = Router()

contactsRouter.post('/create-contact', authorizationHandler, jsonBodyParser, createContactHandler)
contactsRouter.get('/get-contacts', authorizationHandler, getContactsHandler)

export default contactsRouter
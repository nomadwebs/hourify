import { Router } from 'express'

import { authorizationHandler, jsonBodyParser } from '../helpers/index.js'

import { createContactHandler, deleteContactHandler, getContactsHandler, updateContactHandler } from './handlers/index.js'

const contactsRouter = Router()

contactsRouter.post('/create-contact', authorizationHandler, jsonBodyParser, createContactHandler)
contactsRouter.get('/get-contacts', authorizationHandler, getContactsHandler)
contactsRouter.delete('/delete/:contactId', authorizationHandler, deleteContactHandler)
contactsRouter.put('/update/:contactId', authorizationHandler, jsonBodyParser, updateContactHandler)

export default contactsRouter
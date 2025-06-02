import logic from '../../../logic/index.js';
import { createFunctionalHandler } from '../../helpers/index.js'

export default createFunctionalHandler((req, res) => {

    const { userId, params: { contactId }, body: { name, email, phone, contactType, nif, address, city, postalCode, website, notes, linkedUserId, numberOfSessions, sessionsRecurrency, timeSchedule } } = req

    return logic.updateContact(userId, contactId, name, email, phone, contactType, nif, address, city, postalCode, website, notes, linkedUserId, numberOfSessions, sessionsRecurrency, timeSchedule)
        .then(() => {
            res.status(201).send()
        })
})
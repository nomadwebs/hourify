import logic from '../../../logic/index.js'
import { createFunctionalHandler } from '../../helpers/index.js'

export default createFunctionalHandler(async (req, res) => {
    const { userId, body: { name, email, phone, contactType, nif, address, city, postalCode, website, notes, linkedUserId, numberOfSessions, sessionsRecurrency, timeSchedule } } = req

    await logic.createContact(userId, name, email, phone, contactType, nif, address, city, postalCode, website, notes, linkedUserId, numberOfSessions, sessionsRecurrency, timeSchedule)

    res.status(201).send()
})

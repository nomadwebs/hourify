import logic from '../../../logic/index.js'
import { createFunctionalHandler } from '../../helpers/index.js'

export default createFunctionalHandler(async (req, res) => {
    const { userId, body: { title, description, location, attendees, startDateTime, endDateTime, typeEvent } } = req

    await logic.addEvent(userId, title, description, location, attendees, startDateTime, endDateTime, typeEvent)

    res.status(201).send()
})
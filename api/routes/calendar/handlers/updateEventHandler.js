import logic from '../../../logic/index.js';
import { createFunctionalHandler } from '../../helpers/index.js'

export default createFunctionalHandler((req, res) => {

    const {
        userId, params: { eventId },
        body: { title, description, location, attendees, startDateTime, endDateTime, typeEvent }
    } = req

    return logic.updateEvent(eventId, userId, title, description, location, attendees, startDateTime, endDateTime, typeEvent)
        .then(() => {
            res.status(201).send()
        })
})
import { Event } from "dat"
import { validate, errors } from 'com'

const { SystemError, NotFoundError, OwnershipError } = errors

export default function updateEvent(eventId, userId, title, description, location, attendees, startDateTime, endDateTime) {
    console.log(attendees)

    validate.id(eventId, 'eventId')
    validate.id(userId, 'userId')
    validate.text(title, 'title')
    validate.text(description, 'description')
    validate.text(location, 'location')
    validate.attendees(attendees)

    if (startDateTime) validate.date(new Date(startDateTime))
    if (endDateTime) validate.date(new Date(endDateTime))

    return Event.findById(eventId).lean()
        .catch(error => { throw new SystemError(error.message) })
        .then(event => {
            if (!event) throw new NotFoundError('event not found')
            if (event.creator.toString() !== userId) throw new OwnershipError('user is not the owner of the event')

            // Rellenar fechas si están vacías
            if (!startDateTime) startDateTime = new Date()
            if (!endDateTime) {
                endDateTime = new Date(startDateTime)
                endDateTime.setHours(endDateTime.getHours() + 1)
            }

            return Event.findByIdAndUpdate(
                eventId,
                {
                    title,
                    description,
                    location,
                    attendees,
                    startDateTime,
                    endDateTime,
                },
                { new: true } // <- para que devuelva el evento actualizado
            )
                .catch(error => { throw new SystemError(error.message) })
        })
}

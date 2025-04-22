import { Event } from 'dat'
import { validate, errors } from 'com'

const { SystemError, NotFoundError, OwnershipError } = errors

export default function deleteEvent(userId, eventId) {
    validate.id(eventId, 'eventId')
    validate.id(userId, 'userId')

    console.log(eventId)
    console.log(userId)

    return Event.findById(eventId).lean()
        .catch(error => { throw new SystemError(error.message) })
        .then(event => {
            if (!event) throw new NotFoundError('event not found')
            if (event.creator.toString() !== userId) throw new OwnershipError('not the owner of the event')

            return Event.findByIdAndDelete(eventId)
                .catch(error => { throw new SystemError(error.message) })
        })
}

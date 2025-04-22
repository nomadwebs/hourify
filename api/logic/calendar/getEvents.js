import { Event, User } from 'dat'
import { errors, validate } from 'com'

const { SystemError, NotFoundError } = errors

export default (userId) => {
    validate.id(userId, 'userId')

    return User.findById(userId).lean()
        .catch(error => { throw new SystemError(error.message) })
        .then(user => {
            if (!user) throw new NotFoundError('user not found')

            return Event.find({ creator: userId }).lean()
                .then(events => {
                    if (!events || events.length === 0)
                        throw new NotFoundError('no events found for this user')

                    events.forEach(event => {
                        event.id = event._id.toString()
                        delete event._id
                    })

                    return events
                })
                .catch(error => {
                    throw new SystemError(error.message)
                })
        })
}

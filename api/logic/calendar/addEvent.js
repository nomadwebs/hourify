import { Event, User } from "dat"
import { validate, errors } from 'com'

const { SystemError, NotFoundError, ValidationError, OwnershipError } = errors

export default (userId, title, description, location, attendees, startDateTime, endDateTime) => {

    console.log('start: ', startDateTime)
    console.log('end: ', endDateTime)

    validate.id(userId)
    validate.text(description, 'description')
    validate.text(title, 'title')
    validate.text(location, 'location')
    validate.attendees(attendees)

    if (startDateTime) validate.date(new Date(startDateTime))
    if (endDateTime) validate.date(new Date(endDateTime))


    return User.findById(userId).lean()
        .catch(error => { throw new SystemError(error.message) })
        .then(user => {
            if (!user) throw new NotFoundError('user not found')

            if (startDateTime === null || startDateTime === undefined || startDateTime === '') {
                startDateTime = new Date()
            }

            if (endDateTime === null || endDateTime === undefined || endDateTime === '') {
                endDateTime = new Date(startDateTime)
                endDateTime.setHours(endDateTime.getHours() + 1)
            }

            return Event.create({ title, description, location, creator: userId, attendees, startDateTime, endDateTime, created: new Date() })
                .catch(error => { throw new SystemError(error.message) })
                .then((eventAdded) => {
                    return eventAdded
                })
        })
}
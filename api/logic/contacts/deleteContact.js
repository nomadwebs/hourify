import { Contact, User } from "dat"
import { validate, errors } from 'com'

const { SystemError, NotFoundError } = errors

export default (userId, contactId) => {
    validate.id(contactId, 'contactId')
    validate.id(userId, 'userId')

    return User.findById(userId).lean()
        .catch(error => { throw new SystemError(error.message) })
        .then(user => {
            if (!user) { throw new NotFoundError('user not found') }

            return Contact.findById(contactId).lean()
                .catch(error => { throw new SystemError(error.message) })
                .then(contact => {
                    if (!contact) { throw new NotFoundError('contact not found') }

                    return Contact.findByIdAndDelete(contactId)
                        .catch(error => { throw new SystemError(error.message) })
                        .then(() => { })
                })
        })
}
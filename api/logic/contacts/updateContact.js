import { Contact, User } from "dat";

import { validate, errors } from 'com'

const { SystemError, NotFoundError, OwnershipError } = errors

let completed = false
let completedDate = null
const lastModified = new Date()

export default (userId, contactId, name, email, phone, contactType, nif, address, city, postalCode, website, notes, linkedUserId, numberOfSessions, sessionsRecurrency, timeSchedule) => {
    validate.id(userId, 'userId')
    validate.name(name)
    if (nif) validate.dni(nif)
    if (phone) validate.phone(phone)
    if (email) validate.email(email)
    if (notes) validate.notes(notes)

    return User.findById(userId)
        .catch(error => { throw new SystemError(error.message) })
        .then(user => {
            if (!user) {
                throw new NotFoundError('user not found')
            }

            return Contact.findById(contactId)
                .catch(error => { throw new SystemError(error.message) })
                .then(contact => {
                    if (!contact) {
                        throw new NotFoundError('Contact not found')
                    }

                    if (contact.creator.toString() !== userId) {
                        throw new OwnershipError('Your user is not the owner of this contact')
                    }

                    return Contact.findByIdAndUpdate(contactId, { name, email, phone, contactType, nif, address, city, postalCode, website, notes, linkedUserId, numberOfSessions, sessionsRecurrency, timeSchedule }, { new: true, runValidators: true })
                        .catch(error => {
                            throw new SystemError(error.message)
                        })
                        .then(() => { })
                })
        })
}


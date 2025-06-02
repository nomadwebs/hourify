import { Contact, User } from "dat";

import { validate, errors } from 'com'

const { SystemError, NotFoundError, OwnershipError } = errors

let completed = false
let completedDate = null
const lastModified = new Date()

export default (userId, contactId, name, email, phone, contactType, nif, address, city, postalCode, website, notes, linkedUserId, numberOfSessions, sessionsRecurrency, timeSchedule) => {

    console.log('===== Task Update Parameters LOGIC =====')
    console.log('userId     : ', userId)
    console.log('contactId     : ', contactId)
    console.log('name: ', name)
    console.log('email: ', email)
    console.log('phone: ', phone)
    console.log('contactType: ', contactType)
    console.log('nif: ', nif)
    console.log('address: ', address)
    console.log('city: ', city)
    console.log('postalCode: ', postalCode)
    console.log('website: ', website)
    console.log('notes: ', notes)
    console.log('linkedUserId: ', linkedUserId)
    console.log('numberOfSessions: ', numberOfSessions)
    console.log('sessionsRecurrency: ', sessionsRecurrency)
    console.log('timeSchedule: ', timeSchedule)
    console.log('================================')

    validate.id(userId, 'userId')
    validate.id(contactId, 'contactId')
    validate.text(name, 'name')
    if (email) validate.email(email)
    if (nif) validate.dni(nif)
    if (address) validate.text(address, 'address')
    if (city) validate.text(city, 'city')
    if (postalCode) validate.text(postalCode, 'postalCode')
    if (website) validate.text(website, 'website')
    if (notes) validate.text(notes, 'notes')




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


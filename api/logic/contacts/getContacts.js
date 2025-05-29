import { Contact, User } from 'dat'
import { errors, validate } from 'com'

const { SystemError, NotFoundError } = errors

export default (userId) => {
    console.log('llego a la función getContacts: ', userId)
    validate.id(userId, 'userId')

    return (async () => {
        let user, contacts

        try {
            user = await User.findById(userId).lean()
        } catch (error) {
            throw new SystemError(error.message)
        }
        if (!user) throw new NotFoundError('user not found')

        try {
            contacts = await Contact.find({ creator: userId }).lean()
        } catch (error) {
            throw new SystemError(error.message)
        }
        if (!contacts || contacts.length === 0) throw new NotFoundError('No contacts found for this userId')

        // Convert _id to id and remove _id
        const formattedContacts = contacts.map(contact => {
            contact.id = contact._id.toString()
            delete contact._id
            return contact
        })

        return formattedContacts

    })()
} 
import { Contact, User } from "dat";

import { validate, errors } from "com";

const { SystemError, NotFoundError } = errors

export default (userId, name, email, phone, contactType, nif, address, city, postalCode, website, notes, linkedUserId, numberOfSessions, sessionsRecurrency, timeSchedule) => {
    //TODO: Revisar las validaciones
    validate.id(userId, 'userId')
    validate.text(name, 'name')
    //validate.email(email) //Como no son usuarios aquí si puedo duplicar los emails
    validate.dni(nif)
    if (phone) validate.text(phone, 'phone')
    if (contactType) validate.text(contactType, 'contactType')
    if (notes) validate.text(notes, 'notes')

    return (async () => {
        const user = await User.findById(userId)
        if (!user) throw new NotFoundError('user not found')

        try {
            return await Contact.create({
                creator: userId,
                name,
                email,
                phone,
                contactType,
                nif,
                address,
                city,
                postalCode,
                website,
                linkedUserId,
                notes,
                numberOfSessions,
                sessionsRecurrency,
                timeSchedule,
                lastInteraction: new Date()
            })
        } catch (error) {
            throw new SystemError(error.message)
        }
    })()
}

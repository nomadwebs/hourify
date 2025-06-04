import { Contact, User } from "dat";

import { validate, errors } from "com";

const { SystemError, NotFoundError } = errors

export default (userId, name, email, phone, contactType, nif, address, city, postalCode, website, notes, linkedUserId, numberOfSessions, sessionsRecurrency, timeSchedule) => {
    validate.id(userId, 'userId')
    validate.name(name)
    if (nif) validate.dni(nif)
    if (phone) validate.phone(phone)
    if (email) validate.email(email)
    if (notes) validate.notes(notes)

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

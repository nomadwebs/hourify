import { Contact, User } from "dat";

import { validate, errors } from "com";

const { SystemError, NotFoundError } = errors

export default (creatorId, name, email, phone, contactType, notes) => {
    validate.id(creatorId, 'creatorId')
    validate.text(name, 'name')
    validate.email(email)
    if (phone) validate.text(phone, 'phone')
    if (contactType) validate.text(contactType, 'contactType')
    if (notes) validate.text(notes, 'notes')

    return (async () => {
        const user = await User.findById(creatorId)
        if (!user) throw new NotFoundError('user not found')

        try {
            return await Contact.create({
                creator: creatorId,
                name,
                email,
                phone,
                contactType,
                notes,
                lastInteraction: new Date()
            })
        } catch (error) {
            throw new SystemError(error.message)
        }
    })()
}

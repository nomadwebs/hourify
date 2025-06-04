import { validate, errors } from 'com'

const { SystemError } = errors

export default (name, email, phone, contactType, nif, address, city, postalCode, website, notes, linkedUserId, numberOfSessions, sessionsRecurrency, timeSchedule) => {
    validate.name(name)
    if (nif) validate.dni(nif)
    if (phone) validate.phone(phone)
    if (email) validate.email(email)
    if (notes) validate.notes(notes)

    return fetch(`${import.meta.env.VITE_API_URL}/contacts/create-contact`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${localStorage.token}`
        },
        body: JSON.stringify({ name, email, phone, contactType, nif, address, city, postalCode, website, notes, linkedUserId, numberOfSessions, sessionsRecurrency, timeSchedule })
    })
        .catch(error => {
            throw new SystemError(error.message)
        })
        .then(res => {
            if (res.ok)
                return

            return res.json()
                .catch(error => {
                    throw new SystemError(error.message)
                })
                .then(({ error, message }) => {
                    throw new errors[error](message)
                })
        })
}   
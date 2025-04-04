import { validate, errors } from 'com'

const { SystemError } = errors

export default (userId, description, dueDate, priority, status, customerId = null, packId = null, notes = null) => {
    validate.id(userId)
    validate.text(description, 'description')
    validate.taskStatus(status, 'status')

    if (notes) validate.text(notes, 'notes')
    if (customerId) validate.id(customerId, 'customerId')
    if (packId) validate.id(packId, 'packId')
    if (dueDate) validate.date(dueDate)


    return fetch(`${import.meta.env.VITE_API_URL}/tasks/add-task`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${localStorage.token}`
        },
        body: JSON.stringify({ userId, description, dueDate, priority, status, customerId, packId, notes })
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
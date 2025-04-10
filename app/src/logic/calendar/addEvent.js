import { validate, errors } from 'com'

const { SystemError } = errors

export default (title, description, location, attendees = [], startDateTime, endDateTime, typeEvent) => {
    //TODO: Validations missing

    return fetch(`${import.meta.env.VITE_API_URL}/calendar/add-event`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${localStorage.token}`
        },
        body: JSON.stringify({ title, description, location, attendees, startDateTime, endDateTime, typeEvent })
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
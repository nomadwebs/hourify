import { validate, errors } from "com"

const { SystemError } = errors

export default function (eventId, title, description, location, attendees = [], startDateTime, endDateTime, typeEvent) {
    //TODO: Add validations
    if (startDateTime !== null && startDateTime !== undefined)
        validate.date(new Date(startDateTime))

    if (endDateTime !== null && endDateTime !== undefined)
        validate.date(new Date(endDateTime))

    // Create the request body with only the defined values
    const body = { title, description, location, attendees, startDateTime, endDateTime, typeEvent }

    // Only add optional parameters if they are provided
    if (startDateTime) body.startDateTime = startDateTime.toISOString()
    if (endDateTime) body.endDateTime = endDateTime.toISOString()

    return fetch(`${import.meta.env.VITE_API_URL}/calendar/update/${eventId}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${localStorage.token}`
        },
        body: JSON.stringify(body)
    })
        .catch(error => { throw new SystemError(error.message) })
        .then(res => {
            if (res.ok)
                return

            return res.json()
                .catch(error => { throw new SystemError(error.message) })
                .then(({ error, message }) => {
                    throw new errors[error](message)
                })
        })
} 
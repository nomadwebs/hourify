import { validate, errors } from 'com'

const { SystemError, NotFoundError } = errors

export default (activityId, comment) => {
    //Validations
    validate.id(activityId, 'activityId')
    if (!comment || typeof comment !== 'string') throw new Error('Comment is required and must be a string')
    if (comment.length > 1000) throw new Error('Comment cannot be longer than 1000 characters')

    //logic and call the api
    return fetch(`${import.meta.env.VITE_API_URL}/activities/add-comment/${activityId}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${localStorage.token}`
        },
        body: JSON.stringify({ comment })
    })
        .then(res => {
            if (res.ok) {
                // For 201 responses, return the activityId since there's no body
                if (res.status === 201) {
                    return { id: activityId }
                }
                return res.json()
            }

            return res.json()
                .then(({ error, message }) => {
                    throw new errors[error](message)
                })
        })
        .catch(error => {
            if (error instanceof errors.NotFoundError) throw error
            throw new SystemError(error.message)
        })
}
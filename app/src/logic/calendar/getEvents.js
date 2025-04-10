import { errors, validate } from 'com'

const { SystemError, NotFoundError } = errors

export default (userId) => {
    validate.id(userId, 'userId')

    return fetch(`${import.meta.env.VITE_API_URL}/calendar/get-events`, {
        method: 'GET',
        headers: {
            Authorization: `Bearer ${localStorage.token}`
        }
    })

        .then(res => {
            if (res.ok) {
                return res.json()
            }

            throw new SystemError('error fetching events')
        })
        .catch(error => { throw new SystemError(error.message) })
}
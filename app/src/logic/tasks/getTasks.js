import { errors, validate } from 'com'

const { SystemError, NotFoundError } = errors

export default (userId) => {
    validate.id(userId, 'userId')

    return fetch(`${import.meta.env.VITE_API_URL}/tasks/get-tasks`, {
        method: 'GET',
        headers: {
            Authorization: `Bearer ${localStorage.token}`
        }
    })

        .then(res => {
            if (res.ok) {
                return res.json()
            }
            return []
        })
        .catch(error => { throw new SystemError(error.message) })
}
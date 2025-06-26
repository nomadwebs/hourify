import { validate, errors } from 'com'

const { SystemError } = errors

export default (userId) => {
    validate.id(userId, 'userId')


    return fetch(`${import.meta.env.VITE_API_URL}/users/resetCreatedUserPassword/${userId}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${localStorage.token}`
        },
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
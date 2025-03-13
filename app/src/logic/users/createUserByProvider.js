import { validate, errors } from 'com'

const { SystemError } = errors

export default (name, email, username) => {
    validate.name(name)
    validate.email(email)
    validate.username(username)


    return fetch(`${import.meta.env.VITE_API_URL}/users/createByProvider`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${localStorage.token}`
        },
        body: JSON.stringify({ name, email, username })
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
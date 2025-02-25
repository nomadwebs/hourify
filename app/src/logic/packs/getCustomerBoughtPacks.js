import { /* validate, */ errors, validate } from 'com'

const { SystemError } = errors

export default (userId) => {
    validate.id(userId, 'userId')

    //Logic and call to the api
    return fetch(`${import.meta.env.VITE_API_URL}/packs/get-cust-bought-packs/${userId}`, {
        method: 'GET',
        headers: {
            Authorization: `Bearer ${localStorage.token}`
        }
    })

        .then(res => {
            if (res.ok) {
                return res.json()
            }

            return res.json()
                .then(({ error, message }) => {
                    throw new errors[error](message)
                })
                .catch(error => {
                    throw new SystemError(error.message)
                })
        })
        .catch(error => {
            throw new SystemError(error.message)
        })
}
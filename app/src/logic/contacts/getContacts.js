import { errors, validate } from 'com'

const { SystemError, NotFoundError } = errors

export default () => {

    return fetch(`${import.meta.env.VITE_API_URL}/contacts/get-contacts`, {
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
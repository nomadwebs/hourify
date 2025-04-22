import { validate, errors } from 'com'

const { SystemError } = errors

export default (name, email, username, password, passwordRepeat) => {
    validate.name(name)
    validate.email(email)
    validate.username(username)
    validate.password(password)
    validate.passwordsMatch(password, passwordRepeat)


    return fetch(`${import.meta.env.VITE_API_URL}/users/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, username, password, 'password-repeat': passwordRepeat })
    })

        .then(async res => {
            const data = await res.json()

            if (res.ok) return data  // Devuelves { success, promoApplied, message }

            throw new errors.SystemError(data.message || 'Registration failed')
        })
        .catch(error => {
            throw new SystemError(error.message)
        })
    /* .catch(error => {
        throw new SystemError(error.message)
    })
    .then(res => {
        if (res.ok)
            return res.json()

        return res.json()
            .catch(error => {
                throw new SystemError(error.message)
            })
            .then(({ error, message }) => {
                throw new errors[error](message)
            })
    }) */
}
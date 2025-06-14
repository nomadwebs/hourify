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
            console.log('Server response:', data)


            if (data.success) {
                return data  // Devuelves { success, promoApplied, message }
            } else {
                if (data.error && errors[data.error]) {
                    throw new errors[data.error](data.message)
                } else {
                    throw new SystemError(data.message || 'Registration failed')
                }
            }
        })
}
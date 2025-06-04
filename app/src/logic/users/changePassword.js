import { validate, errors } from 'com'

const { SystemError } = errors

export default (oldPassword, newPassword, newPasswordRepeat) => {
    // Validaciones
    validate.password(oldPassword)
    validate.password(newPassword)
    validate.passwordsMatch(newPassword, newPasswordRepeat)

    /*   // El userId se obtiene automáticamente del token en el backend
      const userId = localStorage.userId */

    return fetch(`${import.meta.env.VITE_API_URL}/users/changePassword`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.token}`
        },
        body: JSON.stringify({
            oldPassword,
            newPassword,
            newPasswordRepeat
        })
    })
        .then(async res => {
            // Si la respuesta no es ok, intentamos parsear el error
            if (!res.ok) {
                const data = await res.json()
                console.log('Error response:', data)

                if (data.error && errors[data.error]) {
                    throw new errors[data.error](data.message)
                } else {
                    throw new SystemError(data.message || 'Failed to change password')
                }
            }

            // Si todo va bien, parseamos la respuesta exitosa
            const data = await res.json()
            console.log('Success response:', data)
            return data
        })
        .catch(error => {
            // Si es un error que ya hemos procesado, simplemente lo propagamos
            if (error instanceof Error) {
                throw error
            }
            // Si es un error desconocido (por ejemplo, un error de red), lo envolvemos
            throw new SystemError(error.message || 'An unexpected error occurred')
        })
}

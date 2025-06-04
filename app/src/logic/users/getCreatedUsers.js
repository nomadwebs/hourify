import { /* validate, */ errors } from 'com'

const { SystemError } = errors

export default () => {

    return fetch(`${import.meta.env.VITE_API_URL}/users/created-users`, {
        method: 'GET',
        headers: {
            Authorization: `Bearer ${localStorage.token}`
        },
    })

        .then(res => {
            if (res.ok) {
                return res.json()
            }

            // Si la respuesta no es válida, procesamos el error
            return res.json()
                .then(({ error, message }) => {
                    throw new errors[error](message);
                })
                .catch(error => {
                    throw new SystemError(error.message);
                });
        })
        .catch(error => {
            // Manejo de errores generales
            throw new SystemError(error.message);
        })
}
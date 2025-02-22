import { validate, errors } from 'com'

const { SystemError } = errors

export default (packId, amount, currency, method, paymentReference) => {
    validate.id(packId)
    validate.payedAmount(amount)
    validate.currency(currency)
    validate.method(method)
    validate.text(paymentReference, 'payment reference')

    return fetch(`${import.meta.env.VITE_API_URL}/payments/add-payment`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${localStorage.token}`
        },
        body: JSON.stringify({ packId, amount, currency, method, paymentReference })
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
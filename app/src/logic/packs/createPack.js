import { validate, errors } from 'com'

const { SystemError, SubscriptionError } = errors

export default (packName, packDescription, quantity, unit, expiringTime, price, currency) => {
    validate.packName(packName)
    validate.description(packDescription)
    validate.quantity(quantity)
    validate.units(unit)
    validate.expiring(expiringTime)
    validate.currency(currency)


    //Logic and call to the api
    return fetch(`${import.meta.env.VITE_API_URL}/packs/create-pack`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${localStorage.token}`
        },

        body: JSON.stringify({ packName, packDescription, quantity, unit, expiringTime, price, currency })
    })
        .catch(error => {
            throw new SystemError(error.message)
        })
        .then(res => {
            if (res.ok) return

            return res.json()
                .then(body => {
                    if (body.error === 'SubscriptionError') {
                        throw new SubscriptionError(body.message)
                    }
                    if (body.error && errors[body.error]) {
                        throw new errors[body.error](body.message)
                    }
                    throw new SystemError(body.message || 'Unknown error')
                })
        })
}


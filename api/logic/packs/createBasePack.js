import { BasePack, User } from "dat";

import { validate, errors } from "com";

const { SystemError, NotFoundError, SubscriptionError } = errors

export default (userId, packName, description, quantity, unit, expiringTime, price, currency) => {
    validate.id(userId, 'userId')
    validate.packName(packName)
    validate.description(description)
    validate.text(unit, 'unit')
    validate.text(currency, 'currency')
    validate.expiring(expiringTime)


    return (async () => {
        const user = await User.findById(userId)
        if (!user) throw new NotFoundError('user not found')

        if (user.plan === 'free') {
            const basePackCount = await BasePack.countDocuments({ user: userId })
            if (basePackCount >= 3) {
                throw new SubscriptionError(
                    'Free users cannot create more than 3 packs. \n' +
                    'Upgrade your plan by contacting us at hola@nomadwebs.com.')
            }
        }

        try {
            return await BasePack.create({
                user: userId,
                packName,
                description,
                quantity,
                unit,
                expiringTime,
                price,
                currency
            })
        } catch (error) {
            throw new SystemError(error.message)
        }
    })()
}
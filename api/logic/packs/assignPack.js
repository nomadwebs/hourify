import { Pack, User, Activity, Payment, BasePack } from 'dat'

import { validate, errors } from 'com'

import getBasePackDetails from '../packs/getBasePackDetails.js'

const { SystemError, NotFoundError } = errors

export default (userId, customerSearch, selectPack, description, payedAmount, paymentMethod, paymentReference, finalPrice = null) => {
    validate.id(userId, 'userId')
    validate.id(selectPack, 'packId')
    validate.description(description)
    validate.text(paymentMethod, 'paymentMethod')
    validate.text(paymentReference, 'payment reference')

    const descriptionProvided = description

    return (async () => {
        let providerUser, customerId, basePack

        try {
            providerUser = await User.findById(userId)

            if (providerUser.plan === 'free') {
                // Contar los packs actuales del proveedor
                const packCount = await Pack.countDocuments({ provider: userId, status: 'Active' })

                if (packCount >= 5) {
                    throw new Error(
                        'Free users cannot assign more than 5 packs. \n' +
                        'Upgrade your plan by contacting us at hola@nomadwebs.com.')
                }
            }

        } catch (error) {
            throw new SystemError(error.message)
        }
        if (!providerUser) {
            throw new NotFoundError('user not found')
        }

        try {
            customerId = await User.findOne({
                $or: [
                    { username: customerSearch },
                    { email: customerSearch }
                ]
            }).lean()
        } catch (error) {
            throw new SystemError(error.message)
        }
        if (!customerId) {
            throw new NotFoundError('Customer not found')
        }

        try {
            basePack = await BasePack.findById(selectPack).lean()
        } catch (error) { throw new SystemError(error.message) }

        if (!basePack) {
            throw new NotFoundError('Base pack not found')
        }


        try {
            const { description, quantity, unit, expiringTime, price, currency } = basePack
            const purchaseDate = new Date()
            const expiryDate = expiringTime === -1 ? new Date('9999-12-31') :
                new Date(new Date().setMonth(new Date().getMonth() + expiringTime))

            const status = (payedAmount > 0 ? 'Active' : 'Pending')

            //Find if user applyed promo price, if not, get default price
            let definitivePrice = 0
            if (price !== finalPrice && finalPrice !== null) {
                definitivePrice = finalPrice
            } else {
                definitivePrice = price
            }

            //First we're going to create the pack
            //Check if description of relationship pack is empty, if empty, we add the basePack default description
            const relationDescription = descriptionProvided === '' ? basePack.description : descriptionProvided
            const newPack = await Pack.create({
                refPack: selectPack,
                provider: userId,
                customer: customerId,
                description: relationDescription,
                originalQuantity: quantity,
                remainingQuantity: quantity,
                unit,
                price: definitivePrice,
                currency,
                purchaseDate,
                expiryDate,
                status
            })

            //Second step we are going to update provider user with new ownPack
            const updateProvider = await User.findByIdAndUpdate(userId,
                {
                    $push: {
                        ownPacks: newPack._id,
                    },
                    $addToSet: {
                        customers: customerId
                    }
                },
                { new: true }
            )

            //Tird step we ara going to update de customer user with adquiredPack
            const updateCustomer = await User.findByIdAndUpdate(customerId,
                { $push: { adquiredPacks: newPack._id } },
                { new: true }
            )

            //Forth step, create an entry in the History table
            const addActivity = await Activity.create({
                pack: newPack._id,
                date: new Date(),
                description: `Pack added: ${description}`,
                operation: 'add',
                quantity: quantity,
                remainingQuantity: quantity
            })

            //Fifth step, update payments
            let payedAmountNum = Number(payedAmount)
            if (payedAmountNum > 0) {
                const addPayment = await Payment.create({
                    pack: newPack._id,
                    amount: payedAmountNum,
                    currency: currency,
                    date: new Date(),
                    method: paymentMethod,
                    reference: paymentReference
                })
            }
            /* return {
                pack: newPack,
                updateProvider,
                updateCustomer,
                addActivity,
                addPayment,
            } */

        } catch (error) {
            throw new SystemError(error.message)
        }
    })()

}
import { Payment, Pack, User } from "dat";

import { validate, errors } from 'com';

const { SystemError, NotFoundError } = errors

export default (userId, packId, amount, currency, method, paymentReference) => {
    validate.id(packId, 'packId')
    validate.id(userId, 'userId')
    validate.currency(currency)
    validate.method(method)
    validate.text(paymentReference, 'payment reference')

    const floatAmount = parseFloat(amount)
    //if (!floatAmount || floatAmount <= 0) throw new ValidationError("Invalid payment amount");
    validate.number(floatAmount)

    return User.findById(userId).lean()
        .catch(error => { throw new SystemError(error.message) })
        .then(user => {
            if (!user) {
                throw new NotFoundError('user not found')
            }

            return Pack.findById(packId).lean()
                .catch(error => { throw new SystemError(error.message) })
                .then(pack => {
                    if (!pack) throw new NotFoundError('Pack not found')

                    return Payment.create({ pack: packId, amount: floatAmount, currency, method, date: new Date(), reference: paymentReference })
                        .catch(error => { throw new SystemError(error.message) })
                        .then((paymentAdded) => {
                            if (pack.status === 'Pending' && floatAmount > 0) {
                                return Pack.findByIdAndUpdate(packId, { status: 'Active' }).lean()
                                    .catch(error => { throw new SystemError(error.message) })
                                    .then(() => { })
                            }
                        })
                })
        })
}
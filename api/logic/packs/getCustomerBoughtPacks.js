import { User, Pack, Payment } from 'dat'
import { errors, validate } from 'com'
import { getUserDetails } from '../users/index.js';

const { SystemError, NotFoundError } = errors;

export default (userId) => {
    validate.id(userId, 'userId')

    return User.findById(userId).lean()
        .then(user => {
            if (!user) throw new NotFoundError('user not found')

            return Pack.find({ customer: userId }).lean()
        })
        .then(packs => {
            // Creamos un array de promesas para obtener los nombres de los clientes
            const packformatted = packs.map(pack =>
                getUserDetails(pack.provider.toString(), pack.provider.toString())
                    .then(provider => {
                        return Payment.find({ pack: pack._id }).lean()
                            .then(payments => {
                                const totalPayments = payments.reduce((sum, payment) => sum + (payment.amount || 0), 0)
                                const paymentMethods = [...new Set(payments.map(p => p.method || 'Unknown'))].join(', ')

                                let paymentStatus = ''
                                if (totalPayments === 0) paymentStatus = 'pending'
                                else if (totalPayments < pack.price) paymentStatus = 'partially payed'
                                else if (totalPayments === pack.price) paymentStatus = 'completed'
                                else if (totalPayments > pack.price) paymentStatus = 'payment exceeded'

                                pack.id = pack._id.toString()
                                delete pack._id

                                const providerName = provider.name
                                const providerEmail = provider.email

                                return {
                                    ...pack,
                                    providerName,
                                    providerEmail,
                                    totalPayments: `${totalPayments}`,
                                    paymentStatus,
                                    paymentMethods,
                                }
                            })
                    })
            )
            return Promise.all(packformatted)
        })

        .catch(error => {
            throw new SystemError(error.message)
        })
}
import { Pack } from 'dat'
import { validate, errors } from 'com'
import { ObjectId } from 'mongodb'

const { SystemError, NotFoundError } = errors

export default (providerId) => {
    validate.id(providerId, 'providerId')

    const now = new Date()
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)
    const startOfNextMonth = new Date(now.getFullYear(), now.getMonth() + 1, 1)

    return Pack.aggregate([
        {
            $match: {
                provider: new ObjectId(providerId),
                purchaseDate: {
                    $gte: startOfMonth,
                    $lt: startOfNextMonth
                }
            }
        },
        {
            $group: {
                _id: null,
                total: { $sum: "$price" }
            }
        }
    ]).exec()
        .catch(error => { throw new SystemError(error.message) })
        .then(result => {
            // If no packs found, return 0
            if (!result || result.length === 0) {
                return 0
            }

            return result[0].total
        })
} 
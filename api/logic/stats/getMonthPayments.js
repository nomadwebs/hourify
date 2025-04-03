import { Payment } from 'dat'
import { validate, errors } from 'com'
import { ObjectId } from 'mongodb'

const { SystemError, NotFoundError } = errors

export default (providerId) => {
    validate.id(providerId, 'providerId')

    const now = new Date()
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)
    const startOfNextMonth = new Date(now.getFullYear(), now.getMonth() + 1, 1)

    console.log('Searching payments between:', startOfMonth, 'and', startOfNextMonth)
    console.log('For provider:', providerId)

    return Payment.aggregate([
        {
            $match: {
                date: {
                    $gte: startOfMonth,
                    $lt: startOfNextMonth
                }
            }
        },
        {
            $lookup: {
                from: 'packs',
                localField: 'pack',
                foreignField: '_id',
                as: 'packInfo'
            }
        },
        {
            $unwind: {
                path: '$packInfo',
                preserveNullAndEmptyArrays: true
            }
        },
        {
            $match: {
                'packInfo.provider': new ObjectId(providerId)
            }
        },
        {
            $group: {
                _id: null,
                total: { $sum: "$amount" }
            }
        }
    ]).exec()
        .catch(error => {
            console.error('Aggregation error:', error)
            throw new SystemError(error.message)
        })
        .then(result => {
            console.log('Aggregation result:', result)
            // If no payments found, return 0
            if (!result || result.length === 0) {
                return 0
            }

            return result[0].total
        })
} 
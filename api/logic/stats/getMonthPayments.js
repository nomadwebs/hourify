import { Payment, Pack } from 'dat'
import { validate, errors } from 'com'
import { ObjectId } from 'mongodb'

const { SystemError } = errors

export default async function (userId) { //User is find as a provider id
    validate.id(userId, 'userId')

    const now = new Date()
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)
    const startOfNextMonth = new Date(now.getFullYear(), now.getMonth() + 1, 1)

    try {
        // Paso 1: obtener packs del proveedor vendidos este mes
        const packs = await Pack.find({
            provider: new ObjectId(userId),
            purchaseDate: {
                $gte: startOfMonth,
                $lt: startOfNextMonth
            }
        }, { _id: 1 }).lean()

        const packIds = packs.map(pack => pack._id.toString())
        //console.log('✅ packIds del proveedor:', packIds)

        if (packIds.length === 0) return 0

        // Paso 2: calcular payments de esos packs en el mismo rango de fechas
        const result = await Payment.aggregate([
            {
                $match: {
                    pack: { $in: packIds },
                    date: {
                        $gte: startOfMonth,
                        $lt: startOfNextMonth
                    }
                }
            },
            {
                $group: {
                    _id: null,
                    total: { $sum: "$amount" }
                }
            }
        ])

        //console.log('📦 resultado agregado:', result)

        return result.length === 0 ? 0 : result[0].total
    } catch (error) {
        throw new SystemError(error.message)
    }
}

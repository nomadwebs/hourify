import { Pack, Activity } from 'dat'
import { validate, errors } from 'com'
import { ObjectId } from 'mongodb'

const { SystemError } = errors

export default async (userId) => { //find as a providerId
    validate.id(userId, 'userId')

    const now = new Date()
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)
    const startOfNextMonth = new Date(now.getFullYear(), now.getMonth() + 1, 1)

    try {
        // Paso 1: obtener packs del proveedor vendidos este mes
        const packs = await Pack.find({
            provider: new ObjectId(userId),
            status: 'Active',
            unit: 'units',
            /* purchaseDate: {
                $gte: startOfMonth,
                $lt: startOfNextMonth
            } */
        }).select('_id').lean()

        const packIds = packs.map(pack => pack._id.toString())

        if (packIds.length === 0) {
            console.log('No hay packs vendidos este mes para este proveedor.')
            return 0
        }


        // Paso extra: mostrar las actividades que coinciden con los criterios
        const matchingActivities = await Activity.find({
            pack: { $in: packIds },
            operation: 'substract',
            date: {
                $gte: startOfMonth,
                $lt: startOfNextMonth
            }
        }).lean()

        console.log('📊 Actividades registradas este mes:', matchingActivities)

        // Paso 2: calcular actividades "substract" de esos packs en el mismo rango de fechas
        const result = await Activity.aggregate([
            {
                $match: {
                    pack: { $in: packIds },
                    operation: 'substract',
                    date: {
                        $gte: startOfMonth,
                        $lt: startOfNextMonth
                    }
                }
            },
            {
                $group: {
                    _id: null,
                    total: { $sum: "$quantity" }
                }
            }
        ]).exec()

        return result.length === 0 ? 0 : result[0].total
    } catch (error) {
        console.error('Error al calcular las sesiones trabajadas:', error)
        throw new SystemError(error.message)
    }
}
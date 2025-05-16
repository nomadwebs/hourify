import { User, Pack, Payment } from 'dat'
import { errors, validate } from 'com'

const { SystemError, NotFoundError } = errors

export default (userId) => {
    validate.id(userId, 'userId')

    return (async () => {
        let user

        // 1. Buscar el usuario proveedor
        try {
            user = await User.findById(userId).lean()
        } catch (error) {
            throw new SystemError(error.message)
        }

        // 2. Validaciones
        if (!user) throw new NotFoundError('User not found')
        if (!user.customers || user.customers.length === 0)
            throw new NotFoundError('Customers not found')

        // 3. Obtener datos básicos de los clientes
        let userCustomers
        try {
            userCustomers = await User.find(
                { _id: { $in: user.customers } },
                { _id: 1, name: 1, surname1: 1, email: 1 }
            ).lean()
        } catch (error) {
            throw new SystemError('Error loading customer data: ' + error.message)
        }

        try {
            // 🔄 Obtener todos los packs
            const packs = await Pack.find(
                { provider: userId, customer: { $in: user.customers } }
            ).lean()

            // 🔄 Obtener todos los pagos relacionados con estos packs
            const packIds = packs.map(pack => pack._id)
            const payments = await Payment.find({ pack: { $in: packIds } }).lean()

            // 🗺️ Agrupar pagos por ID de pack
            const paymentsMap = {}
            for (const payment of payments) {
                const packId = payment.pack.toString()
                if (!paymentsMap[packId]) paymentsMap[packId] = []
                paymentsMap[packId].push(payment)
            }

            // 🧮 Agrupar packs por cliente y añadir info de pagos
            const customerPackMap = {}
            for (const pack of packs) {
                const customerId = pack.customer.toString()
                const packId = pack._id.toString()

                const packPayments = paymentsMap[packId] || []
                const totalPaid = packPayments.reduce((acc, p) => acc + p.amount, 0)

                delete pack._id

                const packWithPayments = {
                    ...pack,
                    id: packId,
                    payments: packPayments,
                    totalPaid,
                    totalDue: pack.price - totalPaid
                }

                if (!customerPackMap[customerId]) customerPackMap[customerId] = []
                customerPackMap[customerId].push(packWithPayments)
            }

            // 📦 Armar la respuesta final
            const customersWithPacks = userCustomers.map(customer => {
                const customerId = customer._id.toString()
                return {
                    id: customerId,
                    name: customer.name,
                    surname1: customer.surname1,
                    email: customer.email,
                    packCount: (customerPackMap[customerId] || []).length,
                    packs: customerPackMap[customerId] || []
                }
            })

            return customersWithPacks
        } catch (error) {
            throw new SystemError('Error processing packs and payments: ' + error.message)
        }
    })()
}

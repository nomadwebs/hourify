import { User, Pack } from 'dat'
import { errors, validate } from 'com'
import { getUserName } from '../users/index.js';

const { SystemError, NotFoundError } = errors;

export default (userId) => {
    validate.id(userId, 'userId')

    return User.findById(userId).lean()
        .then(user => {
            if (!user) throw new NotFoundError('user not found')

            return Pack.find({ provider: userId }).lean()
                .then(packs => {
                    if (!packs || packs.length === 0) {
                        throw new NotFoundError('No Sold packs found ')
                    }

                    // Creamos un array de promesas para obtener los nombres de los clientes
                    const packformatted = packs.map(pack =>
                        getUserName(pack.customer.toString(), pack.customer.toString())
                            .then(customerName => ({
                                ...pack,
                                customerName,
                                id: pack._id.toString(),
                                delete: pack._id
                            }))
                    )

                    // Esperamos a que todas las promesas se resuelvan y devolvemos los resultados
                    return Promise.all(packformatted)
                })
        })

        .catch(error => {
            throw new SystemError(error.message)
        })
}
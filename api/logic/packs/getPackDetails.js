import { Pack, User } from 'dat'
import { errors, validate } from 'com'

const { SystemError, NotFoundError, OwnershipError } = errors

export default async (userId, selectPack) => {
    validate.id(userId, 'userId')
    validate.id(selectPack, 'packId')

    try {
        const user = await User.findById(userId).lean()
        if (!user) {
            throw new NotFoundError('user not found')
        }
    } catch (error) {
        throw error
    }

    try {
        // Busca el Pack por su ID
        const packInfo = await Pack.findById(selectPack).lean()

        // Si no se encuentra, lanza un error
        if (!packInfo) {
            throw new NotFoundError('The pack does not exist')
        }

        //Valida que sea el propietario del pack
        if (userId !== packInfo.provider.toString()) {
            throw new OwnershipError('Your user is not the owner of this pack')
        }

        // Devuelve la información encontrada
        return packInfo
    } catch (error) {
        // Si ocurre un error, lanza un SystemError
        throw error
    }
}

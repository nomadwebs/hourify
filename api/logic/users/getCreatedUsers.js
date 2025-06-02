import { User } from 'dat'
import { errors, validate } from 'com'

const { SystemError, NotFoundError } = errors

export default (userId) => {
    validate.id(userId, 'userId')

    return (async () => {
        let user

        // 1. Buscar el usuario creador
        try {
            user = await User.findById(userId).lean()
        } catch (error) {
            throw new SystemError(error.message)
        }

        // 2. Validaciones
        if (!user) throw new NotFoundError('User not found')

        // 3. Obtener usuarios creados por este usuario
        let createdUsers
        try {
            createdUsers = await User.find(
                { createdBy: userId },
                {
                    _id: 1,
                    email: 1,
                    plan: 1,
                    name: 1,
                    username: 1,
                    creationStatus: 1,
                    profileImage: 1,
                    createdDate: 1,
                    lastLogin: 1,
                    adquiredPacks: 1
                }
            ).lean()
        } catch (error) {
            throw new SystemError('Error loading created users data: ' + error.message)
        }

        if (!createdUsers || createdUsers.length === 0)
            throw new NotFoundError('No users found created by this user')

        // 4. Filtrar usuarios que no tengan packs adquiridos del creador
        const creatorOwnPacks = user.ownPacks || []
        const creatorOwnPackIds = creatorOwnPacks.map(pack => pack.toString())

        const filteredUsers = createdUsers.filter(createdUser => {
            const userAdquiredPacks = createdUser.adquiredPacks || []
            const userAdquiredPackIds = userAdquiredPacks.map(pack => pack.toString())

            // Si el creationStatus es false, mostrar siempre el usuario
            // para indicar que nunca se ha conectado
            if (createdUser.creationStatus === 'false') {
                return true
            }

            // Verificar si hay algún pack adquirido que coincida con los ownPacks del creador
            const hasAcquiredCreatorPack = userAdquiredPackIds.some(packId =>
                creatorOwnPackIds.includes(packId)
            )

            // Incluir solo usuarios que NO tengan packs adquiridos del creador
            return !hasAcquiredCreatorPack
        })

        // 5. Formatear la respuesta
        const formattedUsers = filteredUsers.map(user => {
            const userId = user._id.toString()
            return {
                id: userId,
                email: user.email,
                username: user.username,
                name: user.name,
                creationStatus: user.creationStatus,
                createdDate: user.createdDate,
                lastLogin: user.lastLogin
            }
        })

        return formattedUsers

    })()
}

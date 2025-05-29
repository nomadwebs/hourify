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
                    lastLogin: 1
                }
            ).lean()
        } catch (error) {
            throw new SystemError('Error loading created users data: ' + error.message)
        }

        if (!createdUsers || createdUsers.length === 0)
            throw new NotFoundError('No users found created by this user')

        // 4. Formatear la respuesta
        const formattedUsers = createdUsers.map(user => {
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

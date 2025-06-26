import logic from "../../../logic/index.js"
import { createFunctionalHandler } from '../../helpers/index.js'

export default createFunctionalHandler(async (req, res) => {
    const { userId } = req // Usuario actual autenticado
    const { targetUserId } = req.params // Usuario objetivo desde la URL

    // Opcional: Verificar que el usuario autenticado tenga permisos
    // Por ejemplo, que sea el creador del usuario objetivo
    // await logic.verifyUserPermissions(userId, targetUserId)

    await logic.resetCreatedUserPassword(userId, targetUserId)

    res.status(201).send()
})
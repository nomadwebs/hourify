import logic from '../../../logic/index.js'
import { createFunctionalHandler } from '../../helpers/index.js'

export default createFunctionalHandler(async (req, res) => {
    //const { userId, oldPassword, newPassword, newPasswordRepeat } = req.body

    const { userId, body: { oldPassword, newPassword, newPasswordRepeat } } = req

    const result = await logic.changePassword(userId, oldPassword, newPassword, newPasswordRepeat)

    // Si result es un error, lanzarlo para que lo maneje errorHandler
    if (result instanceof Error) {
        throw result
    }

    // Si todo va bien, devolver el resultado exitoso
    res.status(200).json(result)
})
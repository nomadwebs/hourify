import logic from '../../../logic/index.js'
import { createFunctionalHandler } from '../../helpers/index.js'

export default createFunctionalHandler(async (req, res) => {
    const { userId } = req

    try {
        const createdUsers = await logic.getCreatedUsers(userId)
        res.status(200).json(createdUsers)
    } catch (error) {
        console.error(error.message)
        throw error
    }
})
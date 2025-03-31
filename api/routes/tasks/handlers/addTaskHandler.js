import logic from '../../../logic/index.js'
import { createFunctionalHandler } from '../../helpers/index.js'

export default createFunctionalHandler(async (req, res) => {
    const { userId, body: { description, dueDate, priority, status, customerId, packId, notes } } = req

    await logic.addTask(userId, description, dueDate, priority, status, customerId, packId, notes)

    res.status(201).send()
})

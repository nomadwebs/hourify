import logic from '../../../logic/index.js';
import { createFunctionalHandler } from '../../helpers/index.js'

export default createFunctionalHandler((req, res) => {

    const { userId, params: { taskId }, body: { description, dueDate, customer, priority, status, notes } } = req

    return logic.updateTask(userId, taskId, description, dueDate, customer, priority, status, notes)
        .then(() => {
            res.status(201).send()
        })
})
import logic from '../../../logic/index.js'
import { createFunctionalHandler } from '../../helpers/index.js'

export default createFunctionalHandler(async (req, res) => {
    const { userId, body: { name, email, phone, contactType, notes } } = req

    await logic.createContact(userId, name, email, phone, contactType, notes)

    res.status(201).send()
})

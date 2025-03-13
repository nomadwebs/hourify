import logic from "../../../logic/index.js"
import { createFunctionalHandler } from '../../helpers/index.js'

export default createFunctionalHandler(async (req, res) => {
    const { name, email, username } = req.body
    const { userId } = req

    await logic.createUserByProvider(name, email, username, userId)

    res.status(201).send()
})
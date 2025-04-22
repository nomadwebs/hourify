import logic from "../../../logic/index.js"
import { createFunctionalHandler } from '../../helpers/index.js'

export default createFunctionalHandler(async (req, res) => {
    const { name, email, username, password, 'password-repeat': passwordRepeat } = req.body

    const result = await logic.registerUser(name, email, username, password, passwordRepeat)

    /* res.status(201).send() */
    res.status(201).json(result)
})
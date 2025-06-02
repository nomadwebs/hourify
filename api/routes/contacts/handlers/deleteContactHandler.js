import logic from "../../../logic/index.js";
import { createFunctionalHandler } from '../../helpers/index.js'

export default createFunctionalHandler((req, res) => {
    const { userId, params: { contactId } } = req

    return logic.deleteContact(userId, contactId)
        .then(() => {
            res.status(204).send()
        })
})
import logic from "../../../logic/index.js"
import { createFunctionalHandler } from '../../helpers/index.js'

export default createFunctionalHandler((req, res) => {
    const { userId, params: { targetUserId }, body: { imageUrl } } = req
    console.log('imageUrl: ', imageUrl)
    return logic.updateProfileImage(userId, targetUserId, imageUrl)
        .then(() => {
            res.status(201).send()
        })
}) 
import logic from '../../../logic/index.js';
import { createFunctionalHandler } from '../../helpers/index.js';

export default createFunctionalHandler(async (req, res) => {
    //const { targetUserId } = req.params
    const { userId } = req

    const packs = await logic.getCustomerBoughtPacks(userId)

    res.status(200).json(packs)
})
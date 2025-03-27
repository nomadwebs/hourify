import logic from '../../../logic/index.js';
import { createFunctionalHandler } from '../../helpers/index.js';

export default createFunctionalHandler(async (req, res) => {
    const { packId } = req.params
    const { userId } = req

    const getPackDetails = await logic.getPackDetails(userId, packId)

    res.status(200).json(getPackDetails)

})
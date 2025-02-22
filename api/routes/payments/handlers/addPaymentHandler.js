import logic from '../../../logic/index.js';
import { createFunctionalHandler } from '../../helpers/index.js';

export default createFunctionalHandler(async (req, res) => {
    const { userId, body: { packId, amount, currency, method, paymentReference } } = req

    await logic.addPayment(userId, packId, amount, currency, method, paymentReference)

    res.status(201).send()
})
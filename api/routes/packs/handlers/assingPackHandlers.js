import logic from "../../../logic/index.js";
import { createFunctionalHandler } from '../../helpers/index.js';

export default createFunctionalHandler(async (req, res) => {
    const { userId, body: { customerSearch, selectPack, description, payedAmount, paymentMethod, paymentReference } } = req

    await (logic.assignPack(userId, customerSearch, selectPack, description, payedAmount, paymentMethod, paymentReference))

    res.status(201).send()
})
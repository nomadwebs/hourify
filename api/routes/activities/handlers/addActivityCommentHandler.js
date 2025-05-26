import logic from "../../../logic/index.js";
import { createFunctionalHandler } from '../../helpers/index.js'

export default createFunctionalHandler(async (req, res) => {

    const { userId, body: { comment } } = req
    const { activityId } = req.params

    //const activities = await logic.addActivityComment(activityId, userId, comment)
    await logic.addActivityComment(activityId, userId, comment)

    //res.status(200).json(activities)
    res.status(201).json()
})

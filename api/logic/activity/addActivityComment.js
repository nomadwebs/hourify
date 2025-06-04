import { Activity, User } from 'dat'

import { validate, errors } from 'com'

const { SystemError, NotFoundError } = errors

export default async function addActivityComment(activityId, userId, comment) {
    // Validate activityId
    validate.id(activityId, 'activityId')
    validate.id(userId, 'userId')

    // Validate comment
    if (!comment || typeof comment !== 'string') throw new Error('Comment is required and must be a string')
    if (comment.length > 1000) throw new Error('Comment cannot be longer than 1000 characters')

    try {
        // Find the activity
        const activity = await Activity.findById(activityId)
        if (!activity) throw new NotFoundError('Activity not found')

        // Initialize comments array if it doesn't exist
        if (!activity.comments) {
            activity.comments = []
        }

        // Add the new comment
        activity.comments.push({
            commentDate: new Date(),
            userId,
            comment
        })

        // Save the activity with the new comment
        await activity.save()

        // Return the updated activity
        return activity
    } catch (error) {
        if (error instanceof NotFoundError) throw error
        throw new SystemError(error.message)
    }
} 
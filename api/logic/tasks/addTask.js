import { Task, User, Pack } from "dat"
import { validate, errors } from 'com'

const { SystemError, NotFoundError, ValidationError, OwnershipError } = errors

/**
 * Creates a new task and associates it with a user and optionally with a customer and pack
 * 
 * @param {string} userId - The ID of the user who owns the task
 * @param {string} description - Description of the task
 * @param {Date} dueDate - Optional due date for the task
 * @param {string} priority - Priority level: 'Low', 'Medium', 'High', 'Urgent'
 * @param {string} status - Status: 'Pending', 'In Progress', 'On Hold', 'Completed', 'Cancelled'
 * @param {string} customerId - Optional ID of the customer associated with the task
 * @param {string} relatedPackId - Optional ID of the pack related to the task
 * @param {string} notes - Optional additional notes about the task
 * @returns {Promise<Object>} - The created task
 */
export default (userId, description, dueDate, priority, status, customerId = null, relatedPackId = null, notes = null) => {
    // Validate required fields
    validate.id(userId, 'userId')
    validate.text(description, 'description')
    validate.taskPriority(priority)
    validate.taskStatus(status)

    // Validate optional fields if provided
    if (customerId) validate.id(customerId, 'customerId')
    if (relatedPackId) validate.id(relatedPackId, 'relatedPackId')
    if (notes) validate.text(notes, 'notes')

    // Parse and validate dueDate if provided
    let parsedDueDate = null
    if (dueDate) {
        if (dueDate instanceof Date) {
            parsedDueDate = dueDate
        } else if (typeof dueDate === 'string') {
            parsedDueDate = new Date(dueDate)
            if (isNaN(parsedDueDate.getTime())) {
                throw new ValidationError('invalid due date format')
            }
        } else {
            throw new ValidationError('invalid due date')
        }
    }

    // Start the promise chain by verifying the user exists
    return User.findById(userId).lean()
        .catch(error => { throw new SystemError(error.message) })
        .then(user => {
            if (!user) throw new NotFoundError('user not found')

            // If customerId provided, verify customer exists
            const customerPromise = customerId
                ? User.findById(customerId).lean()
                    .catch(error => { throw new SystemError(error.message) })
                    .then(customer => {
                        if (!customer) throw new NotFoundError('customer not found')
                        return customer
                    })
                : Promise.resolve(null)

            // If relatedPackId provided, verify pack exists and check ownership
            const packPromise = relatedPackId
                ? Pack.findById(relatedPackId).lean()
                    .catch(error => { throw new SystemError(error.message) })
                    .then(pack => {
                        if (!pack) throw new NotFoundError('pack not found')

                        // Verify pack ownership - user must own the pack
                        if (pack.userOwner.toString() !== userId.toString()) {
                            throw new OwnershipError('user does not own this pack')
                        }

                        return pack
                    })
                : Promise.resolve(null)

            // Wait for both checks to complete
            return Promise.all([customerPromise, packPromise])
                .then(() => {
                    // Create the task
                    return Task.create({
                        description,
                        dueDate: parsedDueDate,
                        userOwner: userId,
                        customer: customerId,
                        relatedPack: relatedPackId,
                        priority,
                        status,
                        notes,
                        createdDate: new Date(),
                        lastModified: new Date(),
                        completed: status === 'Completed',
                        completedDate: status === 'Completed' ? new Date() : null
                    })
                        .catch(error => { throw new SystemError(error.message) })
                })
        })
        .then(task => {
            // Return the created task
            return task
        })
} 
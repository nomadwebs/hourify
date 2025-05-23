import { Task, User, Pack } from "dat"
import { validate, errors } from 'com'

const { SystemError, NotFoundError, ValidationError, OwnershipError } = errors

export default (userId, description, dueDate, priority, status, customerId = null, packId = null, notes = null) => {
    // Validate required fields
    validate.id(userId, 'userId')
    validate.text(description, 'description')
    validate.taskPriority(priority)
    validate.taskStatus(status)

    // Validate optional fields if provided
    if (customerId) validate.id(customerId, 'customerId')
    if (packId) validate.id(packId, 'packId')
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

            // If packId provided, verify pack exists and check ownership
            const packPromise = packId
                ? Pack.findById(packId).lean()
                    .catch(error => { throw new SystemError(error.message) })
                    .then(pack => {
                        if (!pack) throw new NotFoundError('pack not found')

                        // Verify pack ownership - user must own the pack
                        if (pack.provider.toString() !== userId.toString()) {
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
                        relatedPack: packId,
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
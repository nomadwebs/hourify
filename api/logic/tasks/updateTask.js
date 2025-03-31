import { Task, User } from "dat";

import { validate, errors } from 'com'

const { SystemError, NotFoundError, OwnershipError } = errors

let completed = false
let completedDate = null
const lastModified = new Date()

export default (userId, taskId, description, dueDate, customer = null, priority, status, notes) => {

    console.log('===== Task Update Parameters LOGIC =====')
    console.log('taskId     : ', taskId)
    console.log('userId     : ', userId)
    console.log('description: ', description)
    console.log('dueDate    : ', dueDate)
    console.log('customer   : ', customer)
    console.log('priority   : ', priority)
    console.log('status     : ', status)
    console.log('notes      : ', notes)
    console.log('================================')

    validate.id(userId, 'userId')
    validate.id(taskId, 'taskId')
    validate.description(description)
    validate.taskPriority(priority)
    validate.taskStatus(status)
    if (notes) validate.text(notes, 'notes')
    if (dueDate) validate.date(new Date(dueDate))
    if (customer) validate.id(customer)




    return User.findById(userId)
        .catch(error => { throw new SystemError(error.message) })
        .then(user => {
            if (!user) {
                throw new NotFoundError('user not found')
            }

            return Task.findById(taskId)
                .catch(error => { throw new SystemError(error.message) })
                .then(task => {
                    if (!task) {
                        throw new NotFoundError('Task not found')
                    }

                    if (task.userOwner.toString() !== userId) {
                        throw new OwnershipError('Your user is not the owner of this task')
                    }

                    //Check final status
                    if (status === 'Completed') {
                        completed = true
                        completedDate = new Date()
                    } else {
                        completed = false
                        completedDate = null
                    }

                    //Check notes field
                    console.log('notes:', notes)
                    if (notes === '' || notes === undefined) notes = null

                    return Task.findByIdAndUpdate(taskId, { description, dueDate, customer, completed, completedDate, priority, status, notes, lastModified }, { new: true, runValidators: true })
                        .catch(error => {
                            throw new SystemError(error.message)
                        })
                        .then(() => { })
                })
        })
}


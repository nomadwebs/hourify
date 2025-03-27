import { Task, User } from "dat"
import { validate, errors } from 'com'

const { SystemError, NotFoundError } = errors

export default (userId, taskId) => {
    validate.id(taskId, 'taskId')
    validate.id(userId, 'userId')

    return User.findById(userId).lean()
        .catch(error => { throw new SystemError(error.message) })
        .then(user => {
            if (!user) { throw new NotFoundError('user not found') }

            return Task.findById(taskId).lean()
                .catch(error => { throw new SystemError(error.message) })
                .then(task => {
                    if (!task) { throw new NotFoundError('task not found') }

                    return Task.findByIdAndDelete(taskId)
                        .catch(error => { throw new SystemError(error.message) })
                        .then(() => { })
                })
        })
}

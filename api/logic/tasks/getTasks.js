import { Task, User } from 'dat'
import { errors, validate } from 'com'

const { SystemError, NotFoundError } = errors

export default (userId) => {
    validate.id(userId, 'userId')

    return User.findById(userId).lean()
        .catch(error => { throw new SystemError(error.message) })
        .then(user => {
            if (!user) throw new NotFoundError('user not found')

            return Task.find({ userOwner: userId }).lean()
                .then(tasks => {
                    if (!tasks || tasks.length === 0)
                        throw new NotFoundError('no tasks found')

                    tasks.forEach(task => {
                        task.id = task._id.toString()
                        delete task._id
                    })

                    return tasks
                })
        })
}
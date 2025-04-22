import { BasePack, User } from "dat";

import { validate, errors } from 'com'

const { SystemError, NotFoundError, OwnershipError } = errors

export default (userId, basePackId) => {
    validate.id(basePackId, 'basePackId')
    validate.id(userId, 'userId')

    let archived = false

    return User.findById(userId)
        .catch(error => { throw new SystemError(error.message) })
        .then(user => {
            if (!user) {
                throw new NotFoundError('user not found')
            }

            return BasePack.findById(basePackId)
                .catch(error => { throw new SystemError(error.message) })
                .then(basepack => {
                    if (!basepack) {
                        throw new NotFoundError('Pack not found')
                    }

                    if (basepack.user.toString() !== userId) {
                        throw new OwnershipError('Your user is not the owner of this pack')
                    }

                    if (basepack.archived === false) {
                        archived = true
                    } else {
                        archived = false
                    }

                    return BasePack.findByIdAndUpdate(basePackId, { archived }, { new: true, runValidators: true })
                        .catch(error => {
                            throw new SystemError(error.message)
                        })
                        .then(() => { })
                })
        })
}

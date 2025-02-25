import { User, Pack } from 'dat'
import { errors, validate } from 'com'

const { SystemError, NotFoundError } = errors;

export default (userId) => {
    validate.id(userId, 'userId')

    return User.findById(userId).lean()
        .then(user => {
            if (!user) throw new NotFoundError('user not found')

            return Pack.find({ provider: userId }).lean()
                .then(packs => {
                    if (!packs || packs.length === 0) {
                        throw new NotFoundError('No Sold packs found ')
                    }
                    packs.forEach(pack => {
                        pack.id = pack._id.toString()
                        delete pack._id
                    })

                    return packs
                })
        })

        .catch(error => {
            throw new SystemError(error.message)
        })
}
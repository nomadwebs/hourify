import { User } from 'dat'
import { validate, errors } from 'com'

const { SystemError } = errors

export default (userId, targetUserId, imageUrl) => {
    validate.id(userId)
    validate.id(targetUserId)

    return (async () => {
        try {
            const user = await User.findById(userId)
            if (!user) throw new SystemError('User not found')

            user.profileImage = imageUrl
            await user.save()

            return {
                success: true,
                message: 'Profile image updated successfully'
            }

        } catch (error) {
            if (error instanceof SystemError) {
                return {
                    success: false,
                    error: 'SystemError',
                    message: error.message
                }
            } else {
                return {
                    success: false,
                    error: 'SystemError',
                    message: 'Failed to update profile image'
                }
            }
        }
    })()
} 
import bcrypt from 'bcryptjs'

import { User } from 'dat'

import { validate, errors } from 'com'

const { SystemError } = errors

export default (userId, oldPassword, newPassword, newPasswordRepeat) => {
    validate.id(userId, 'userId')
    validate.password(newPassword)
    validate.password(oldPassword)
    validate.passwordsMatch(newPassword, newPasswordRepeat)



    return (async () => {
        try {
            const user = await User.findById(userId)
            if (!user) throw new SystemError('User not found')

            const isMatch = await bcrypt.compare(oldPassword, user.password)
            if (!isMatch) throw new SystemError('Old password is incorrect')

            const hashedNewPassword = await bcrypt.hash(newPassword, 10)

            await User.findByIdAndUpdate(userId, { password: hashedNewPassword })

            const result = {
                success: true,
                message: 'Password updated sccessfully'
            }
            return result

            /*  try {
                 //send confirmation email
                 emailRegisterWelcome(email, name, username)
             } catch (error) {
                 throw new SystemError(error.message)
             } */

        } catch (error) {
            return error
        }
    })()
}
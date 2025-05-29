import bcrypt from 'bcryptjs'
import { User } from 'dat'
import { validate, errors } from 'com'

const { SystemError, CredentialsError } = errors

export default (validationString, password) => {
    //validate.username(username)
    validate.password(password)
    validate.usernameOrEmail(validationString)

    return (async () => {
        let user

        try {
            //29/04/2025 - Find user by username or email 
            user = await User.findOne({
                $or: [{ username: validationString }, { email: validationString }]
            })
        } catch (error) {
            throw new SystemError(error.message)
        }

        if (!user) throw new CredentialsError('user not found')

        let match
        try {
            match = await bcrypt.compare(password, user.password)
        } catch (error) {
            throw new SystemError(error.message)
        }

        if (!match) throw new CredentialsError('incorrect password')

        try {
            // Actualizar o crear el campo lastLogin con la fecha actual
            user.lastLogin = new Date()

            //Revisa si es un usuario creado por otro y si es la primera vez que accede
            if (user.creationStatus === 'false' && user.createdBy) {
                user.creationStatus = 'true'
            }
            await user.save()
        } catch (error) {
            throw new SystemError('Error updating lastLogin: ' + error.message)
        }

        return {
            id: user._id.toString(),
            role: user.role
        }
    })()
}

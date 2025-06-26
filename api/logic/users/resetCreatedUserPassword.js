import bcrypt from 'bcryptjs'

import { User } from 'dat'

import { validate, errors } from 'com'

import { emailPasswordReset } from '../emailing/index.js'

const { SystemError, NotFoundError, AuthorizationError } = errors

// Function to generate a random password
const generateRandomPassword = (length = 12) => {
    const charset = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let password = '';
    for (let i = 0; i < length; i++) {
        const randomIndex = Math.floor(Math.random() * charset.length);
        password += charset.charAt(randomIndex);
    }
    return password;
}

export default async function resetCreatedUserPassword(userId, targetUserId) {
    // Validate input
    validate.id(targetUserId, 'targetUserId')
    validate.id(userId, 'userId')

    // Find the user by ID
    let user
    try {
        user = await User.findById(targetUserId).lean()
        if (!user) throw new NotFoundError('User not found')
    } catch (error) {
        throw new SystemError('Error finding user: ' + error.message)
    }

    // Validate that the authenticated user is the creator of the target user
    if (user.createdBy.toString() !== userId.toString()) {
        throw new AuthorizationError('You are not authorized to reset this user\'s password. Only the creator can reset the password.')
    }

    // Generate a new random password
    const newPassword = generateRandomPassword(6)
    console.log('Generated new password for user:', user.email, newPassword)

    // Hash the new password
    let hash
    try {
        hash = await bcrypt.hash(newPassword, 10)
    } catch (error) {
        throw new SystemError('Error hashing password: ' + error.message)
    }

    // Update the user's password in the database
    try {
        await User.findByIdAndUpdate(targetUserId, { password: hash })
    } catch (error) {
        throw new SystemError('Error updating password: ' + error.message)
    }

    // Send password reset email asynchronously
    emailPasswordReset(user.email, user.name, user.username, newPassword).catch(error => {
        console.error('Failed to send password reset email:', error)
    })

    // Return success response without sensitive information
    return {
        success: true,
        message: 'Password has been reset successfully',
        email: user.email,
        username: user.username
    }
} 
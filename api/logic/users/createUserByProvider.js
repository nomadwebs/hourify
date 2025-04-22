import bcrypt from 'bcryptjs'

import { User } from 'dat'

import { validate, errors } from 'com'

import { emailRegisterByProviderWelcome } from '../emailing/index.js'

const { DuplicityError, SystemError, NotFoundError } = errors

const assignRandomProfileImage = () => {
    const imageNumber = Math.floor(Math.random() * 12) + 1; //from 1 to 12
    return `/images/profile/profile${imageNumber}.jpeg`;
};

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

export default async function createUserByProvider(name, email, username, createdBy) {
    // Validate input
    validate.name(name)
    validate.email(email)
    validate.username(username)
    validate.id(createdBy, 'userId')

    const createdDate = new Date()

    // Find the user who is creating the new user
    let provider
    try {
        provider = await User.findById(createdBy).lean()
        if (!provider) throw new NotFoundError('User not found')
    } catch (error) {
        throw new SystemError('Error finding provider: ' + error.message)
    }

    // Generate a random password
    const password = generateRandomPassword(6)
    console.log('Generated password for new user:', password)

    let hash
    try {
        hash = await bcrypt.hash(password, 10)
    } catch (error) {
        throw new SystemError('Error hashing password: ' + error.message)
    }

    try {
        const newUser = await User.create({
            name,
            email,
            username,
            password: hash,
            plan: 'free',
            role: 'standard',
            creationStatus: false,
            profileImage: assignRandomProfileImage(),
            createdBy,
            planExpiryDate: null,
            dni: null,
            surname1: null,
            surname2: null,
            biography: null,
            country: null,
            province: null,
            city: null,
            postalCode: null,
            street: null,
            street2: null,
            number: null,
            flat: null,
            legalName: null,
            website: null,
            customers: [],
            ownPacks: [],
            adquiredPacks: [],
            createdDate,
        })

        // Send welcome email asynchronously
        emailRegisterByProviderWelcome(email, name, username, password, provider.name, provider.email).catch(error => {
            console.error('Failed to send welcome email:', error)
        })

        // Return user data without sensitive information
        const { password: _, ...userWithoutPassword } = newUser.toObject()
        return userWithoutPassword

    } catch (error) {
        if (error.code === 11000) {
            throw new DuplicityError('A user with this email or username already exists')
        }
        throw new SystemError('Error creating user: ' + error.message)
    }
}
import bcrypt from 'bcryptjs'

import { User } from 'dat'

import { validate, errors } from 'com'

import { emailRegisterWelcome } from '../emailing/index.js'

const { DuplicityError, SystemError } = errors

const PROMO_START_DATE = new Date('2025-04-12T00:00:00Z')
const PROMO_END_DATE = new Date('2025-04-20T23:59:59Z')
const PROMO_MAX_USERS = 30
const now = new Date()

const assignRandomProfileImage = () => {
    const imageNumber = Math.floor(Math.random() * 12) + 1; //from 1 to 12
    return `/images/profile/profile${imageNumber}.jpeg`;
};

export default (name, email, username, password, passwordRepeat) => {
    validate.name(name)
    validate.email(email)
    validate.username(username)
    validate.password(password)
    validate.passwordsMatch(password, passwordRepeat)


    const dni = '', surname1 = '',
        surname2 = '', biography = '', country = '', province = '', city = '',
        postalCode = '', street = '', street2 = '', number = '', flat = '',
        legalName = '', website = '', createdDate = new Date()

    const customers = [], ownPacks = [], adquiredPacks = []


    return (async () => {
        let hash

        const isInPromoPeriod = now >= PROMO_START_DATE && now <= PROMO_END_DATE

        //In the register moment all users will be free
        let plan = 'free'
        let creationStatus = 'true'
        let role = 'standard'
        let planExpiryDate = ''
        let reason = ''
        let promoApplied = false

        if (isInPromoPeriod) {
            try {
                const usersPromoCount = await User.countDocuments(
                    {
                        plan: 'pro',
                        reason: 'earlyAdopterPromo',
                        createdDate: { $gte: PROMO_START_DATE, $lte: PROMO_END_DATE }
                    })
                if (usersPromoCount < PROMO_MAX_USERS) {
                    plan = 'pro'
                    planExpiryDate = new Date('9999-12-31')
                    reason = 'earlyAdopterPromo'
                    promoApplied = true
                }
            } catch (error) {
                throw new SystemError(error.message)
            }
        }

        try {
            hash = await bcrypt.hash(password, 10)
        } catch (error) {
            throw new SystemError(error.message)
        }

        try {
            await User.create({
                name,
                email,
                username,
                password: hash,
                plan,
                reason,
                planExpiryDate: planExpiryDate || null,
                role,
                dni: dni || null,
                surname1: surname1 || null,
                surname2: surname2 || null,
                biography: biography || null,
                country: country || null,
                province: province || null,
                city: city || null,
                postalCode: postalCode || null,
                street: street || null,
                street2: street2 || null,
                number: number || null,
                flat: flat || null,
                legalName: legalName || null,
                website: website || null,
                creationStatus,
                customers,
                ownPacks,
                adquiredPacks,
                profileImage: assignRandomProfileImage(), //Create random profile image
                createdDate,
            })

        } catch (error) {
            if (error.code === 11000) throw new DuplicityError('User already exists')
            throw new SystemError(error.message)
        }

        try {
            //send confirmation email
            emailRegisterWelcome(email, name, username)
        } catch (error) {
            throw new SystemError(error.message)
        }

        return {
            success: true,
            promoApplied,
            message: promoApplied
                ? '¡Felicidades! Has conseguido acceso vitalicio al plan Pro como early adopter 🚀'
                : 'Usuario registrado correctamente.'
        }

    })()
}
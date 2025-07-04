import errors from './errors.js'
const { ValidationError } = errors

const validateName = name => {
    if (typeof name !== 'string' || name === '') throw new ValidationError('invalid name')
    if (name.length < 2)
        throw new ValidationError('invalid name length')
}

const validatePackName = name => {
    if (typeof name !== 'string') throw new ValidationError('invalid pack name')
    if (name === '') throw new ValidationError('pack name is required')
    if (name.length < 5 || name.length > 50)
        throw new ValidationError('pack name should have more than 5 chars and less than 50')
}

const validateDescription = description => {
    if (typeof description !== 'string') throw new ValidationError('Invalid description: the value must be a string.')
    if (description.length > 255) {
        throw new ValidationError('Invalid description length: maximum allowed is 255 characters.');
    }
}

const validateBio = bio => {
    if (typeof bio !== 'string') throw new ValidationError('Invalid biography')
    if (bio.length > 1000) {
        throw new ValidationError('Biography max length exceded, max 1000 chars.');
    }
}

const validateDate = date => {
    if (!(date instanceof Date)) {
        throw new ValidationError('Invalid date: the value must be a valid Date object.');
    }
}

const validateInteger = num => {
    if (!Number.isInteger(num)) {
        throw new ValidationError('Units provided should be an integer')
    }
}

const validateNumber = num => {
    if (typeof num !== 'number' || !Number.isFinite(num)) {
        throw new ValidationError('Value provided should be a valid number')
    }
}

const validateEmail = email => {
    if (typeof email !== 'string') throw new ValidationError('invalid email')
    if (email.length > 254) throw new ValidationError('email is too long')
    if (!/^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i.test(email))
        throw new ValidationError('invalid email')
}

const validatePhone = phone => {
    if (typeof phone !== 'string') throw new ValidationError('invalid phone number')
    if (phone.length > 20) throw new ValidationError('phone number is too long')
    // Permite números internacionales (+34...), paréntesis, espacios y guiones. Mínimo 8 dígitos
    if (!/^\+?[\d\s\-()]{8,20}$/.test(phone))
        throw new ValidationError('invalid phone number')
}

const validateUsername = username => {
    if (typeof username !== 'string') throw new ValidationError('invalid username')
    if (username.length < 5 || username.length > 25)
        throw new ValidationError('Username should be between 4 to 25 chars')
}

const validateUsernameOrEmail = input => {
    if (typeof input !== 'string') throw new ValidationError('input must be a string')

    const emailRegex = /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i
    const isEmail = emailRegex.test(input)

    if (isEmail) {
        if (input.length > 254) throw new ValidationError('email is too long')
        return
    }

    // If it's not an email, treat it as username
    if (input.length < 5 || input.length > 25)
        throw new ValidationError('username must be between 5 and 25 characters')
}

const validateUrl = url => {
    if (typeof url !== 'string') throw new ValidationError('invalid url')
    if (url.length > 254) throw new ValidationError('url is too long')
    if (!/^(https?:\/\/)?(www\.)?([a-zA-Z0-9-]+\.)+[a-zA-Z]{2,6}(\/[^\s]*)?$/i.test(url))
        throw new ValidationError('invalid url')
}


const validatePassword = password => {
    if (typeof password !== 'string') throw new ValidationError('invalid password')
    if (password.length < 4)
        throw new ValidationError('invalid password length')
}

const validateCurrency = currency => {
    if (typeof currency !== 'string' || currency === '') throw new ValidationError('invalid currency')
    if (currency.length !== 3)
        throw new ValidationError('currency should have 3 characters')
}

const validateMethod = method => {
    if (typeof method !== 'string' || method === '') throw new ValidationError('invalid method')
}

const validatePasswordsMatch = (password, passwordRepeat) => {
    if (typeof passwordRepeat !== 'string') throw new ValidationError('invalid password repeat')
    if (password !== passwordRepeat)
        throw new ValidationError('passwords do not match')
}

const validateImage = image => {
    if (typeof image !== 'string') throw new ValidationError('invalid image')
}

const validateText = (text, explain = 'text') => {
    if (typeof text !== 'string') throw new ValidationError(`invalid text ${explain}`)
}

const validateGenericField = (text, maxLength, explain = 'text') => {
    if (typeof text !== 'string') throw new ValidationError(`invalid ${explain}`)
    if (text.length > maxLength) throw new ValidationError(`invalid ${explain} length`)
}

const validateUnit = (text) => {
    if (typeof text !== 'string') throw new ValidationError('invalid unit')
    if (text !== 'hours' && text !== 'units') throw new ValidationError('units shoud be "hours" or "units"')
}

const validatequantity = (text) => {
    if (typeof text !== 'string') throw new ValidationError('invalid quantity')
}
const validatePayedAmount = (payed) => {
    if (typeof payed !== 'string') throw new ValidationError('invalid payed amount')
    if (payed.length > 10) { throw new ValidationError('payments cannot be grater than 9999999.99') }
}

const validatePromoAmount = (promoPayed) => {
    console.log('en el validate tenemos: ', typeof promoPayed)
    if (typeof promoPayed !== 'string') throw new ValidationError('invalid promo amount')
    if (promoPayed.length > 10) { throw new ValidationError('promo payments cannot be grater than 9999999.99') }
}

const validateId = (id, explain) => {
    if (typeof id !== 'string') throw new ValidationError(`invalid ${explain}`)
    if (id.length !== 24) throw new ValidationError(`invalid ${explain} length`)
}

const validateCallback = callback => {
    if (typeof callback !== 'function') throw new ValidationError('invalid callback')
}

const validateDni = dni => {
    if (typeof dni !== 'string') throw new ValidationError('invalid dni')
    if (dni.length > 9) throw new ValidationError('dni is too long')
    if (!/^[0-9]{8}[A-Z]$/i.test(dni))
        throw new ValidationError('invalid DNI')
}

const validateExpiringTime = expiringTime => {
    if (typeof expiringTime !== 'string') throw new ValidationError('invalid expiring time')
    const number = Number(expiringTime)
    if (expiringTime === 0) { throw new ValidationError('you must add an expiring time') }
    if (expiringTime < -1 || (expiringTime !== 0 && expiringTime > 12)) { throw new ValidationError('Expiring time must be between 1 to 12 months.') }
}

const validateStatus = status => {
    if (typeof status !== 'string') throw new ValidationError('invalid status')
    const validStatuses = ['Pending', 'Active', 'Expired', 'Finished']
    if (validStatuses.includes(status) === false) { throw new ValidationError('Invalid provided status') }
}

const validatePaymentMethod = method => {
    if (typeof method !== 'string') throw new ValidationError('invalid payment method')
    const validPaymentsMethod = ['card', 'bankTransfer', 'paypal', 'stripe', 'cash', 'others']
    if (validPaymentsMethod.includes(method) === false) { throw new ValidationError('Invalid provided payment method') }
}

const validateTimeFormat = time => {
    if (typeof time !== 'string') throw new ValidationError('invalid time, must be a string')
    if (!/^[-+]?([0-9]{2}):([0-5][0-9]):([0-5][0-9])$/i.test(time))
        throw new ValidationError('invalid time format (+/-)hh:mm:ss')
}

const validateTaskStatus = status => {
    if (typeof status !== 'string') throw new ValidationError('invalid status')
    const validStatuses = ['Pending', 'In Progress', 'On Hold', 'Completed', 'Cancelled']
    if (!validStatuses.includes(status)) throw new ValidationError('Invalid status value')
}

const validateTaskPriority = priority => {
    if (typeof priority !== 'string') throw new ValidationError('invalid priority')
    const validPriorities = ['Low', 'Medium', 'High', 'Urgent']
    if (!validPriorities.includes(priority)) throw new ValidationError('Invalid priority value')
}

const validateNotes = notes => {
    if (typeof notes !== 'string') throw new ValidationError('invalid notes')
    if (notes.length > 255) throw new ValidationError('notes is too long, max 255 characters')
}

const validateAttendees = attendees => {
    if (!Array.isArray(attendees)) throw new ValidationError('attendees must be an array')
    //TODO: Validate attendees id
    /* for (const attendee of attendees) {
        if (!Types.ObjectId.isValid(attendee)) {
            throw new ValidationError(`Invalid attendee ID: ${attendee}`)
        }
    } */
}


const validate = {
    name: validateName,
    packName: validatePackName,
    description: validateDescription,
    email: validateEmail,
    username: validateUsername,
    usernameOrEmail: validateUsernameOrEmail,
    password: validatePassword,
    passwordsMatch: validatePasswordsMatch,
    image: validateImage,
    text: validateText,
    id: validateId,
    callback: validateCallback,
    integerNum: validateInteger,
    number: validateNumber,
    date: validateDate,
    currency: validateCurrency,
    method: validateMethod,
    units: validateUnit,
    quantity: validatequantity,
    dni: validateDni,
    bio: validateBio,
    generic: validateGenericField,
    url: validateUrl,
    expiring: validateExpiringTime,
    status: validateStatus,
    payedAmount: validatePayedAmount,
    promoAmount: validatePromoAmount,
    paymentMethod: validatePaymentMethod,
    timeFormat: validateTimeFormat,
    taskStatus: validateTaskStatus,
    taskPriority: validateTaskPriority,
    attendees: validateAttendees,
    phone: validatePhone,
    notes: validateNotes
}

export default validate
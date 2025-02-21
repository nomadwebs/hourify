import emailRegisterWelcome from './emailRegisterWelcome.js'
import { errors } from 'com'

const { SystemError } = errors

// Parámetros para probar la función
const email = "fsangil@outlook.com"
const name = "John Doe"
const username = "johndoe"



try {
    //send confirmation email
    emailRegisterWelcome(email, name, username)
} catch (error) {
    throw new SystemError(error.message)
}

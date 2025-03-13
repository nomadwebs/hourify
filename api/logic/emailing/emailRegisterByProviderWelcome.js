import { sendEmail } from "./index.js"
import { validate } from "com"
import 'dotenv/config'

//Confirmation register email
const emailRegisterByProviderWelcome = (to, name, username, password, providerName, providerEmail) => {
    validate.email(to)
    validate.name(name)
    validate.username(username)
    validate.name(providerName)
    validate.email(providerEmail)

    const loginLink = process.env.MAIN_URL
    console.log(loginLink)

    const subject = 'Welcome to Hourify Time Tracking'
    const text = `Hello ${name},
This is your confirmation email. We just want to confirm that a new account has been created for you by ${providerName}. You can log in using the following credentials:
Username: ${username}
Password: ${password}
You can also contact your provider ${providerName} at ${providerEmail} if you have any questions or need assistance.
Please change your password after logging in for the first time to ensure your account's security.
If you have problems logging in, contact us on hola@nomadwebs.com`
    const html = `
        <p>Hello ${name}!!</p>
        <p>This is your confirmation email. We just want to confirm that a new account has been created for you by ${providerName}. You can log in using the following credentials:</p>
        <p>Username: ${username}</p>
        <p>Password: ${password}</p>
        <p>You can also contact your provider ${providerName} at ${providerEmail} if you have any questions or need assistance.</p>
        <p>Please change your password after logging in for the first time to ensure your account's security.</p>
        <br>
        <p>If you have problems login in, contact us on hola@nomadwebs.com</p>
    `

    return sendEmail(to, subject, text, html)
        .then((info) => {
            return info // Retornar para permitir manejar la promesa en otro lugar si es necesario
        })
        .catch((error) => {
            console.error('Error sending welcome email:', error.message)
            throw error
        })
}
export default emailRegisterByProviderWelcome
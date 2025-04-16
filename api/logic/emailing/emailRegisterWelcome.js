import { sendEmail } from "./index.js"
import { validate } from "com"
import 'dotenv/config'

//Confirmation register email
const emailRegisterWelcome = (to, name, username) => {
    validate.email(to)
    validate.name(name)
    validate.username(username)

    const loginLink = 'https://hourify360.com'

    const subject = 'Welcome to Hourify'
    const text = `Hello ${name}, this is your confirmation email`
    const html = `
        <p>Hello ${name}!!</p>
        <p>Your username is: ${username}</p>
        <p>This is your confirmation email. We just want to confirm you that your new account has been created correctly and you can get in just <a href='${loginLink}/login'>clicking here</a> or visiting ${loginLink}/login</p>
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
export default emailRegisterWelcome
import { sendEmail } from "./index.js"
import { validate } from "com"
import 'dotenv/config'

//Password reset email
const emailPasswordReset = (to, name, username, newPassword) => {
    validate.email(to)
    validate.name(name)
    validate.username(username)

    const loginLink = 'https://app.hourify360.com'

    const subject = 'Your Password Has Been Reset - Hourify'
    const text = `Hello ${name},
Your password has been reset successfully. Here are your new login credentials:
Username: ${username}
New Password: ${newPassword}
You can login at ${loginLink} using these credentials.
For security reasons, we strongly recommend that you change this password after logging in.
If you did not request this password reset, please contact us immediately at hola@nomadwebs.com`
    const html = `
        <p>Hello ${name}!</p>
        <p>Your password has been reset successfully. Here are your new login credentials:</p>
        <p><strong>Username:</strong> ${username}</p>
        <p><strong>New Password:</strong> ${newPassword}</p>
        <p>You can login at <a href="${loginLink}">${loginLink}</a> using these credentials.</p>
        <p>For security reasons, we strongly recommend that you change this password after logging in.</p>
        <br>
        <p>If you did not request this password reset, please contact us immediately at hola@nomadwebs.com</p>
    `

    return sendEmail(to, subject, text, html)
        .then((info) => {
            return info
        })
        .catch((error) => {
            console.error('Error sending password reset email:', error.message)
            throw error
        })
}

export default emailPasswordReset 
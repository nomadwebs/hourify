import 'dotenv/config'
import db from 'dat'
import changePassword from './changePassword.js'

await db.connect(process.env.MONGO_URL)

const userId = '67dde0d2985ba3a1a04fe1a4'
const oldPassword = '123456789'
const newPassword = '123456'
const newPasswordRepeat = '123456'

try {
    const user = await changePassword(userId, oldPassword, newPassword, newPasswordRepeat)
    console.log(user)

} catch (error) {
    console.error(error)

} finally {
    await db.disconnect()
}
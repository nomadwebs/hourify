import 'dotenv/config'
import db from 'dat'

import resetCreatedUserPassword from './resetCreatedUserPassword.js'

await db.connect(process.env.MONGO_URL)

const userId = '67dde0d2985ba3a1a04fe1a4' //UserId del usuario que se resetea la contraseña
const targetUserId = '67dde4cc985ba3a1a04fe1db' //UserId del usuario que se resetea la contraseña

try {
    const result = await resetCreatedUserPassword(userId, targetUserId)
    console.log(result)

} catch (error) {
    console.error(error)
} finally {
    await db.disconnect()
}
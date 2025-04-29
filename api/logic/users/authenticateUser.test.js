import 'dotenv/config'
import db from 'dat'
import authenticateUser from './authenticateUser.js'

await db.connect(process.env.MONGO_URL)

const username = 'risto'
const password = '123456'

try {
    const user = await authenticateUser(username, password)
    console.log(user)

} catch (error) {
    console.error(error)

} finally {
    await db.disconnect()
}
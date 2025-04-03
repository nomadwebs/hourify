import 'dotenv/config'
import db from 'dat'
import checkAndUpdateUserPlan from './checkAndUpdateUserPlan.js'

await db.connect(process.env.MONGO_URL)

const userId = '67dde0d2985ba3a1a04fe1a4'

try {
    const user = await checkAndUpdateUserPlan(userId)
    console.log(user)

} catch (error) {
    console.error(error)

} finally {
    await db.disconnect()
}
import 'dotenv/config'
import db from 'dat'
import updateUserPlan from './updateUserPlan.js'

await db.connect(process.env.MONGO_URL)

const userId = '67dde655985ba3a1a04fe271' //cirera
const plan = 'annual' //annual, lifeTime, monthly, free


try {
    const user = await updateUserPlan(userId, plan)
    console.log(user)
} catch (error) {
    console.error(error)
} finally {
    await db.disconnect()
}
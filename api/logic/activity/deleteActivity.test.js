import 'dotenv/config'
import db from 'dat'

import deleteActivity from './deleteActivity.js'

await db.connect(process.env.MONGO_URL)

const userId = '67dde0d2985ba3a1a04fe1a4'
const activityId = '680ff7685157dc21c748f710'

try {
    const deletedActivity = await deleteActivity(userId, activityId)
    console.log(deletedActivity.message)
} catch (error) {
    console.error('Error deleting activity:', error.message);
} finally {
    await db.disconnect()
}
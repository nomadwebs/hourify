import 'dotenv/config'
import db from 'dat'

import deletePack from './deletePack.js'

await db.connect(process.env.MONGO_URL)

const userId = '67dde0d2985ba3a1a04fe1a4'
const packId = '67ef9947594525f6592a8cde'

try {
    const deletedActivity = await deletePack(userId, packId)
    console.log(deletedActivity.message)
} catch (error) {
    console.error('Error deleting activity:', error.message);
} finally {
    await db.disconnect()
}
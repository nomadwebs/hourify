import 'dotenv/config'
import db from 'dat'

import deleteEvent from './deleteEvent.js'

await db.connect(process.env.MONGO_URL)

const eventId = '67f643bbd5c91fcec32d1110'
const userId = '67dde0d2985ba3a1a04fe1a4'

try {
    const deleted = await deleteEvent(eventId, userId)
    console.log('✅ Event deleted successfully:', deleted)
} catch (error) {
    console.error('❌ Error deleting event:', error.message)
} finally {
    await db.disconnect()
}
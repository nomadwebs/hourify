import 'dotenv/config'
import db from 'dat'

import getEvents from './getEvents.js'

await db.connect(process.env.MONGO_URL)

const userId = '67dde0d2985ba3a1a04fe1a4'

try {
    const events = await getEvents(userId)
    console.log('✅ Events retrieved:', events)
} catch (error) {
    console.error('❌ Error fetching events:', error.message)
} finally {
    await db.disconnect()
}

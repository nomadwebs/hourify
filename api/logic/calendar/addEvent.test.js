import 'dotenv/config'
import db from 'dat'

import addEvent from './addEvent.js'

await db.connect(process.env.MONGO_URL)

const userId = '67dde0d2985ba3a1a04fe1a4'
const title = 'Reunión de estrategia'
const description = 'Definir prioridades del segundo trimestre'
const location = 'Oficina central'
const attendees = ['67dde655985ba3a1a04fe271', '67dde4cc985ba3a1a04fe1db']
const startDateTime = null
const endDateTime = null

try {
    const event = await addEvent(userId, title, description, location, attendees, startDateTime, endDateTime)
    console.log('✅ Event added successfully:', event)
} catch (error) {
    console.error('❌ Error creating event:', error.message)
} finally {
    await db.disconnect()
}

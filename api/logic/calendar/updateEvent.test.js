import 'dotenv/config'
import db from 'dat'

import updateEvent from './updateEvent.js'

await db.connect(process.env.MONGO_URL)

const eventId = '67f832cba748c3c3307f2125'
const userId = '67dde0d2985ba3a1a04fe1a4'

const title = 'Evento actualizado'
const description = 'Nueva descripción del evento'
const location = 'Sala de reuniones 2'
const attendees = [
    '67dde655985ba3a1a04fe271',
    '67dde4cc985ba3a1a04fe1db',
    '67dde0d2985ba3a1a04fe1a4'
]
const startDateTime = new Date('2026-04-20T15:00:00Z')
const endDateTime = new Date('2026-04-20T16:00:00Z')
const typeEvent = 'Call'

try {
    const updatedEvent = await updateEvent(
        eventId,
        userId,
        title,
        description,
        location,
        attendees,
        startDateTime,
        endDateTime,
        typeEvent
    )
    console.log('✅ Event updated successfully:')
    console.log(updatedEvent)
} catch (error) {
    console.error('❌ Error updating event:', error.message)
} finally {
    await db.disconnect()
}

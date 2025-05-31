import 'dotenv/config'
import db from 'dat'

import createContact from './createContact.js'

await db.connect(process.env.MONGO_URL)

const creator = '67dde0d2985ba3a1a04fe1a4'
const name = 'Cirera Palos'
const email = 'cirera@sarandonga.com'
const phone = '768999666'
const contactType = 'customer'
const nif = '34556611W'
const address = 'Viladomat 66'
const city = 'Barcelona'
const postalCode = '08015'
const website = null
const linkedUserId = '67dde655985ba3a1a04fe271'
const notes = 'This is a test contact created for testing purposes'
const numberOfSessions = 1
const sessionsRecurrency = 'weekly'
const timeSchedule = 'Mediodia los martes'

try {
    const result = await createContact(
        creator,
        name,
        email,
        phone,
        contactType,
        nif,
        address,
        city,
        postalCode,
        website,
        notes,
        linkedUserId,
        numberOfSessions,
        sessionsRecurrency,
        timeSchedule
    )
    console.log('Contact created successfully:', result)
} catch (error) {
    console.error(error)
} finally {
    await db.disconnect()
} 
import 'dotenv/config'
import db from 'dat'

import createContact from './createContact.js'

await db.connect(process.env.MONGO_URL)

const creator = '67dde655985ba3a1a04fe271'
const name = 'Camilo Sesto'
const email = 'test@exampleeeee.com'
const phone = '345444345'
const contactType = 'default'
const notes = 'This is a test contact created for testing purposes'

try {
    const result = await createContact(
        creator,
        name,
        email,
        phone,
        contactType,
        notes
    )
    console.log('Contact created successfully:', result)
} catch (error) {
    console.error(error)
} finally {
    await db.disconnect()
} 
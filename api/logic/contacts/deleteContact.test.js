import 'dotenv/config'
import db from 'dat'

import deleteContact from './deleteContact.js'

await db.connect(process.env.MONGO_URL)

const userId = '67dde655985ba3a1a04fe271'
const contactId = '68371c958705ad0b19c1d0db'

try {
    const deletedContact = await deleteContact(userId, contactId)
    console.log(deletedContact)
} catch (error) {
    console.error('Error deleting contact:', error.message);
} finally {
    await db.disconnect()
}
import 'dotenv/config'
import db from 'dat'

import getContacts from './getContacts.js'

await db.connect(process.env.MONGO_URL)

const user = '67dde655985ba3a1a04fe271'

try {
    const result = await getContacts(user)
    console.log(result)
} catch (error) {
    console.error(error)
} finally {
    await db.disconnect()
} 
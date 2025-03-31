import 'dotenv/config'
import db from 'dat'

import getTasks from './getTasks.js'
await db.connect(process.env.MONGO_URL)

const userId = '67dde0d2985ba3a1a04fe1a4'

try {
    const result = await getTasks(userId)
    console.log(result)
} catch (error) {
    console.error(error)
} finally {
    await db.disconnect()
}
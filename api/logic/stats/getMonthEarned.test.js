import 'dotenv/config'
import db from 'dat'

import getMonthEarned from './getMonthEarned.js'
await db.connect(process.env.MONGO_URL)

try {
    const result = await getMonthEarned('67dde0d2985ba3a1a04fe1a4')
    console.log(result)
} catch (error) {
    console.error(error)

} finally {
    await db.disconnect()
}
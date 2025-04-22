import 'dotenv/config'
import db from 'dat'

import getMonthHoursTracked from './getMonthHoursTracked.js'
await db.connect(process.env.MONGO_URL)

try {
    const result = await getMonthHoursTracked('67dde0d2985ba3a1a04fe1a4')
    console.log(result)
} catch (error) {
    console.error(error)

} finally {
    await db.disconnect()
}
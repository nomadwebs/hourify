import 'dotenv/config'
import db from 'dat'

import getMonthPayments from './getMonthPayments.js'
await db.connect(process.env.MONGO_URL)

try {
    const result = await getMonthPayments('67dde0d2985ba3a1a04fe1a4')
    console.log(result)
} catch (error) {
    console.error(error)

} finally {
    await db.disconnect()
}
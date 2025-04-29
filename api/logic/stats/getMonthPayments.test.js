import 'dotenv/config'
import db from 'dat'

import getMonthPayments from './getMonthPayments.js'
await db.connect(process.env.MONGO_URL)

try {
    const result = await getMonthPayments('68109c6c9ccec8def34c73ab')
    console.log(result)
} catch (error) {
    console.error(error)

} finally {
    await db.disconnect()
}
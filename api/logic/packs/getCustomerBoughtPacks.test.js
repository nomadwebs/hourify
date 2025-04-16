import 'dotenv/config'
import db from 'dat'

import getCustomerBoughtPacks from './getCustomerBoughtPacks.js'
await db.connect(process.env.MONGO_URL)

try {
    const result = await getCustomerBoughtPacks('67dde655985ba3a1a04fe271') //Risto
    console.log(result)
} catch (error) {
    console.error(error)

} finally {
    await db.disconnect()
}
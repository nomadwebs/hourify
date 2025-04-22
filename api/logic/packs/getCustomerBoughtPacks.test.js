import 'dotenv/config'
import db from 'dat'

import getCustomerBoughtPacks from './getCustomerBoughtPacks.js'
await db.connect(process.env.MONGO_URL)

try {
    const result = await getCustomerBoughtPacks('680014379145e9d7fffd475f') //Risto
    console.log(result)
} catch (error) {
    console.error(error)

} finally {
    await db.disconnect()
}
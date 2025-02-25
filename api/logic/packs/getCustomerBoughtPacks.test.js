import 'dotenv/config'
import db from 'dat'

import getCustomerBoughtPacks from './getCustomerBoughtPacks.js'
await db.connect(process.env.MONGO_URL)

try {
    const result = await getCustomerBoughtPacks('6780f8fe58255d20563d6a5f') //Risto
    console.log(result)
} catch (error) {
    console.error(error)

} finally {
    await db.disconnect()
}
import 'dotenv/config'
import db from 'dat'

import getCustomers from './getCustomers.js'

await db.connect(process.env.MONGO_URL)
//await db.connect('mongodb://127.0.0.1:27017/hourify')

try {
    const result = await getCustomers('67dde0d2985ba3a1a04fe1a4')
    console.log(result)
    console.log(JSON.stringify(result, null, 2))
} catch (error) {
    console.error(error)

} finally {
    await db.disconnect()
}

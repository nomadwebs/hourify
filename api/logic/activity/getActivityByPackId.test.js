import 'dotenv/config'
import db from 'dat'

import getActivityByPackId from './getActivityByPackId.js'
await db.connect(process.env.MONGO_URL)

try {
    const result = await getActivityByPackId('67dde0d2985ba3a1a04fe1a4', '67dde4e5985ba3a1a04fe1e0')
    console.log(result)
} catch (error) {
    console.error(error)

} finally {
    await db.disconnect()
}
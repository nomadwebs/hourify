import 'dotenv/config'
import db from 'dat'

import getPackDetails from './getPackDetails.js'

await db.connect(process.env.MONGO_URL)

const userId = '67dde0d2985ba3a1a04fe1a4'
const packId = '67dde4e5985ba3a1a04fe1e0'

try {
    const result = await getPackDetails(userId, packId)
    console.log(result)
} catch (error) {
    console.error(error)

} finally {
    await db.disconnect()
}
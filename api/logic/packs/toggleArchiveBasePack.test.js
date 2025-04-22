import 'dotenv/config'
import db from 'dat'
import toggleArchiveBasePack from './toggleArchiveBasePack.js'
await db.connect(process.env.MONGO_URL)

const userId = '67dde0d2985ba3a1a04fe1a4'
const basePackId = '67ea7d43bc71f4140d441220'

try {
    await toggleArchiveBasePack(userId, basePackId)
    console.log('OK')
} catch (error) {
    console.error(error)
} finally {
    await db.disconnect()
}
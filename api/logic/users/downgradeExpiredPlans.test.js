import 'dotenv/config'
import db from 'dat'

import downgradeExpiredPlans from './downgradeExpiredPlans.js'

await db.connect(process.env.MONGO_URL)

try {
    const result = await downgradeExpiredPlans()

    if (!result || result.length === 0) {
        console.log('[TEST] No hay usuarios que downgradiar.')
    } else {
        console.log(`[TEST] Downgrade completado para ${result.length} usuario(s).`)
    }

} catch (error) {
    console.error('[TEST] Error en la ejecución:', error)

} finally {
    await db.disconnect()
    process.exit(0)
}
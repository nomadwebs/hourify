// cron/downgradePlansJob.js
import cron from 'node-cron'
import downgradeExpiredPlans from '../logic/users/downgradeExpiredPlans.js'

console.log('[CRON] Inicializando tarea programada de downgrade cada 12 horas...')

/* cron.schedule('0 * * * * *', async () => { */
cron.schedule('0 */12 * * *', async () => {
    console.log(`[CRON] Ejecutando downgrade automático → ${new Date().toISOString()}`)

    try {
        const downgradedUsers = await downgradeExpiredPlans()

        if (!downgradedUsers.length) {
            console.log('[CRON] No se ha downgradeado a ningún usuario.')
        } else {
            console.log(`[CRON] Downgrade aplicado a ${downgradedUsers.length} usuario(s):`)
            console.log(downgradedUsers)
        }
    } catch (err) {
        console.error('[CRON] Error durante el proceso:', err.message)
    }
})

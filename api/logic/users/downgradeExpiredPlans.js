// logic/users/downgradeExpiredPlans.js

import { User } from 'dat';
import { validate, errors } from 'com'

import updateUserPlan from './updateUserPlan.js';

const { SystemError } = errors

export default async function downgradeExpiredPlans() {
    try {
        const now = new Date();
        const expiredUsers = await User.find({
            plan: { $ne: 'free' },
            planExpiryDate: { $lte: now }
        });

        if (!expiredUsers.length) {
            console.log('[CRON] No hay usuarios para downgradear.');
            return []; // 👈 importante: devolver array vacío
        }

        console.log(`[CRON] Encontrados ${expiredUsers.length} usuarios con plan caducado.`);

        const downgraded = [];

        for (const user of expiredUsers) {
            try {
                await updateUserPlan(user.id, 'free');
                console.log(`[CRON] Usuario ${user.email} downgraded a 'free'`);
                downgraded.push(user.id); // 👈 acumulamos usuarios actualizados
            } catch (err) {
                console.error(`[CRON] Error al downgradear ${user.email}:`, err.message);
            }
        }

        return downgraded; // 👈 devolvemos lista de IDs actualizados
    } catch (err) {
        console.error('[CRON] Error al ejecutar downgradeExpiredPlans:', err.message);
        throw new SystemError(err.message);
    }
}
import { User } from "dat";
import { validate, errors } from 'com';

const { SystemError, NotFoundError } = errors;

export default (userId, adquiredPlan) => {
    validate.id(userId, 'userId');

    // Validar que adquiredPlan tenga un valor permitido
    const allowedPlans = ['lifeTime', 'annual', 'monthly', 'free'];
    if (!allowedPlans.includes(adquiredPlan)) {
        throw new Error(`Invalid plan type: ${adquiredPlan}`);
    }

    function calculatePlanExpiryDate(adquiredPlan) {
        const result = new Date();

        switch (adquiredPlan) {
            case 'lifeTime':
                return new Date('9999-12-31');
            case 'annual':
                // Usar setFullYear es más seguro que sumar 12 meses
                result.setFullYear(result.getFullYear() + 1);
                return result;
            case 'monthly':
                // Manejo especial para fin de mes
                const originalDate = result.getDate();
                result.setMonth(result.getMonth() + 1);
                if (result.getDate() !== originalDate) {
                    result.setDate(0); // Último día del mes anterior
                }
                return result;
            case 'free':
            default:
                return null;
        }
    }

    return User.findById(userId)
        .catch(error => { throw new SystemError(error.message) })
        .then(user => {
            if (!user) {
                throw new NotFoundError('User not found');
            }

            const planExpiryDate = calculatePlanExpiryDate(adquiredPlan);

            // Actualizar ambos campos: plan y planExpiryDate
            return User.findByIdAndUpdate(
                userId,
                {
                    //plan: adquiredPlan,
                    plan: 'pro',
                    planExpiryDate
                },
                { new: true } // Para devolver el documento actualizado
            )
                .catch(error => {
                    throw new SystemError(error.message);
                });
        });
};
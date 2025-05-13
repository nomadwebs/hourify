import { User } from 'dat';
import { validate, errors } from 'com';

const { SystemError, NotFoundError } = errors;

export default (userId, adquiredPlan) => {
    validate.id(userId, 'userId');

    console.log(userId)
    console.log(adquiredPlan)

    // Validar que adquiredPlan tenga un valor permitido
    const allowedPlans = ['lifeTime', 'annual', 'monthly', 'free'];
    if (!allowedPlans.includes(adquiredPlan)) {
        throw new Error(`Invalid plan type: ${adquiredPlan}`);
    }

    // Calcula la fecha de expiración según el plan adquirido
    function calculatePlanExpiryDate(adquiredPlan) {
        const result = new Date();

        switch (adquiredPlan) {
            case 'lifeTime':
                return new Date('9999-12-31');
            case 'annual':
                result.setFullYear(result.getFullYear() + 1);
                return result;
            case 'monthly':
                const originalDate = result.getDate();
                result.setMonth(result.getMonth() + 1);
                if (result.getDate() !== originalDate) {
                    result.setDate(0); // Último día del mes anterior
                }
                return result;
            case 'free':
            default:
                return null; // 👈 Los planes 'free' no tienen fecha de expiración
        }
    }

    return User.findById(userId)
        .catch(error => { throw new SystemError(error.message); })
        .then(user => {
            if (!user) {
                throw new NotFoundError('User not found');
            }

            const planExpiryDate = calculatePlanExpiryDate(adquiredPlan);

            // 👇 Ahora sí usamos el plan pasado por parámetro
            return User.findByIdAndUpdate(
                userId,
                {
                    plan: adquiredPlan,
                    planExpiryDate
                },
                { new: true } // Devolver el documento actualizado
            )
                .catch(error => {
                    throw new SystemError(error.message);
                });
        });
};
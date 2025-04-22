import { User } from "dat";
import { validate, errors } from 'com';

const { SystemError, NotFoundError } = errors;

export default (userId) => {
    validate.id(userId, 'userId');

    return User.findById(userId)
        .catch(error => { throw new SystemError(error.message) })
        .then(user => {
            if (!user) {
                throw new NotFoundError('User not found');
            }

            // If user is already on free plan, no need to check expiration
            if (user.plan === 'free') {
                return { wasDowngraded: false };
            }

            // If no expiration date, treat as expired
            if (!user.planExpiryDate) {
                return User.findByIdAndUpdate(
                    userId,
                    {
                        plan: 'free',
                        planExpiryDate: null
                    },
                    { new: true }
                )
                    .then(() => ({ wasDowngraded: true }))
                    .catch(error => { throw new SystemError(error.message) });
            }

            const now = new Date();
            const expiryDate = new Date(user.planExpiryDate);

            // If plan has expired, downgrade to free
            if (now > expiryDate) {
                return User.findByIdAndUpdate(
                    userId,
                    {
                        plan: 'free',
                        planExpiryDate: null
                    },
                    { new: true }
                )
                    .then(() => ({ wasDowngraded: true }))
                    .catch(error => { throw new SystemError(error.message) });
            }

            // Plan is still valid
            return { wasDowngraded: false };
        });
};

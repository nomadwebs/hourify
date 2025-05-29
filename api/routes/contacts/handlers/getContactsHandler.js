import logic from '../../../logic/index.js'

import { createFunctionalHandler } from '../../helpers/index.js'

export default createFunctionalHandler((req, res) => {
    const { userId } = req
    console.log('paso por el handler i el userId es: ', userId)

    return logic.getContacts(userId)
        .then(contacts => res.json(contacts))
})
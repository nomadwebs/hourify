import 'dotenv/config'
import db from 'dat'

import createUserByProvider from './createUserByProvider.js'

await db.connect(process.env.MONGO_URL)

//TEST: 
// Datos de prueba para el registro
const name = 'Gandalf';
const username = 'greygandalf491';
const password = 'greygandalf491';
const passwordRepeat = 'greygandalf491';
const email = 'greygandalf491@themiddleearth.com';
const userId = '6780f8fe58255d20563d6a5f' //UserId del provider


try {
    const result = await createUserByProvider(name,
        email,
        username,
        userId)

    console.log(result)

} catch (error) {
    console.error(error)
} finally {
    await db.disconnect()
}
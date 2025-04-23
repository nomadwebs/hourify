import 'dotenv/config'
import db from 'dat'

import registerUser from './registerUser.js'

await db.connect(process.env.MONGO_URL)

//TEST: 
// Datos de prueba para el registro
const name = 'Gandalf';
const username = 'greygandalf14';
const password = 'greygandalf';
const passwordRepeat = 'greygandalf';
const email = 'greygandalf14@themiddleearth.com';

try {
    const result = await registerUser(name,
        email,
        username,
        password,
        passwordRepeat)

    console.log(result)

} catch (error) {
    console.error(error)
} finally {
    await db.disconnect()
}
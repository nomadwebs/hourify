import 'dotenv/config'
import db from 'dat'

import updateProfileImage from './updateProfileImage.js'

await db.connect(process.env.MONGO_URL)

//TEST: 
// Datos de prueba para actualizar la imagen de perfil
const userId = '67dde0d2985ba3a1a04fe1a4' // Reemplazar con un ID válido de la base de datos
const newImageUrl = '/images/profile/risto.png'

try {
    const result = await updateProfileImage(userId, newImageUrl)
    console.log(result)
} catch (error) {
    console.error(error)
} finally {
    await db.disconnect()
} 
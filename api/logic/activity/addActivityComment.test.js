import 'dotenv/config'
import db from 'dat'

import addActivityComment from './addActivityComment.js'

await db.connect(process.env.MONGO_URL)

const activityId = '6834d1a166b33a6df62f9274'
const userId = '67dde655985ba3a1a04fe271'
const comment = 'La sesión de hoy ha sido increíble, la recordaré el resto de mi vida!!!'

try {
    const activityComment = await addActivityComment(activityId, userId, comment)
    console.log('✅ Comment added successfully:', activityComment)
} catch (error) {
    console.error('❌ Error creating comment:', error.message)
} finally {
    await db.disconnect()
}

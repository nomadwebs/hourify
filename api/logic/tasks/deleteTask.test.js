import 'dotenv/config'
import db from 'dat'

import deleteTask from './deleteTask.js'

await db.connect(process.env.MONGO_URL)

const userId = '67dde0d2985ba3a1a04fe1a4'
const taskId = '67e5dceb0b407d91766f7a97'

try {
    const deletedtask = await deleteTask(userId, taskId)
    console.log(deletedtask)
} catch (error) {
    console.error('Error deleting task:', error.message);
} finally {
    await db.disconnect()
}
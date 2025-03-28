import 'dotenv/config'
import db from 'dat'
import updateTask from './updateTask.js'

await db.connect(process.env.MONGO_URL)

const userId = '67dde0d2985ba3a1a04fe1a4'
const taskId = '67e1e727ccbb1890ea2f4cc7'
const customer = null

const description = 'Nueva descripción del task'
const dueDate = new Date('2026-01-01')
const priority = 'Urgent'
const status = 'On Hold'  //'Pending', 'In Progress', 'On Hold', 'Completed', 'Cancelled'
const notes = 'nueva nota actualizada'


try {
    const task = await updateTask(userId, taskId, description, dueDate, customer, priority, status, notes)
    console.log(task)
} catch (error) {
    console.error(error)
} finally {
    await db.disconnect()
}
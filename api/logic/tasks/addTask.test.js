import 'dotenv/config'
import db from 'dat'
import { errors } from 'com'

import addTask from './addTask.js'

await db.connect(process.env.MONGO_URL)

// Test data - use valid ObjectId format for MongoDB
const userId = '67d2bfddca4bb5c9ebd77a2d'       // User owner of the task
const customerId = '67d2921096a2903499fe4e61'   // Optional customer related to the task
const ownedPackId = '6794119f31f2834e80a3a5c7'  // Pack owned by the test user
const otherUserPackId = '67d2c02dca4bb5c9ebd77a31' // Pack owned by another user
const description = 'Complete project documentation'
const dueDate = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 days from now
const priority = 'Medium'
const status = 'Pending'
const notes = 'Should include diagrams and API documentation'

try {
    // Test case 1: Task creation with all parameters and owned pack
    console.log('Test case 1: Task creation with all parameters and owned pack')
    const task = await addTask(userId, description, dueDate, priority, status, customerId, ownedPackId, notes)
    console.log('Task created successfully:', task.id)

    // Test case 2: Task creation with only required parameters (no pack)
    console.log('\nTest case 2: Task creation with only required parameters (no pack)')
    const simpleTask = await addTask(userId, 'Simple task', null, 'Low', 'Pending')
    console.log('Simple task created successfully:', simpleTask.id)

    // Test case 3: Attempt to create task with pack owned by another user
    // This should throw an OwnershipError
    console.log('\nTest case 3: Attempt to create task with pack owned by another user')
    try {
        await addTask(userId, 'Task with unauthorized pack', null, 'Medium', 'Pending', null, otherUserPackId)
        console.log('ERROR: Task creation should have failed due to ownership validation')
    } catch (error) {
        if (error instanceof errors.OwnershipError) {
            console.log('Success: Ownership validation worked as expected:', error.message)
        } else {
            console.error('Unexpected error type:', error.constructor.name, error.message)
        }
    }

} catch (error) {
    console.error('Error during testing:', error.message)
} finally {
    await db.disconnect()
    console.log('Disconnected from database')
} 
import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { AddTask } from './components'
import logic from '../logic'

import { errors } from 'com'
import { Button } from '../library/index'

import useContext from './useContext'

const { SystemError } = errors

// Sample dummy tasks to showcase the design
const dummyTasks = [
    {
        id: '1',
        description: 'Design new website homepage',
        dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 days from now
        priority: 'High',
        status: 'In Progress',
        customer: 'Acme Corporation',
        notes: 'Need to create responsive design that works on all devices. Include new branding elements and color scheme.'
    },
    {
        id: '2',
        description: 'Update client invoice system',
        dueDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(), // 3 days from now
        priority: 'Urgent',
        status: 'Pending',
        customer: 'TechSolutions Inc',
        notes: 'Add automated reminders for overdue payments and integrate with payment gateway.'
    },
    {
        id: '3',
        description: 'Weekly team meeting',
        dueDate: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000).toISOString(), // tomorrow
        priority: 'Medium',
        status: 'Pending',
        customer: null,
        notes: 'Prepare agenda and project status update. Discuss upcoming deadlines and resource allocation.'
    },
    {
        id: '4',
        description: 'Review and test mobile app',
        dueDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), // 2 days ago (overdue)
        priority: 'High',
        status: 'Completed',
        customer: 'MobileFirst Solutions',
        notes: 'Test on iOS and Android devices. Focus on user experience and performance issues.'
    },
    {
        id: '5',
        description: 'Prepare quarterly tax documents',
        dueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(), // 14 days from now
        priority: 'Low',
        status: 'On Hold',
        customer: null,
        notes: 'Waiting for final financial reports from accounting department.'
    },
    {
        id: '6',
        description: 'Client onboarding call',
        dueDate: null, // No due date
        priority: 'Medium',
        status: 'Pending',
        customer: 'New Horizons LLC',
        notes: 'Introduce team members, explain project timeline, and gather initial requirements.'
    }
];

export default function Tasks(props) {
    const [loading, setLoading] = useState(true)
    const [tasks, setTasks] = useState([])
    const [view, setView] = useState(null)
    const [customers, setCustomers] = useState([])
    const [packs, setPacks] = useState([])
    const [selectedCustomerId, setSelectedCustomerId] = useState('')
    const [selectedTask, setSelectedTask] = useState(null)
    const taskFormRef = useRef(null)
    const { alert, confirm } = useContext()
    const navigate = useNavigate()
    const [expandedTaskId, setExpandedTaskId] = useState(null)

    const [formData, setFormData] = useState({
        description: '',
        dueDate: '',
        priority: 'Medium',
        status: 'Pending',
        customerId: '',
        packId: '',
        notes: ''
    })

    useEffect(() => {
        // Load dummy tasks to showcase the design
        setTasks(dummyTasks);

        // Fetch customers for the dropdown selector
        const fetchData = async () => {
            try {
                setLoading(true)
                const customers = await logic.getCustomers()
                setCustomers(customers)
                // Don't load packs yet - will be loaded when customer is selected
            } catch (error) {
                console.error('Error fetching data:', error)
                alert(error.message)
            } finally {
                setLoading(false)
            }
        }

        fetchData()
    }, [])

    // Load packs when a customer is selected
    useEffect(() => {
        if (selectedCustomerId) {
            const loadPacksForCustomer = async () => {
                try {
                    const customerPacks = await logic.getAdquiredPacks(selectedCustomerId)
                    setPacks(customerPacks)
                } catch (error) {
                    console.error('Error fetching packs:', error)
                    alert(error.message)
                    setPacks([])
                }
            }

            loadPacksForCustomer()
        } else {
            setPacks([])
        }
    }, [selectedCustomerId])

    useEffect(() => {
        if (view === 'AddTask' && taskFormRef.current) {
            taskFormRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' })
        }
    }, [view])

    const handleInputChange = (e) => {
        const { name, value } = e.target

        if (name === 'customerId') {
            setSelectedCustomerId(value)
        }

        setFormData(prev => ({
            ...prev,
            [name]: value
        }))
    }

    const handleAddTask = async (e) => {
        e.preventDefault()

        try {
            setLoading(true)
            const userId = logic.getUserId()

            // Create a Date object if dueDate is provided
            const parsedDueDate = formData.dueDate ? new Date(formData.dueDate) : null

            // Only pass customer ID if one is selected
            const customerId = formData.customerId || null

            // Only pass pack ID if one is selected
            const packId = formData.packId || null

            // Notes are optional
            const notes = formData.notes || null

            await logic.addTask(
                userId,
                formData.description,
                parsedDueDate,
                formData.priority,
                formData.status,
                customerId,
                packId,
                notes
            )

            alert('Task created successfully!', 'success')

            // Reset form
            setFormData({
                description: '',
                dueDate: '',
                priority: 'Medium',
                status: 'Pending',
                customerId: '',
                packId: '',
                notes: ''
            })

            setSelectedCustomerId('')
            setPacks([])
            setView(null)

            // Refresh task list - would be implemented when getTasks is available
            // For now, just set loading to false
            setLoading(false)
        } catch (error) {
            alert(error.message)
            console.error(error)
            setLoading(false)
        }
    }

    const handleCancelClick = () => {
        setView(null)
        setSelectedTask(null)
        setSelectedCustomerId('')
        setPacks([])

        // Reset form
        setFormData({
            description: '',
            dueDate: '',
            priority: 'Medium',
            status: 'Pending',
            customerId: '',
            packId: '',
            notes: ''
        })
    }

    const handleHomeClick = (event) => {
        event.preventDefault()
        props.onHomeClick()
    }

    const handleAddNewClick = () => {
        setView('AddTask')
    }

    const handleEditClick = (event, task) => {
        event.preventDefault()
        event.stopPropagation()
        // This would be implemented when the edit task functionality is available
        alert('Edit task functionality will be implemented soon')
    }

    const handleDeleteClick = (event, taskId) => {
        event.preventDefault()
        event.stopPropagation()
        // This would be implemented when the delete task functionality is available
        confirm('Do you want to delete this task? This action cannot be undone.', accepted => {
            if (accepted) {
                alert('Delete task functionality will be implemented soon')
            }
        }, 'warn')
    }

    const handleTaskClick = (taskId) => {
        // Toggle expanded state
        setExpandedTaskId(expandedTaskId === taskId ? null : taskId)
    }

    const handleStatusClick = (event, task) => {
        event.preventDefault()
        event.stopPropagation()

        // Define the status rotation
        const statusOptions = ['Pending', 'In Progress', 'On Hold', 'Completed', 'Cancelled']
        const currentIndex = statusOptions.indexOf(task.status)
        const nextIndex = (currentIndex + 1) % statusOptions.length
        const nextStatus = statusOptions[nextIndex]

        // In a real implementation, this would update the task on the server
        alert(`Status would change from "${task.status}" to "${nextStatus}". This functionality will be fully implemented soon.`)
    }

    const getPriorityColor = (priority) => {
        switch (priority) {
            case 'Low': return 'bg-blue-100 text-blue-800'
            case 'Medium': return 'bg-yellow-100 text-yellow-800'
            case 'High': return 'bg-orange-100 text-orange-800'
            case 'Urgent': return 'bg-red-100 text-red-800'
            default: return 'bg-gray-100 text-gray-800'
        }
    }

    const getStatusColor = (status) => {
        switch (status) {
            case 'Pending': return 'bg-yellow-100 text-yellow-800'
            case 'In Progress': return 'bg-blue-100 text-blue-800'
            case 'On Hold': return 'bg-gray-100 text-gray-800'
            case 'Completed': return 'bg-green-100 text-green-800'
            case 'Cancelled': return 'bg-red-100 text-red-800'
            default: return 'bg-gray-100 text-gray-800'
        }
    }

    const formatDate = (dateString) => {
        if (!dateString) return 'No due date'
        const date = new Date(dateString)
        return date.toISOString().split('T')[0]
    }

    return (
        <main className="flex flex-col items-center bg-color_backgroundGrey w-full flex-grow pt-12 px-4">
            <div className="w-full max-w-6xl">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
                    <div>
                        <h1 className="text-3xl font-bold">Task Management</h1>
                        <p className="text-gray-600">Create, view, and manage your tasks</p>
                    </div>
                    <button
                        onClick={handleAddNewClick}
                        className="flex items-center bg-gray-700 hover:bg-gray-800 text-white px-4 py-2 rounded-md transition-colors duration-300 shadow-md w-full sm:w-auto justify-center sm:justify-start font-medium"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                        </svg>
                        New Task
                    </button>
                </div>

                {loading ? (
                    <div className="flex justify-center items-center h-full py-12">
                        <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-color_green"></div>
                    </div>
                ) : tasks.length === 0 ? (
                    <div className="bg-white shadow-md rounded-lg p-6 w-full">
                        <h2 className="text-xl font-semibold text-color_darkBlue mb-4">No Tasks Available</h2>
                        <p className="text-gray-600 mb-4">You haven't created any tasks yet.</p>

                        <div className="bg-gray-50 p-4 rounded-md mb-4">
                            <h3 className="font-medium text-gray-700 mb-2">Getting Started:</h3>
                            <ol className="list-decimal pl-5 space-y-2 text-gray-600">
                                <li>Click the <span className="font-medium">"New Task"</span> button above</li>
                                <li>Fill in the task details (description, due date, priority, etc.)</li>
                                <li>Optionally assign the task to a customer and/or a pack</li>
                                <li>Save your task to start tracking it</li>
                            </ol>
                        </div>

                        <div className="border-t border-gray-200 pt-4 mt-4">
                            <p className="text-gray-600">Tasks help you organize your work and track your progress with customers and packs.</p>
                        </div>
                    </div>
                ) : (
                    <div className="bg-white shadow-md rounded-lg overflow-hidden">
                        {/* Table Header - Only show on tablet and up */}
                        <div className="bg-gray-50 border-b hidden sm:block">
                            <div className="grid grid-cols-12 py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                <div className="col-span-6">Description</div>
                                <div className="col-span-2 hidden md:block">Due Date</div>
                                <div className="col-span-2 text-center">Priority</div>
                                <div className="col-span-2 text-center">Status</div>
                            </div>
                        </div>

                        {/* Tasks List */}
                        <div className="divide-y divide-gray-200">
                            {tasks.map(task => (
                                <div key={task.id}>
                                    {/* Main row - clickable */}
                                    <div
                                        onClick={() => handleTaskClick(task.id)}
                                        className="hover:bg-gray-50 p-4 cursor-pointer transition-colors"
                                    >
                                        {/* Mobile View */}
                                        <div className="sm:hidden">
                                            <div className="mb-2">
                                                <h3 className="font-medium text-gray-900">{task.description}</h3>
                                            </div>
                                            <div className="grid grid-cols-2 gap-y-2 text-sm">
                                                <div className="text-gray-500">Priority:</div>
                                                <div>
                                                    <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getPriorityColor(task.priority)}`}>
                                                        {task.priority}
                                                    </span>
                                                </div>
                                                <div className="text-gray-500">Status:</div>
                                                <div onClick={(e) => handleStatusClick(e, task)}>
                                                    <span className={`px-2 py-1 text-xs font-semibold rounded-full cursor-pointer hover:opacity-80 ${getStatusColor(task.status)}`}>
                                                        {task.status}
                                                    </span>
                                                </div>
                                                <div className="text-gray-500">Due:</div>
                                                <div className="text-gray-700">{formatDate(task.dueDate)}</div>
                                            </div>
                                        </div>

                                        {/* Desktop View */}
                                        <div className="hidden sm:grid sm:grid-cols-12 sm:items-center">
                                            <div className="col-span-6 font-medium text-gray-900 truncate" title={task.description}>
                                                {task.description}
                                            </div>
                                            <div className="col-span-2 text-sm text-gray-500 hidden md:block">
                                                {formatDate(task.dueDate)}
                                            </div>
                                            <div className="col-span-2 flex justify-center">
                                                <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getPriorityColor(task.priority)}`}>
                                                    {task.priority}
                                                </span>
                                            </div>
                                            <div className="col-span-2 flex justify-center">
                                                <span
                                                    className={`px-2 py-1 text-xs font-semibold rounded-full cursor-pointer hover:opacity-80 ${getStatusColor(task.status)}`}
                                                    onClick={(e) => handleStatusClick(e, task)}
                                                >
                                                    {task.status}
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Expanded details area */}
                                    {expandedTaskId === task.id && (
                                        <div className="p-4 bg-gray-50 border-t border-gray-200">
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                {/* Details */}
                                                <div>
                                                    <h3 className="font-medium text-sm text-gray-500 mb-2">Details</h3>
                                                    <dl className="grid grid-cols-3 gap-2 text-sm">
                                                        <dt className="col-span-1 text-gray-500">Description:</dt>
                                                        <dd className="col-span-2 text-gray-900">{task.description}</dd>

                                                        <dt className="col-span-1 text-gray-500">Due Date:</dt>
                                                        <dd className="col-span-2 text-gray-900">{formatDate(task.dueDate)}</dd>

                                                        <dt className="col-span-1 text-gray-500">Priority:</dt>
                                                        <dd className="col-span-2">
                                                            <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getPriorityColor(task.priority)}`}>
                                                                {task.priority}
                                                            </span>
                                                        </dd>

                                                        <dt className="col-span-1 text-gray-500">Status:</dt>
                                                        <dd className="col-span-2">
                                                            <span
                                                                className={`px-2 py-1 text-xs font-semibold rounded-full cursor-pointer hover:opacity-80 ${getStatusColor(task.status)}`}
                                                                onClick={(e) => handleStatusClick(e, task)}
                                                            >
                                                                {task.status}
                                                            </span>
                                                        </dd>

                                                        {task.customer && (
                                                            <>
                                                                <dt className="col-span-1 text-gray-500">Customer:</dt>
                                                                <dd className="col-span-2 text-gray-900">{task.customer}</dd>
                                                            </>
                                                        )}

                                                        {task.notes && (
                                                            <>
                                                                <dt className="col-span-1 text-gray-500">Notes:</dt>
                                                                <dd className="col-span-2 text-gray-900 whitespace-pre-wrap">{task.notes}</dd>
                                                            </>
                                                        )}
                                                    </dl>
                                                </div>

                                                {/* Actions */}
                                                <div className="flex flex-col justify-start space-y-2">
                                                    <h3 className="font-medium text-sm text-gray-500 mb-2">Actions</h3>
                                                    <div className="flex flex-wrap gap-2">
                                                        <button
                                                            onClick={(event) => handleEditClick(event, task)}
                                                            className="flex items-center bg-white hover:bg-gray-100 text-gray-700 border border-gray-300 px-3 py-1 rounded-md transition-colors text-sm"
                                                        >
                                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                                                                <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                                                            </svg>
                                                            Edit Task
                                                        </button>
                                                        <button
                                                            onClick={(event) => handleDeleteClick(event, task.id)}
                                                            className="flex items-center bg-white hover:bg-red-50 text-red-600 border border-red-300 px-3 py-1 rounded-md transition-colors text-sm"
                                                        >
                                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                                                                <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                                                            </svg>
                                                            Delete Task
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {view === 'AddTask' && (
                    <AddTask
                        formData={formData}
                        handleInputChange={handleInputChange}
                        handleAddTask={handleAddTask}
                        handleCancelClick={handleCancelClick}
                        customers={customers}
                        packs={packs}
                        selectedCustomerId={selectedCustomerId}
                        taskFormRef={taskFormRef}
                    />
                )}

                <div className="flex justify-center mt-8">
                    <a
                        href=""
                        title="Go back home"
                        onClick={handleHomeClick}
                        className="text-color_primary hover:underline flex items-center"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
                        </svg>
                        Back to home
                    </a>
                </div>
            </div>
        </main>
    )
} 
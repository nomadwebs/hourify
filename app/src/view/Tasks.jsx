import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { AddTask } from './components'
import UpdateTask from './components/UpdateTask'
import logic from '../logic'

import { errors } from 'com'

import useContext from './useContext'

const { SystemError } = errors

export default function Tasks(props) {
    const [loading, setLoading] = useState(true)
    const [tasks, setTasks] = useState([])
    const [filteredTasks, setFilteredTasks] = useState([])
    const [view, setView] = useState(null)
    const [customers, setCustomers] = useState([])
    const [selectedCustomerId, setSelectedCustomerId] = useState('')
    const [selectedTask, setSelectedTask] = useState(null)
    const taskFormRef = useRef(null)
    const { alert, confirm } = useContext()
    const navigate = useNavigate()
    const [expandedTaskId, setExpandedTaskId] = useState(null)

    // Filters and sorting
    const [filters, setFilters] = useState({
        status: '',
        priority: '',
        customerFilter: '',
        search: ''
    })
    const [sortConfig, setSortConfig] = useState({
        key: 'dueDate',
        direction: 'asc'
    })

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
        // Fetch tasks, customers and other data
        const fetchData = async () => {
            try {
                setLoading(true)

                // Get user ID
                const userId = logic.getUserId()

                // Fetch tasks in parallel with customers for better performance
                const [tasksResponse, customersResponse] = await Promise.all([
                    logic.getTasks(userId),
                    logic.getCustomers()
                ])

                setTasks(tasksResponse)
                setCustomers(customersResponse)
            } catch (error) {
                console.error('Error fetching data:', error)
                alert(error.message)
            } finally {
                setLoading(false)
            }
        }

        fetchData()
    }, [])

    useEffect(() => {
        if ((view === 'AddTask' || view === 'EditTask') && taskFormRef.current) {
            taskFormRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' })
        }
    }, [view])

    // Apply filters and sorting to tasks
    useEffect(() => {
        let result = [...tasks]

        // Apply status filter
        if (filters.status) {
            result = result.filter(task => task.status === filters.status)
        }

        // Apply priority filter
        if (filters.priority) {
            result = result.filter(task => task.priority === filters.priority)
        }

        // Apply customer filter
        if (filters.customerFilter) {
            result = result.filter(task => task.customer === filters.customerFilter)
        }

        // Apply search filter
        if (filters.search) {
            const searchLower = filters.search.toLowerCase()
            result = result.filter(task =>
                task.description.toLowerCase().includes(searchLower) ||
                (task.notes && task.notes.toLowerCase().includes(searchLower))
            )
        }

        // Apply sorting
        if (sortConfig.key) {
            result.sort((a, b) => {
                if (!a[sortConfig.key] && !b[sortConfig.key]) return 0
                if (!a[sortConfig.key]) return 1
                if (!b[sortConfig.key]) return -1

                // Special handling for dates
                if (sortConfig.key === 'dueDate') {
                    const dateA = a.dueDate ? new Date(a.dueDate) : null
                    const dateB = b.dueDate ? new Date(b.dueDate) : null

                    if (!dateA && !dateB) return 0
                    if (!dateA) return 1
                    if (!dateB) return -1

                    return sortConfig.direction === 'asc'
                        ? dateA.getTime() - dateB.getTime()
                        : dateB.getTime() - dateA.getTime()
                }

                // Normal string comparison
                const valueA = String(a[sortConfig.key]).toLowerCase()
                const valueB = String(b[sortConfig.key]).toLowerCase()

                if (valueA < valueB) {
                    return sortConfig.direction === 'asc' ? -1 : 1
                }
                if (valueA > valueB) {
                    return sortConfig.direction === 'asc' ? 1 : -1
                }
                return 0
            })
        }

        setFilteredTasks(result)
    }, [tasks, filters, sortConfig])

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

            // Refresh task list with the latest data
            const refreshedTasks = await logic.getTasks(userId)
            setTasks(refreshedTasks)

            setLoading(false)
        } catch (error) {
            alert(error.message)
            console.error(error)
            setLoading(false)
        }
    }

    const handleEditClick = (event, task) => {
        event.preventDefault()
        event.stopPropagation()

        // Set the selected task and form data for editing
        setSelectedTask(task)
        setFormData({
            description: task.description,
            dueDate: task.dueDate ? formatDate(task.dueDate) : '',
            priority: task.priority,
            status: task.status,
            customerId: task.customer || '',
            notes: task.notes || ''
        })

        if (task.customer) {
            setSelectedCustomerId(task.customer)
        }

        // Set view to EditTask to show the edit form
        setView('EditTask')
    }

    const handleUpdateTask = async (e) => {
        e.preventDefault()

        try {
            setLoading(true)

            // Create a Date object if dueDate is provided
            const parsedDueDate = formData.dueDate ? new Date(formData.dueDate) : null

            // Only pass customer ID if one is selected
            const customerId = formData.customerId || null

            // Notes are optional
            const notes = formData.notes || null

            // Call the API to update the task
            await logic.updateTask(
                selectedTask.id,
                formData.description,
                parsedDueDate,
                customerId,
                formData.priority,
                formData.status,
                notes
            )

            alert('Task updated successfully!', 'success')

            // Reset form and view
            handleCancelClick()

            // Refresh task list with the latest data
            const userId = logic.getUserId()
            const refreshedTasks = await logic.getTasks(userId)
            setTasks(refreshedTasks)

        } catch (error) {
            alert(error.message)
            console.error(error)
        } finally {
            setLoading(false)
        }
    }

    const handleCancelClick = () => {
        setView(null)
        setSelectedTask(null)
        setSelectedCustomerId('')

        // Reset form
        setFormData({
            description: '',
            dueDate: '',
            priority: 'Medium',
            status: 'Pending',
            customerId: '',
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

    const handleDeleteClick = (event, taskId) => {
        event.preventDefault()
        event.stopPropagation()

        confirm('Do you want to delete this task? This action cannot be undone.', async (accepted) => {
            if (accepted) {
                try {
                    setLoading(true)

                    await logic.deleteTask(taskId)

                    // Only remove the task from state and show success if we get here
                    // (if the API had issues, the catch block would handle it)
                    const updatedTasks = tasks.filter(task => task.id !== taskId)
                    setTasks(updatedTasks)

                    // Show success message after confirming the task was deleted
                    alert('Task deleted successfully!', 'success')
                } catch (error) {
                    console.error('Error deleting task:', error)

                    // Show the specific error from the API
                    alert(error.message || 'Failed to delete task. Please try again.', 'error')
                } finally {
                    setLoading(false)
                }
            }
        }, 'warn')
    }

    const handleTaskClick = async (taskId) => {
        // Toggle expanded state
        const isExpanding = expandedTaskId !== taskId;
        setExpandedTaskId(expandedTaskId === taskId ? null : taskId);
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

    const getUserName = (customerId) => {
        const customer = customers.find(c => c.id === customerId)
        return customer ? customer.name : 'Unknown Customer'
    }

    const handleFilterChange = (e) => {
        const { name, value } = e.target
        setFilters(prev => ({
            ...prev,
            [name]: value
        }))
    }

    const handleSort = (key) => {
        setSortConfig(prev => ({
            key,
            direction: prev.key === key && prev.direction === 'asc' ? 'desc' : 'asc'
        }))
    }

    return (
        <main className="flex flex-col items-center bg-color_backgroundGrey w-full flex-grow pt-12 px-4">
            <div className="w-full max-w-6xl">
                <div className="flex flex-col sm:flex-row  items-start sm:items-center mb-6 gap-4">
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
                    <>
                        {/* Filters - collapsible on mobile */}
                        <div className="bg-white shadow-md rounded-lg p-4 mb-4">
                            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                                <div>
                                    <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-1">Search</label>
                                    <input
                                        type="text"
                                        id="search"
                                        name="search"
                                        value={filters.search}
                                        onChange={handleFilterChange}
                                        placeholder="Search tasks..."
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                    />
                                </div>

                                <div>
                                    <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                                    <select
                                        id="status"
                                        name="status"
                                        value={filters.status}
                                        onChange={handleFilterChange}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                    >
                                        <option value="">All Statuses</option>
                                        <option value="Pending">Pending</option>
                                        <option value="In Progress">In Progress</option>
                                        <option value="On Hold">On Hold</option>
                                        <option value="Completed">Completed</option>
                                        <option value="Cancelled">Cancelled</option>
                                    </select>
                                </div>

                                <div>
                                    <label htmlFor="priority" className="block text-sm font-medium text-gray-700 mb-1">Priority</label>
                                    <select
                                        id="priority"
                                        name="priority"
                                        value={filters.priority}
                                        onChange={handleFilterChange}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                    >
                                        <option value="">All Priorities</option>
                                        <option value="Low">Low</option>
                                        <option value="Medium">Medium</option>
                                        <option value="High">High</option>
                                        <option value="Urgent">Urgent</option>
                                    </select>
                                </div>

                                <div>
                                    <label htmlFor="customerFilter" className="block text-sm font-medium text-gray-700 mb-1">Customer</label>
                                    <select
                                        id="customerFilter"
                                        name="customerFilter"
                                        value={filters.customerFilter}
                                        onChange={handleFilterChange}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                    >
                                        <option value="">All Customers</option>
                                        {customers.map(customer => (
                                            <option key={customer.id} value={customer.id}>{customer.name}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white shadow-md rounded-lg overflow-hidden">
                            {/* Table Header */}
                            <div className="bg-gray-50 border-b">
                                <div className="grid grid-cols-12 py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    <div
                                        className="col-span-12 sm:col-span-5 cursor-pointer hover:text-gray-700 mb-2 sm:mb-0"
                                        onClick={() => handleSort('description')}
                                    >
                                        Description
                                        {sortConfig.key === 'description' && (
                                            <span className="ml-1">
                                                {sortConfig.direction === 'asc' ? '↑' : '↓'}
                                            </span>
                                        )}
                                    </div>
                                    <div
                                        className="col-span-4 sm:col-span-2 cursor-pointer hover:text-gray-700"
                                        onClick={() => handleSort('dueDate')}
                                    >
                                        Due Date
                                        {sortConfig.key === 'dueDate' && (
                                            <span className="ml-1">
                                                {sortConfig.direction === 'asc' ? '↑' : '↓'}
                                            </span>
                                        )}
                                    </div>
                                    <div className="col-span-8 sm:col-span-3 hidden sm:block">Customer</div>
                                    <div
                                        className="col-span-4 sm:col-span-1 text-center cursor-pointer hover:text-gray-700"
                                        onClick={() => handleSort('priority')}
                                    >
                                        Priority
                                        {sortConfig.key === 'priority' && (
                                            <span className="ml-1">
                                                {sortConfig.direction === 'asc' ? '↑' : '↓'}
                                            </span>
                                        )}
                                    </div>
                                    <div
                                        className="col-span-4 sm:col-span-1 text-center cursor-pointer hover:text-gray-700"
                                        onClick={() => handleSort('status')}
                                    >
                                        Status
                                        {sortConfig.key === 'status' && (
                                            <span className="ml-1">
                                                {sortConfig.direction === 'asc' ? '↑' : '↓'}
                                            </span>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Tasks List */}
                            <div className="divide-y divide-gray-200">
                                {filteredTasks.length === 0 ? (
                                    <div className="p-4 text-center text-gray-500">
                                        No tasks match your filters. Try adjusting your search criteria.
                                    </div>
                                ) : (
                                    filteredTasks.map(task => (
                                        <div key={task.id}>
                                            {/* Main row - clickable */}
                                            <div
                                                onClick={() => handleTaskClick(task.id)}
                                                className="hover:bg-gray-50 p-4 cursor-pointer transition-colors"
                                            >
                                                <div className="grid grid-cols-12 gap-y-2 items-center">
                                                    <div className="col-span-12 sm:col-span-5 font-medium text-gray-900 truncate" title={task.description}>
                                                        {task.description}
                                                    </div>
                                                    <div className="col-span-4 sm:col-span-2 text-sm text-gray-500">
                                                        {formatDate(task.dueDate)}
                                                    </div>
                                                    <div className="col-span-8 sm:col-span-3 text-sm text-gray-500 truncate order-last sm:order-none block sm:block" title={task.customer ? getUserName(task.customer) : ''}>
                                                        {task.customer ? getUserName(task.customer) : '-'}
                                                    </div>
                                                    <div className="col-span-4 sm:col-span-1 flex justify-start sm:justify-center">
                                                        <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getPriorityColor(task.priority)}`}>
                                                            {task.priority}
                                                        </span>
                                                    </div>
                                                    <div className="col-span-4 sm:col-span-1 flex justify-start sm:justify-center">
                                                        <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(task.status)}`}>
                                                            {task.status}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Expanded details area */}
                                            {expandedTaskId === task.id && (
                                                <div className="p-4 bg-gray-50 border-t border-gray-200">
                                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
                                                                    <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(task.status)}`}>
                                                                        {task.status}
                                                                    </span>
                                                                </dd>

                                                                {task.customer && (
                                                                    <>
                                                                        <dt className="col-span-1 text-gray-500">Customer:</dt>
                                                                        <dd className="col-span-2 text-gray-900">{getUserName(task.customer)}</dd>
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
                                                        <div className="flex flex-col justify-start space-y-2 mt-4 sm:mt-0">
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
                                    ))
                                )}
                            </div>
                        </div>
                    </>
                )}

                {view === 'AddTask' && (
                    <AddTask
                        formData={formData}
                        handleInputChange={handleInputChange}
                        handleAddTask={handleAddTask}
                        handleCancelClick={handleCancelClick}
                        customers={customers}
                        selectedCustomerId={selectedCustomerId}
                        taskFormRef={taskFormRef}
                    />
                )}

                {view === 'EditTask' && selectedTask && (
                    <UpdateTask
                        formData={formData}
                        handleInputChange={handleInputChange}
                        handleUpdateTask={handleUpdateTask}
                        handleCancelClick={handleCancelClick}
                        customers={customers}
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
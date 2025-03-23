import React from 'react'

export default function AddTask({
    formData,
    handleInputChange,
    handleAddTask,
    handleCancelClick,
    customers,
    packs,
    selectedCustomerId,
    taskFormRef
}) {
    return (
        <div ref={taskFormRef} className="mt-8 w-full max-w-4xl bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-color_darkBlue mb-4">Create New Task</h2>

            <form onSubmit={handleAddTask}>
                <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="description">
                        Description <span className="text-red-500">*</span>
                    </label>
                    <input
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        id="description"
                        name="description"
                        type="text"
                        placeholder="Task description"
                        value={formData.description}
                        onChange={handleInputChange}
                        required
                    />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div>
                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="dueDate">
                            Due Date
                        </label>
                        <input
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            id="dueDate"
                            name="dueDate"
                            type="date"
                            value={formData.dueDate}
                            onChange={handleInputChange}
                        />
                    </div>

                    <div>
                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="priority">
                            Priority <span className="text-red-500">*</span>
                        </label>
                        <select
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            id="priority"
                            name="priority"
                            value={formData.priority}
                            onChange={handleInputChange}
                            required
                        >
                            <option value="Low">Low</option>
                            <option value="Medium">Medium</option>
                            <option value="High">High</option>
                            <option value="Urgent">Urgent</option>
                        </select>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div>
                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="status">
                            Status <span className="text-red-500">*</span>
                        </label>
                        <select
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            id="status"
                            name="status"
                            value={formData.status}
                            onChange={handleInputChange}
                            required
                        >
                            <option value="Pending">Pending</option>
                            <option value="In Progress">In Progress</option>
                            <option value="On Hold">On Hold</option>
                            <option value="Completed">Completed</option>
                            <option value="Cancelled">Cancelled</option>
                        </select>
                    </div>

                    <div>
                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="customerId">
                            Customer
                        </label>
                        <select
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            id="customerId"
                            name="customerId"
                            value={formData.customerId}
                            onChange={handleInputChange}
                        >
                            <option value="">-- Select Customer --</option>
                            {customers.map(customer => (
                                <option key={customer.id} value={customer.id}>
                                    {customer.name} {customer.surname1 || ''}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>

                <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="packId">
                        Related Pack
                    </label>
                    <select
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        id="packId"
                        name="packId"
                        value={formData.packId}
                        onChange={handleInputChange}
                        disabled={!selectedCustomerId || packs.length === 0}
                    >
                        <option value="">-- Select Pack --</option>
                        {packs.map(pack => (
                            <option key={pack.id} value={pack.id}>
                                {pack.status === 'Active' ? ' 🟢 ' : ' 🔴 '}{pack.status} - {pack.description}
                            </option>
                        ))}
                    </select>
                    {selectedCustomerId && packs.length === 0 && (
                        <p className="text-sm text-gray-500 mt-1">No packs available for this customer</p>
                    )}
                    {!selectedCustomerId && (
                        <p className="text-sm text-gray-500 mt-1">Select a customer to see available packs</p>
                    )}
                </div>

                <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="notes">
                        Notes
                    </label>
                    <textarea
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        id="notes"
                        name="notes"
                        rows="4"
                        placeholder="Additional notes about this task"
                        value={formData.notes}
                        onChange={handleInputChange}
                    ></textarea>
                </div>

                <div className="flex items-center justify-end">
                    <button
                        type="button"
                        className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline mr-2"
                        onClick={handleCancelClick}
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        className="bg-color_primary hover:bg-color_primaryHover text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                    >
                        Create Task
                    </button>
                </div>
            </form>
        </div>
    )
}
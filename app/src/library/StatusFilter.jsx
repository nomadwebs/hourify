import React from 'react'

/**
 * StatusFilter component for filtering content by status
 * @param {Object} props - Component props
 * @param {string} props.activeFilter - Currently active filter value
 * @param {Function} props.setFilter - Function to set the active filter
 * @param {string} props.title - Title displayed above the filter
 * @param {Array} [props.statusOptions] - Array of status options (defaults to ['All', 'Active', 'Pending', 'Expired', 'Finished'])
 */

export default function StatusFilter({ activeFilter, setFilter, title, statusOptions = ['All', 'Active', 'Pending', 'Expired', 'Finished'] }) {
    return (
        <div className="mb-4">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                <h2 className="text-2xl font-bold text-color_darkBlue">{title}</h2>
                <div className="flex flex-wrap gap-2 text-sm">
                    {statusOptions.map(status => (
                        <button
                            key={status}
                            onClick={() => setFilter(status)}
                            className={`px-3 py-1 rounded-full ${activeFilter === status
                                ? 'bg-gray-700 text-white'
                                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                                } transition-colors duration-200`}
                        >
                            {status}
                        </button>
                    ))}
                </div>
            </div>
            {activeFilter !== 'All' && (
                <div className="mt-2 text-sm text-gray-500">
                    Showing only {activeFilter.toLowerCase()} items.
                    <button
                        onClick={() => setFilter('All')}
                        className="ml-2 text-color_primary hover:underline"
                    >
                        Clear filter
                    </button>
                </div>
            )}
        </div>
    )
} 
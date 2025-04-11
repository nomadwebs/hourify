import { useState, useEffect } from 'react'
import { format } from 'date-fns'

export default function EventForm({
    event,
    onEventChange,
    onSave,
    onCancel,
    isEditing = false
}) {
    const [formData, setFormData] = useState({
        title: '',
        startDateTime: new Date(),
        endDateTime: new Date(),
        description: '',
        location: '',
        typeEvent: 'Meeting',
        attendees: [],
        eventId: null // ✅ Añadido aquí
    })

    useEffect(() => {
        if (event) {
            console.log('Event: ', event)
            setFormData({
                title: event.title || '',
                startDateTime: event.startDateTime || new Date(),
                endDateTime: event.endDateTime || new Date(),
                description: event.description || '',
                location: event.location || '',
                typeEvent: event.typeEvent || 'Meeting',
                attendees: event.attendees || [],
                eventId: event.eventId || event.id || null // ✅ Asegura que se incluya el id
            })
        }
    }, [event])

    const handleInputChange = (e) => {
        const { name, value } = e.target
        const updated = {
            ...formData,
            [name]: value,
            eventId: formData.eventId // ✅ mantener eventId
        }
        setFormData(updated)
        onEventChange(updated)
    }

    const handleDateChange = (e) => {
        const { name, value } = e.target
        const newDate = new Date(value)
        const currentDate = new Date(formData[name])

        newDate.setHours(currentDate.getHours())
        newDate.setMinutes(currentDate.getMinutes())

        const updated = {
            ...formData,
            [name]: newDate,
            eventId: formData.eventId // ✅ mantener eventId
        }
        setFormData(updated)
        onEventChange(updated)
    }

    const handleTimeChange = (e) => {
        const { name, value } = e.target
        const [hours, minutes] = value.split(':')
        const newDate = new Date(formData[name])
        newDate.setHours(parseInt(hours, 10))
        newDate.setMinutes(parseInt(minutes, 10))

        const updated = {
            ...formData,
            [name]: newDate,
            eventId: formData.eventId // ✅ mantener eventId
        }
        setFormData(updated)
        onEventChange(updated)
    }

    const handleSubmit = (e) => {
        e.preventDefault()
        onSave()
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div>
                <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">Título</label>
                <input
                    type="text"
                    id="title"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    required
                />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                    <input
                        type="date"
                        id="date"
                        name="startDateTime"
                        value={format(formData.startDateTime, 'yyyy-MM-dd')}
                        onChange={handleDateChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        required
                    />
                </div>
                <div>
                    <label htmlFor="endDate" className="block text-sm font-medium text-gray-700 mb-1">End Date</label>
                    <input
                        type="date"
                        id="endDate"
                        name="endDateTime"
                        value={format(formData.endDateTime, 'yyyy-MM-dd')}
                        onChange={handleDateChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        required
                    />
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label htmlFor="time" className="block text-sm font-medium text-gray-700 mb-1">Start Time</label>
                    <input
                        type="time"
                        id="time"
                        name="startDateTime"
                        value={format(formData.startDateTime, 'HH:mm')}
                        onChange={handleTimeChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        required
                    />
                </div>
                <div>
                    <label htmlFor="endTime" className="block text-sm font-medium text-gray-700 mb-1">End Time</label>
                    <input
                        type="time"
                        id="endTime"
                        name="endDateTime"
                        value={format(formData.endDateTime, 'HH:mm')}
                        onChange={handleTimeChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        required
                    />
                </div>
            </div>

            <div>
                <label htmlFor="typeEvent" className="block text-sm font-medium text-gray-700 mb-1">Event Type</label>
                <select
                    id="typeEvent"
                    name="typeEvent"
                    value={formData.typeEvent}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    required
                >
                    <option value="Meeting">Meeting</option>
                    <option value="Call">Call</option>
                    <option value="Delivery">Delivery</option>
                    <option value="Training">Training</option>
                    <option value="Others">Others</option>
                </select>
            </div>

            <div>
                <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                <input
                    type="text"
                    id="location"
                    name="location"
                    value={formData.location}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                />
            </div>

            <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">Descripción</label>
                <textarea
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    rows="3"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                ></textarea>
            </div>

            <div>
                <label htmlFor="attendees" className="block text-sm font-medium text-gray-700 mb-1">
                    Attendees (emails separated by ',') COMMING SOON...
                </label>
                <input
                    type="text"
                    id="attendees"
                    name="attendees"
                    value={formData.attendees.join(', ')}
                    disabled
                    onChange={(e) => {
                        const emails = e.target.value
                            .split(',')
                            .map(email => email.trim())
                            .filter(email => email.length > 0)

                        const updated = {
                            ...formData,
                            attendees: emails,
                            eventId: formData.eventId // ✅ mantener eventId
                        }
                        setFormData(updated)
                        onEventChange(updated)
                    }}
                    placeholder="email1@example.com, email2@example.com"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                />
            </div>

            <div className="flex justify-end space-x-2 pt-2">
                <button
                    type="button"
                    onClick={onCancel}
                    className="px-3 py-1 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-md transition-colors duration-200 text-sm font-medium"
                >
                    Cancel
                </button>
                <button
                    type="submit"
                    className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors duration-200 text-sm font-medium"
                >
                    {isEditing ? 'Update' : 'Save'}
                </button>
            </div>
        </form>
    )
}
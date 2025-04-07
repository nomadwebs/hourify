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
        date: new Date(),
        endDate: new Date(),
        description: '',
        location: '',
        type: 'meeting'
    })

    useEffect(() => {
        if (event) {
            setFormData({
                title: event.title || '',
                date: event.date || new Date(),
                endDate: event.endDate || new Date(),
                description: event.description || '',
                location: event.location || '',
                type: event.type || 'meeting'
            })
        }
    }, [event])

    const handleInputChange = (e) => {
        const { name, value } = e.target
        setFormData(prev => ({
            ...prev,
            [name]: value
        }))
        onEventChange({
            ...formData,
            [name]: value
        })
    }

    const handleDateChange = (e) => {
        const { name, value } = e.target
        const newDate = new Date(value)
        const currentDate = new Date(formData[name])

        // Preserve the time when changing the date
        newDate.setHours(currentDate.getHours())
        newDate.setMinutes(currentDate.getMinutes())

        setFormData(prev => ({
            ...prev,
            [name]: newDate
        }))
        onEventChange({
            ...formData,
            [name]: newDate
        })
    }

    const handleTimeChange = (e) => {
        const { name, value } = e.target
        const [hours, minutes] = value.split(':')
        const newDate = new Date(formData[name])

        newDate.setHours(parseInt(hours, 10))
        newDate.setMinutes(parseInt(minutes, 10))

        setFormData(prev => ({
            ...prev,
            [name]: newDate
        }))
        onEventChange({
            ...formData,
            [name]: newDate
        })
    }

    const handleSubmit = (e) => {
        e.preventDefault()
        onSave()
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div>
                <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                    Título
                </label>
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
                    <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-1">
                        Fecha
                    </label>
                    <input
                        type="date"
                        id="date"
                        name="date"
                        value={format(formData.date, 'yyyy-MM-dd')}
                        onChange={handleDateChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        required
                    />
                </div>

                <div>
                    <label htmlFor="endDate" className="block text-sm font-medium text-gray-700 mb-1">
                        Fecha de fin
                    </label>
                    <input
                        type="date"
                        id="endDate"
                        name="endDate"
                        value={format(formData.endDate, 'yyyy-MM-dd')}
                        onChange={handleDateChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        required
                    />
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label htmlFor="time" className="block text-sm font-medium text-gray-700 mb-1">
                        Hora de inicio
                    </label>
                    <input
                        type="time"
                        id="time"
                        name="date"
                        value={format(formData.date, 'HH:mm')}
                        onChange={handleTimeChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        required
                    />
                </div>

                <div>
                    <label htmlFor="endTime" className="block text-sm font-medium text-gray-700 mb-1">
                        Hora de fin
                    </label>
                    <input
                        type="time"
                        id="endTime"
                        name="endDate"
                        value={format(formData.endDate, 'HH:mm')}
                        onChange={handleTimeChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        required
                    />
                </div>
            </div>

            <div>
                <label htmlFor="type" className="block text-sm font-medium text-gray-700 mb-1">
                    Tipo de evento
                </label>
                <select
                    id="type"
                    name="type"
                    value={formData.type}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    required
                >
                    <option value="meeting">Reunión</option>
                    <option value="call">Llamada</option>
                    <option value="delivery">Entrega</option>
                    <option value="training">Capacitación</option>
                </select>
            </div>

            <div>
                <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-1">
                    Ubicación
                </label>
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
                <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                    Descripción
                </label>
                <textarea
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    rows="3"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                ></textarea>
            </div>

            <div className="flex justify-end space-x-2 pt-2">
                <button
                    type="button"
                    onClick={onCancel}
                    className="px-3 py-1 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-md transition-colors duration-200 text-sm font-medium"
                >
                    Cancelar
                </button>
                <button
                    type="submit"
                    className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors duration-200 text-sm font-medium"
                >
                    {isEditing ? 'Actualizar' : 'Guardar'}
                </button>
            </div>
        </form>
    )
} 
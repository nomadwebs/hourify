import { useState, useEffect } from 'react'
import { DayPicker } from 'react-day-picker'
import 'react-day-picker/dist/style.css'
import { format } from 'date-fns'
import { es } from 'date-fns/locale'
import EventForm from './components/EventForm'
import EventDetails from './components/EventDetails'
import EventList from './components/EventList'

// Dummy data for events
const dummyEvents = [
    {
        id: 1,
        title: 'Reunión con cliente',
        date: new Date(2025, 3, 7, 10, 0),
        endDate: new Date(2025, 3, 7, 11, 30),
        description: 'Revisión de proyecto con cliente principal',
        location: 'Oficina central',
        type: 'meeting'
    },
    {
        id: 2,
        title: 'Entrega de proyecto',
        date: new Date(2025, 3, 7, 14, 0),
        endDate: new Date(2025, 3, 7, 15, 0),
        description: 'Entrega final del proyecto de desarrollo',
        location: 'Remoto',
        type: 'delivery'
    },
    {
        id: 3,
        title: 'Capacitación',
        date: new Date(2025, 3, 7, 15, 0),
        endDate: new Date(2025, 3, 7, 17, 0),
        description: 'Capacitación en nuevas tecnologías',
        location: 'Sala de conferencias',
        type: 'training'
    },
    {
        id: 4,
        title: 'Llamada con proveedor',
        date: new Date(2025, 4, 28, 11, 0),
        endDate: new Date(2025, 4, 28, 12, 0),
        description: 'Discusión sobre nuevos servicios',
        location: 'Remoto',
        type: 'call'
    }
]

export default function Calendar({ onHomeClick }) {
    const [selectedDate, setSelectedDate] = useState(new Date())
    const [events, setEvents] = useState(dummyEvents)
    const [selectedEvent, setSelectedEvent] = useState(null)
    const [isAddingEvent, setIsAddingEvent] = useState(false)
    const [isEditingEvent, setIsEditingEvent] = useState(false)
    const [newEvent, setNewEvent] = useState({
        title: '',
        date: new Date(),
        endDate: new Date(),
        description: '',
        location: '',
        type: 'meeting'
    })

    // Get events for the selected date
    const getEventsForDate = (date) => {
        return events.filter(event =>
            format(event.date, 'yyyy-MM-dd') === format(date, 'yyyy-MM-dd')
        )
    }

    // Handle date selection
    const handleDateSelect = (date) => {
        setSelectedDate(date)
        setSelectedEvent(null)
        setIsAddingEvent(false)
        setIsEditingEvent(false)
    }

    // Handle event selection
    const handleEventSelect = (event) => {
        setSelectedEvent(event)
    }

    // Handle adding a new event
    const handleAddEvent = () => {
        setIsAddingEvent(true)
        setSelectedEvent(null)
        setIsEditingEvent(false)
        setNewEvent({
            ...newEvent,
            date: selectedDate,
            endDate: new Date(selectedDate.getTime() + 60 * 60 * 1000) // 1 hour later
        })
    }

    // Handle saving a new event
    const handleSaveEvent = () => {
        const newEventWithId = {
            ...newEvent,
            id: events.length + 1
        }
        setEvents([...events, newEventWithId])
        setIsAddingEvent(false)
        setNewEvent({
            title: '',
            date: new Date(),
            endDate: new Date(),
            description: '',
            location: '',
            type: 'meeting'
        })
    }

    // Handle canceling event creation
    const handleCancelEvent = () => {
        setIsAddingEvent(false)
        setIsEditingEvent(false)
        setNewEvent({
            title: '',
            date: new Date(),
            endDate: new Date(),
            description: '',
            location: '',
            type: 'meeting'
        })
    }

    // Handle editing an event
    const handleEditEvent = () => {
        setIsEditingEvent(true)
        setNewEvent({ ...selectedEvent })
    }

    // Handle updating an event
    const handleUpdateEvent = () => {
        const updatedEvents = events.map(event =>
            event.id === newEvent.id ? newEvent : event
        )
        setEvents(updatedEvents)
        setSelectedEvent(newEvent)
        setIsEditingEvent(false)
        setNewEvent({
            title: '',
            date: new Date(),
            endDate: new Date(),
            description: '',
            location: '',
            type: 'meeting'
        })
    }

    // Handle deleting an event
    const handleDeleteEvent = (eventId) => {
        setEvents(events.filter(event => event.id !== eventId))
        setSelectedEvent(null)
    }

    // Custom modifiers for the calendar
    const modifiers = {
        hasEvent: (date) => getEventsForDate(date).length > 0
    }

    const modifiersStyles = {
        hasEvent: {
            fontWeight: 'bold',
            color: '#2563eb',
            textDecoration: 'underline'
        }
    }

    // Get event type color
    const getEventTypeColor = (type) => {
        switch (type) {
            case 'meeting':
                return 'bg-blue-100 text-blue-800'
            case 'call':
                return 'bg-purple-100 text-purple-800'
            case 'delivery':
                return 'bg-green-100 text-green-800'
            case 'training':
                return 'bg-yellow-100 text-yellow-800'
            default:
                return 'bg-gray-100 text-gray-800'
        }
    }

    return (
        <main className="flex flex-col items-center bg-color_backgroundGrey w-full flex-grow pt-12 px-4">
            <div className="w-full max-w-6xl">
                <div className="flex flex-col sm:flex-row items-start sm:items-center mb-6 gap-4">
                    <div>
                        <h1 className="text-3xl font-bold">Calendar</h1>
                        <p className="text-gray-600">Manage your events and appointments</p>
                    </div>
                    <button
                        onClick={handleAddEvent}
                        className="flex items-center bg-gray-700 hover:bg-gray-800 text-white px-4 py-2 rounded-md transition-colors duration-300 shadow-md w-full sm:w-auto justify-center sm:justify-start font-medium"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                        </svg>
                        Add Event
                    </button>
                </div>

                <div className="bg-white shadow-md rounded-lg overflow-hidden">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 p-6">
                        {/* Calendar Section */}
                        <div className="lg:col-span-5">
                            <DayPicker
                                mode="single"
                                selected={selectedDate}
                                onSelect={handleDateSelect}
                                modifiers={modifiers}
                                modifiersStyles={modifiersStyles}
                                locale={es}
                                className="w-full"
                            />
                        </div>

                        {/* Events Section */}
                        <div className="lg:col-span-7 bg-gray-50 rounded-lg p-4">
                            <h2 className="text-xl font-semibold mb-4 text-color_darkBlue">
                                {format(selectedDate, "EEEE d 'de' MMMM", { locale: es })}
                            </h2>

                            {isAddingEvent ? (
                                <EventForm
                                    event={newEvent}
                                    onEventChange={setNewEvent}
                                    onSave={handleSaveEvent}
                                    onCancel={handleCancelEvent}
                                />
                            ) : isEditingEvent ? (
                                <EventForm
                                    event={newEvent}
                                    onEventChange={setNewEvent}
                                    onSave={handleUpdateEvent}
                                    onCancel={handleCancelEvent}
                                    isEditing={true}
                                />
                            ) : selectedEvent ? (
                                <EventDetails
                                    event={selectedEvent}
                                    onClose={() => setSelectedEvent(null)}
                                    onDelete={() => handleDeleteEvent(selectedEvent.id)}
                                    onEdit={handleEditEvent}
                                />
                            ) : (
                                <EventList
                                    events={getEventsForDate(selectedDate)}
                                    onEventSelect={handleEventSelect}
                                />
                            )}
                        </div>
                    </div>
                </div>

                <div className="flex justify-center mt-8">
                    <a
                        href=""
                        title="Go back home"
                        onClick={onHomeClick}
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
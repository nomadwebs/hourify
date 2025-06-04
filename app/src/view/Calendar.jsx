import { useState, useEffect } from 'react'
import { DayPicker } from 'react-day-picker'
import 'react-day-picker/dist/style.css'
import { format } from 'date-fns'
import { enGB } from 'date-fns/locale'
import EventForm from './components/EventForm'
import EventDetails from './components/EventDetails'
import EventList from './components/EventList'
import logic from '../logic'

export default function Calendar({ onHomeClick }) {
    // Estados del calendario simple
    const [events, setEvents] = useState([])
    const [selectedDate, setSelectedDate] = useState(new Date())
    const [selectedEvent, setSelectedEvent] = useState(null)
    const [isAddingEvent, setIsAddingEvent] = useState(false)
    const [isEditingEvent, setIsEditingEvent] = useState(false)
    const [newEvent, setNewEvent] = useState({
        title: '',
        description: '',
        location: '',
        startDateTime: new Date(),
        endDateTime: new Date(),
        attendees: [],
        typeEvent: 'Meeting'
    })

    useEffect(() => {
        const fetchEvents = async () => {
            try {
                const userId = logic.getUserId()
                const eventsData = await logic.getEvents(userId)
                setEvents(eventsData || [])
            } catch (error) {
                console.error('Error loading events:', error.message)
                setEvents([])
            }
        }
        fetchEvents()
    }, [])

    const getEventsForDate = (date) => {
        return events.filter(event => {
            const eventDate = new Date(event.startDateTime)
            return format(eventDate, 'yyyy-MM-dd') === format(date, 'yyyy-MM-dd')
        })
    }

    const handleDateSelect = (date) => {
        setSelectedDate(date || new Date())
        setSelectedEvent(null)
        setIsAddingEvent(false)
        setIsEditingEvent(false)
    }

    const handleEventSelect = (event) => {
        setSelectedEvent(event)
    }

    const handleAddEvent = () => {
        setIsAddingEvent(true)
        setSelectedEvent(null)
        setIsEditingEvent(false)
        setNewEvent({
            title: '',
            description: '',
            location: '',
            startDateTime: selectedDate,
            endDateTime: new Date(selectedDate.getTime() + 60 * 60 * 1000),
            attendees: [],
            typeEvent: 'Meeting'
        })
    }

    const handleCancelEvent = () => {
        setIsAddingEvent(false)
        setIsEditingEvent(false)
        setNewEvent({
            title: '',
            description: '',
            location: '',
            startDateTime: new Date(),
            endDateTime: new Date(),
            attendees: [],
            typeEvent: 'Meeting'
        })
    }

    const handleSaveEvent = async () => {
        try {
            const userId = logic.getUserId()
            const { title, description, location, startDateTime, endDateTime, attendees, typeEvent } = newEvent

            if (!title || !startDateTime || !endDateTime) {
                alert('Missing required fields.')
                return
            }

            await logic.addEvent(title, description, location, attendees, startDateTime, endDateTime, typeEvent)

            // Refrescar eventos
            const updatedEventsData = await logic.getEvents(userId)
            setEvents(updatedEventsData || [])

            setIsAddingEvent(false)
            setNewEvent({
                title: '',
                description: '',
                location: '',
                startDateTime: new Date(),
                endDateTime: new Date(),
                attendees: [],
                typeEvent: 'Meeting'
            })
        } catch (error) {
            console.error('Error saving event:', error.message)
            alert('Error saving event: ' + error.message)
        }
    }

    const handleEditEvent = () => {
        setIsEditingEvent(true)
        setIsAddingEvent(false)
        setNewEvent({
            ...selectedEvent,
            eventId: selectedEvent.id,
            typeEvent: selectedEvent.typeEvent || 'Meeting'
        })
    }

    const handleUpdateEvent = async () => {
        try {
            const { eventId, title, description, location, attendees, startDateTime, endDateTime, typeEvent } = newEvent

            const formattedStartDateTime = startDateTime ? new Date(startDateTime) : null
            const formattedEndDateTime = endDateTime ? new Date(endDateTime) : null

            await logic.updateEvent(
                eventId || newEvent.id,
                title,
                description,
                location,
                attendees,
                formattedStartDateTime,
                formattedEndDateTime,
                typeEvent
            )

            // Refrescar eventos
            const userId = logic.getUserId()
            const updatedEventsData = await logic.getEvents(userId)
            setEvents(updatedEventsData || [])

            setIsEditingEvent(false)
            setSelectedEvent(null)
        } catch (error) {
            console.error('Error updating event:', error.message)
            alert('Error updating event: ' + error.message)
        }
    }

    const handleDeleteEvent = async (eventId) => {
        try {
            await logic.deleteEvent(eventId)
            setEvents(events.filter(event => event.id !== eventId))
            setSelectedEvent(null)
        } catch (error) {
            console.error('Error deleting event:', error.message)
            alert('Error deleting event: ' + error.message)
        }
    }

    return (
        <main className="flex flex-col bg-color_backgroundGrey w-full flex-grow pt-6 px-4">
            <div className="w-full max-w-7xl mx-auto">
                {/* Header */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-4">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-800">Calendar</h1>
                        <p className="text-gray-600">Manage your events and appointments</p>
                    </div>

                    <div className="flex items-center gap-4">
                        {/* Botón Agregar Evento */}
                        <button
                            onClick={handleAddEvent}
                            className="flex items-center bg-gray-700 hover:bg-gray-800 text-white px-4 py-2 rounded-lg transition-colors duration-300 shadow-md font-medium"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                            </svg>
                            Add Event
                        </button>
                    </div>
                </div>

                {/* Calendario Simple */}
                <div className="bg-white shadow-md rounded-lg overflow-hidden">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 p-6">
                        {/* Calendar Section */}
                        <div className="lg:col-span-5">
                            <DayPicker
                                mode="single"
                                selected={selectedDate}
                                onSelect={handleDateSelect}
                                modifiers={{
                                    hasEvent: (date) => getEventsForDate(date).length > 0
                                }}
                                modifiersStyles={{
                                    hasEvent: {
                                        fontWeight: 'bold',
                                        color: '#2563eb',
                                        textDecoration: 'underline'
                                    }
                                }}
                                locale={enGB}
                                weekStartsOn={1}
                                className="w-full"
                            />
                        </div>

                        {/* Events Section */}
                        <div className="lg:col-span-7 bg-gray-50 rounded-lg p-4">
                            {selectedDate && (
                                <h2 className="text-xl font-semibold mb-4 text-color_darkBlue">
                                    {format(selectedDate, "EEEE d MMMM yyyy", { locale: enGB })}
                                </h2>
                            )}

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
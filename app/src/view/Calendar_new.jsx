import { useState, useEffect } from 'react'
import { Calendar as BigCalendar, dateFnsLocalizer } from 'react-big-calendar'
import { DayPicker } from 'react-day-picker'
import 'react-day-picker/dist/style.css'
import { format, parse, startOfWeek, getDay } from 'date-fns'
import { enUS, enGB } from 'date-fns/locale'
import 'react-big-calendar/lib/css/react-big-calendar.css'
import EventForm from './components/EventForm'
import EventDetails from './components/EventDetails'
import EventList from './components/EventList'
import logic from '../logic'
import './CalendarCustom.css' // Archivo para estilos personalizados

// Configurar el localizer
const locales = {
    'en-GB': enGB, // Usar inglés británico que tiene lunes como primer día por defecto
}

const localizer = dateFnsLocalizer({
    format,
    parse,
    startOfWeek: () => 1, // Lunes como primer día
    getDay, // Usar la función original de date-fns
    locales,
})

export default function Calendar_new({ onHomeClick }) {
    // Estado para controlar qué tipo de calendario mostrar
    const [calendarType, setCalendarType] = useState('advanced') // 'simple' o 'advanced'

    // Estados compartidos
    const [events, setEvents] = useState([])
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

    // Estados para calendario avanzado
    const [view, setView] = useState('month') // month, week, day, agenda
    const [date, setDate] = useState(new Date())
    const [showEventModal, setShowEventModal] = useState(false)

    // Estados para calendario sencillo
    const [selectedDate, setSelectedDate] = useState(new Date())

    useEffect(() => {
        const fetchEvents = async () => {
            try {
                const userId = logic.getUserId()
                const eventsData = await logic.getEvents(userId)

                console.log('Events data from API:', eventsData) // Debug

                // Transformar eventos para react-big-calendar
                const transformedEvents = transformEventsForCalendar(eventsData)

                console.log('All transformed events:', transformedEvents) // Debug
                setEvents(transformedEvents)
            } catch (error) {
                console.error('Error loading events:', error.message)
                setEvents([])
            }
        }
        fetchEvents()
    }, [])

    // Función helper para transformar eventos
    const transformEventsForCalendar = (eventsData) => {
        console.log('Transforming events:', eventsData)

        return eventsData.map(event => {
            console.log('Processing individual event:', event)

            // Crear fechas válidas
            const startDate = new Date(event.startDateTime)
            const endDate = new Date(event.endDateTime)

            console.log('Start date:', startDate, 'End date:', endDate)

            const transformedEvent = {
                id: event.id,
                title: event.title || 'Untitled Event',
                start: startDate,
                end: endDate,
                // Mantener datos originales para compatibilidad
                startDateTime: event.startDateTime,
                endDateTime: event.endDateTime,
                description: event.description,
                location: event.location,
                typeEvent: event.typeEvent,
                attendees: event.attendees,
                resource: event // Guardar el evento original como resource
            }

            console.log('Final transformed event:', transformedEvent)
            return transformedEvent
        })
    }

    // ============ FUNCIONES PARA CALENDARIO SENCILLO ============
    const getEventsForDate = (date) => {
        return events.filter(event => {
            // Usar event.start que es la fecha transformada para BigCalendar
            const eventDate = new Date(event.start)
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

    const handleSelectEventAdvanced = (event) => {
        setSelectedEvent(event)
        setShowEventModal(true)
        setIsAddingEvent(false)
        setIsEditingEvent(false)
    }

    const handleAddEventSimple = () => {
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

    // ============ FUNCIONES PARA CALENDARIO AVANZADO ============
    // Manejadores de eventos del calendario avanzado
    const handleSelectSlot = ({ start, end }) => {
        setNewEvent({
            title: '',
            description: '',
            location: '',
            startDateTime: start,
            endDateTime: end,
            attendees: [],
            typeEvent: 'Meeting'
        })
        setIsAddingEvent(true)
        setShowEventModal(true)
        setSelectedEvent(null)
        setIsEditingEvent(false)
    }

    const handleNavigate = (newDate) => {
        setDate(newDate)
    }

    const handleViewChange = (newView) => {
        setView(newView)
    }

    const handleAddEvent = () => {
        setIsAddingEvent(true)
        setShowEventModal(true)
        setSelectedEvent(null)
        setIsEditingEvent(false)
        setNewEvent({
            title: '',
            description: '',
            location: '',
            startDateTime: new Date(),
            endDateTime: new Date(Date.now() + 60 * 60 * 1000), // 1 hora después
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
            const transformedEvents = transformEventsForCalendar(updatedEventsData)
            setEvents(transformedEvents)

            setShowEventModal(false)
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
            const transformedEvents = transformEventsForCalendar(updatedEventsData)
            setEvents(transformedEvents)

            setShowEventModal(false)
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
            setShowEventModal(false)
            setSelectedEvent(null)
        } catch (error) {
            console.error('Error deleting event:', error.message)
            alert('Error deleting event: ' + error.message)
        }
    }

    const handleCloseModal = () => {
        setShowEventModal(false)
        setIsAddingEvent(false)
        setIsEditingEvent(false)
        setSelectedEvent(null)
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

    // Personalización de estilos para diferentes tipos de eventos
    const eventStyleGetter = (event) => {
        let backgroundColor = '#3174ad'
        let style = {
            backgroundColor,
            borderRadius: '5px',
            opacity: 0.8,
            color: 'white',
            border: '0px',
            display: 'block',
            fontSize: '12px',
            padding: '2px 5px'
        }

        // Colores según el tipo de evento
        switch (event.typeEvent) {
            case 'Meeting':
                style.backgroundColor = '#3174ad'
                break
            case 'Personal':
                style.backgroundColor = '#f0ad4e'
                break
            case 'Work':
                style.backgroundColor = '#5cb85c'
                break
            case 'Health':
                style.backgroundColor = '#d9534f'
                break
            default:
                style.backgroundColor = '#6c757d'
        }

        return { style }
    }

    // Mensajes en inglés
    const messages = {
        allDay: 'All day',
        previous: 'Previous',
        next: 'Next',
        today: 'Today',
        month: 'Month',
        week: 'Week',
        day: 'Day',
        agenda: 'Agenda',
        date: 'Date',
        time: 'Time',
        event: 'Event',
        noEventsInRange: 'No events in this range',
        showMore: total => `+ Show more (${total})`
    }

    return (
        <main className="flex flex-col bg-color_backgroundGrey w-full flex-grow pt-6 px-4">
            <div className="w-full max-w-7xl mx-auto">
                {/* Header con selector de tipo de calendario */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-4">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-800">Calendar (NEW - TESTING)</h1>
                        <p className="text-gray-600">Advanced calendar with multiple views</p>
                    </div>

                    <div className="flex items-center gap-4">
                        {/* Selector de tipo de calendario */}
                        <div className="flex items-center bg-white rounded-lg border border-gray-200 overflow-hidden">
                            <button
                                onClick={() => setCalendarType('simple')}
                                className={`px-4 py-2 text-sm font-medium transition-colors ${calendarType === 'simple'
                                    ? 'bg-blue-600 text-white'
                                    : 'text-gray-700 hover:bg-gray-100'
                                    }`}
                            >
                                📅 Simple
                            </button>
                            <button
                                onClick={() => setCalendarType('advanced')}
                                className={`px-4 py-2 text-sm font-medium transition-colors ${calendarType === 'advanced'
                                    ? 'bg-blue-600 text-white'
                                    : 'text-gray-700 hover:bg-gray-100'
                                    }`}
                            >
                                🚀 Advanced
                            </button>
                        </div>

                        {/* Selector de vista (solo para calendario avanzado) */}
                        {calendarType === 'advanced' && (
                            <div className="flex items-center bg-white rounded-lg border border-gray-200 overflow-hidden">
                                {['month', 'week', 'day', 'agenda'].map((viewType) => (
                                    <button
                                        key={viewType}
                                        onClick={() => handleViewChange(viewType)}
                                        className={`px-3 py-2 text-sm font-medium capitalize transition-colors ${view === viewType
                                            ? 'bg-gray-700 text-white'
                                            : 'text-gray-700 hover:bg-gray-100'
                                            }`}
                                    >
                                        {viewType === 'month' ? 'Month' :
                                            viewType === 'week' ? 'Week' :
                                                viewType === 'day' ? 'Day' : 'Agenda'}
                                    </button>
                                ))}
                            </div>
                        )}

                        {/* Botón Agregar Evento */}
                        <button
                            onClick={calendarType === 'simple' ? handleAddEventSimple : handleAddEvent}
                            className="flex items-center bg-gray-700 hover:bg-gray-800 text-white px-4 py-2 rounded-lg transition-colors duration-300 shadow-md font-medium"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                            </svg>
                            Add Event
                        </button>
                    </div>
                </div>

                {/* Renderizado condicional de calendarios */}
                {calendarType === 'simple' ? (
                    /* ============ CALENDARIO SENCILLO ============ */
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
                ) : (
                    /* ============ CALENDARIO AVANZADO ============ */
                    <>
                        {/* Calendario */}
                        <div className="bg-white shadow-lg rounded-lg overflow-hidden" style={{ height: 'calc(100vh - 280px)', minHeight: '600px' }}>
                            {/* Debug info */}
                            {process.env.NODE_ENV === 'development' && (
                                <div style={{ position: 'absolute', top: '10px', right: '10px', background: 'yellow', padding: '5px', fontSize: '10px', zIndex: 1000 }}>
                                    Events: {events.length}
                                    {events.length > 0 && (
                                        <div>
                                            First event: {events[0]?.title} - {events[0]?.start?.toISOString?.()}
                                        </div>
                                    )}
                                </div>
                            )}

                            <BigCalendar
                                localizer={localizer}
                                events={events}
                                startAccessor="start"
                                endAccessor="end"
                                style={{ height: '100%', padding: '20px' }}
                                view={view}
                                onView={handleViewChange}
                                date={date}
                                onNavigate={handleNavigate}
                                onSelectSlot={handleSelectSlot}
                                onSelectEvent={handleSelectEventAdvanced}
                                selectable
                                popup
                                culture="en-GB"
                                firstDayOfWeek={1}
                                eventPropGetter={eventStyleGetter}
                                messages={messages}
                                step={30}
                                timeslots={2}
                                defaultView="month"
                                views={['month', 'week', 'day', 'agenda']}
                                formats={{
                                    monthHeaderFormat: 'MMMM yyyy',
                                    dayHeaderFormat: 'dd/MM/yyyy',
                                    dayRangeHeaderFormat: ({ start, end }) =>
                                        `${format(start, 'dd/MM')} - ${format(end, 'dd/MM/yyyy')}`,
                                    agendaDateFormat: 'dd/MM/yyyy',
                                }}
                            />
                        </div>

                        {/* Modal para eventos */}
                        {showEventModal && (
                            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                                <div className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
                                    <div className="p-6">
                                        {isAddingEvent ? (
                                            <EventForm
                                                event={newEvent}
                                                onEventChange={setNewEvent}
                                                onSave={handleSaveEvent}
                                                onCancel={handleCloseModal}
                                            />
                                        ) : isEditingEvent ? (
                                            <EventForm
                                                event={newEvent}
                                                onEventChange={setNewEvent}
                                                onSave={handleUpdateEvent}
                                                onCancel={handleCloseModal}
                                                isEditing={true}
                                            />
                                        ) : selectedEvent ? (
                                            <EventDetails
                                                event={selectedEvent}
                                                onClose={handleCloseModal}
                                                onDelete={() => handleDeleteEvent(selectedEvent.id)}
                                                onEdit={handleEditEvent}
                                            />
                                        ) : null}
                                    </div>
                                </div>
                            </div>
                        )}
                    </>
                )}

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
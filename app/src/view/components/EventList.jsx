import { format } from 'date-fns'
import { es } from 'date-fns/locale'

export default function EventList({ events, onEventSelect }) {
    if (events.length === 0) {
        return (
            <div className="text-center text-gray-500 py-4">
                No hay eventos para este día
            </div>
        )
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
        <div className="space-y-4">
            {events.map(event => {
                // Convertir las fechas a objetos Date si son strings
                const startDate = new Date(event.startDateTime)
                const endDate = new Date(event.endDateTime)

                return (
                    <div
                        key={event.id}
                        onClick={() => onEventSelect(event)}
                        className="p-4 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow cursor-pointer"
                    >
                        <div className="flex justify-between items-start">
                            <div>
                                <h3 className="font-medium text-gray-900">{event.title}</h3>
                                <p className="text-sm text-gray-500">
                                    {format(startDate, 'HH:mm', { locale: es })} - {format(endDate, 'HH:mm', { locale: es })}
                                </p>
                                {event.location && (
                                    <p className="text-sm text-gray-500 mt-1">
                                        {event.location}
                                    </p>
                                )}
                            </div>
                            <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getEventTypeColor(event.type)}`}>
                                {event.type}
                            </span>
                        </div>
                    </div>
                )
            })}
        </div>
    )
} 
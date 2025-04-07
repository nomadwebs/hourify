import { format } from 'date-fns'
import { es } from 'date-fns/locale'

export default function EventList({ events, onEventSelect }) {
    if (events.length === 0) {
        return (
            <div className="text-center py-4 text-gray-500">
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
        <div className="space-y-2">
            {events.map(event => (
                <div
                    key={event.id}
                    onClick={() => onEventSelect(event)}
                    className="bg-white p-3 rounded-md shadow-sm hover:bg-gray-50 cursor-pointer transition-colors duration-200 border border-gray-200"
                >
                    <div className="flex justify-between items-start">
                        <div className="font-medium text-gray-900">{event.title}</div>
                        <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getEventTypeColor(event.type)}`}>
                            {event.type}
                        </span>
                    </div>
                    <div className="text-sm text-gray-500 mt-1">
                        {format(event.date, 'HH:mm', { locale: es })} - {format(event.endDate, 'HH:mm', { locale: es })}
                    </div>
                    {event.location && (
                        <div className="text-sm text-gray-500 mt-1 flex items-center">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                            </svg>
                            {event.location}
                        </div>
                    )}
                </div>
            ))}
        </div>
    )
} 
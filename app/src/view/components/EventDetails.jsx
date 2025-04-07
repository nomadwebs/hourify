import { format } from 'date-fns'
import { es } from 'date-fns/locale'

export default function EventDetails({ event, onClose, onEdit, onDelete }) {
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

    // Get event type in Spanish
    const getEventTypeInSpanish = (type) => {
        switch (type) {
            case 'meeting':
                return 'Reunión'
            case 'call':
                return 'Llamada'
            case 'delivery':
                return 'Entrega'
            case 'training':
                return 'Capacitación'
            default:
                return type
        }
    }

    return (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <div className="flex justify-between items-start mb-4">
                <h3 className="text-xl font-semibold text-gray-900">{event.title}</h3>
                <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getEventTypeColor(event.type)}`}>
                    {getEventTypeInSpanish(event.type)}
                </span>
            </div>

            <div className="space-y-3">
                <div className="flex items-start">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-500 mr-2 mt-0.5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                    </svg>
                    <div>
                        <div className="text-sm font-medium text-gray-500">Fecha</div>
                        <div className="text-gray-900">{format(event.date, "EEEE d 'de' MMMM 'de' yyyy", { locale: es })}</div>
                    </div>
                </div>

                <div className="flex items-start">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-500 mr-2 mt-0.5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                    </svg>
                    <div>
                        <div className="text-sm font-medium text-gray-500">Horario</div>
                        <div className="text-gray-900">{format(event.date, 'HH:mm', { locale: es })} - {format(event.endDate, 'HH:mm', { locale: es })}</div>
                    </div>
                </div>

                {event.location && (
                    <div className="flex items-start">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-500 mr-2 mt-0.5" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                        </svg>
                        <div>
                            <div className="text-sm font-medium text-gray-500">Ubicación</div>
                            <div className="text-gray-900">{event.location}</div>
                        </div>
                    </div>
                )}

                {event.description && (
                    <div className="flex items-start">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-500 mr-2 mt-0.5" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M18 13V5a2 2 0 00-2-2H4a2 2 0 00-2 2v8a2 2 0 002 2h3l3 3 3-3h3a2 2 0 002-2zM5 7a1 1 0 011-1h8a1 1 0 110 2H6a1 1 0 01-1-1zm1 3a1 1 0 100 2h3a1 1 0 100-2H6z" clipRule="evenodd" />
                        </svg>
                        <div>
                            <div className="text-sm font-medium text-gray-500">Descripción</div>
                            <div className="text-gray-900 whitespace-pre-wrap">{event.description}</div>
                        </div>
                    </div>
                )}
            </div>

            <div className="flex justify-end space-x-2 mt-6">
                <button
                    onClick={onClose}
                    className="px-3 py-1 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-md transition-colors duration-200 text-sm font-medium"
                >
                    Cerrar
                </button>
                <button
                    onClick={onEdit}
                    className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors duration-200 text-sm font-medium"
                >
                    Editar
                </button>
                <button
                    onClick={onDelete}
                    className="px-3 py-1 bg-red-600 hover:bg-red-700 text-white rounded-md transition-colors duration-200 text-sm font-medium"
                >
                    Eliminar
                </button>
            </div>
        </div>
    )
} 
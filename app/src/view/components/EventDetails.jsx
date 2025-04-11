import { format } from 'date-fns'
import { es } from 'date-fns/locale'

export default function EventDetails({ event, onClose, onEdit, onDelete }) {
    // Convertir las fechas a objetos Date si son strings
    const startDate = new Date(event.startDateTime)
    const endDate = new Date(event.endDateTime)

    console.log('event en EventDetails: ', event)
    // Get event type color
    const getEventTypeColor = (event) => {
        switch (event.typeEvent) {
            case 'Meeting':
                return 'bg-blue-100 text-blue-800'
            case 'Call':
                return 'bg-purple-100 text-purple-800'
            case 'Delivery':
                return 'bg-green-100 text-green-800'
            case 'Training':
                return 'bg-yellow-100 text-yellow-800'
            default: 'Others'
                return 'bg-gray-100 text-gray-800'
        }
    }

    return (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <div className="flex justify-between items-start mb-4">
                <h3 className="text-xl font-semibold text-gray-900">{event.title}</h3>
                <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getEventTypeColor(event)}`}>
                    {event.typeEvent}
                </span>
            </div>

            <div className="space-y-3">
                <div>
                    <h3 className="text-sm font-medium text-gray-500">Fecha y hora</h3>
                    <p className="text-gray-900">
                        {format(startDate, "EEEE d 'de' MMMM 'de' yyyy", { locale: es })}
                    </p>
                    <p className="text-gray-900">
                        {format(startDate, 'HH:mm', { locale: es })} - {format(endDate, 'HH:mm', { locale: es })}
                    </p>
                </div>

                {event.location && (
                    <div>
                        <h3 className="text-sm font-medium text-gray-500">Ubicación</h3>
                        <p className="text-gray-900">{event.location}</p>
                    </div>
                )}

                {event.description && (
                    <div>
                        <h3 className="text-sm font-medium text-gray-500">Descripción</h3>
                        <p className="text-gray-900">{event.description}</p>
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
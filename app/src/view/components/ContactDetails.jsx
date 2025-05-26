import { useEffect } from 'react'

export default function ContactDetails({ contact, onClose }) {
    useEffect(() => {
        const handleEscape = (event) => {
            if (event.key === 'Escape') {
                onClose()
            }
        }

        document.addEventListener('keydown', handleEscape)
        return () => {
            document.removeEventListener('keydown', handleEscape)
        }
    }, [onClose])

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                <div className="p-6">
                    <div className="flex justify-between items-start mb-6">
                        <div className="flex items-center space-x-4">
                            <div className="w-16 h-16 rounded-full bg-color_lightGrey flex items-center justify-center">
                                <span className="text-2xl font-semibold text-color_darkBlue">
                                    {contact.name.charAt(0)}
                                </span>
                            </div>
                            <div>
                                <h2 className="text-2xl font-bold text-gray-800">{contact.name}</h2>
                                <p className="text-gray-600">{contact.type}</p>
                            </div>
                        </div>
                        <button
                            onClick={onClose}
                            className="text-gray-500 hover:text-gray-700"
                        >
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-4">
                            <div>
                                <h3 className="text-sm font-medium text-gray-500">Email</h3>
                                <p className="mt-1 text-gray-900">{contact.email}</p>
                            </div>
                            <div>
                                <h3 className="text-sm font-medium text-gray-500">Phone</h3>
                                <p className="mt-1 text-gray-900">{contact.phone}</p>
                            </div>
                            <div>
                                <h3 className="text-sm font-medium text-gray-500">NIF</h3>
                                <p className="mt-1 text-gray-900">{contact.nif}</p>
                            </div>
                        </div>
                        <div className="space-y-4">
                            <div>
                                <h3 className="text-sm font-medium text-gray-500">Address</h3>
                                <p className="mt-1 text-gray-900">{contact.address}</p>
                            </div>
                            <div>
                                <h3 className="text-sm font-medium text-gray-500">City</h3>
                                <p className="mt-1 text-gray-900">{contact.city}</p>
                            </div>
                        </div>
                    </div>

                    <div className="mt-6">
                        <h3 className="text-sm font-medium text-gray-500">Notes</h3>
                        <p className="mt-1 text-gray-900">{contact.notes}</p>
                    </div>

                    <div className="mt-6 flex justify-end space-x-3">
                        <button
                            onClick={onClose}
                            className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md"
                        >
                            Close
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
} 
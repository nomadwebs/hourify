import { useState, useEffect } from 'react'
import { Tooltip } from 'react-tooltip'
import ContactDetails from './components/ContactDetails'
import logic from '../logic'

export default function Contacts(props) {
    const [loading, setLoading] = useState(true)
    const [contacts, setContacts] = useState([])
    const [viewMode, setViewMode] = useState('grid')
    const [searchQuery, setSearchQuery] = useState('')
    const [selectedContact, setSelectedContact] = useState(null)
    const [showDetails, setShowDetails] = useState(false)
    const [isCreating, setIsCreating] = useState(false)

    const refreshContacts = async () => {
        try {
            setLoading(true)
            const contacts = await logic.getContacts()
            setContacts(contacts)
        } catch (error) {
            console.error('Error fetching contacts:', error)
            setContacts([])
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        refreshContacts()
    }, [])

    const handleContactClick = (contact) => {
        console.log('Contact clicked:', contact)
        setSelectedContact(contact)
        setShowDetails(true)
        setIsCreating(false)
    }

    const handleNewContact = () => {
        const newContact = {
            name: '',
            email: '',
            phone: '',
            nif: '',
            address: '',
            city: '',
            postalCode: '',
            website: '',
            numberOfSessions: '',
            sessionsRecurrency: 'weekly',
            timeSchedule: '',
            notes: '',
            contactType: 'default'
        }
        console.log('Creating new contact:', newContact)
        setSelectedContact(newContact)
        setShowDetails(true)
        setIsCreating(true)
    }

    const handleCloseDetails = () => {
        setShowDetails(false)
        setSelectedContact(null)
        setIsCreating(false)
    }

    const handleHomeClick = event => {
        event.preventDefault()
        props.onHomeClick()
    }

    const filteredContacts = contacts.filter(contact =>
        contact.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        contact.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        contact.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
        contact.phone.includes(searchQuery)
    )

    if (loading) {
        return (
            <main className="flex flex-col items-center bg-color_backgroundGrey w-full flex-grow pt-12 px-4">
                <h2 className="text-2xl font-bold mb-6">Contacts</h2>
                <div className="flex justify-center items-center h-full">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-color_green"></div>
                </div>
            </main>
        )
    }

    if (contacts.length === 0) {
        return (
            <main className="flex flex-col items-center bg-color_backgroundGrey w-full flex-grow pt-12 px-4">
                <h2 className="text-3xl font-bold mb-2">Contacts</h2>
                <p className="text-gray-600 mb-6">Manage your contacts</p>
                <div className="bg-white shadow-md rounded-lg p-6 w-full max-w-4xl">
                    <h2 className="text-xl font-semibold text-color_darkBlue mb-4">No Contacts Found</h2>
                    <p className="text-gray-600 mb-4">Start adding contacts to your list.</p>
                    <button
                        onClick={handleNewContact}
                        className="bg-color_darkBlue text-white px-4 py-2 rounded-lg hover:bg-color_lightBlue transition-colors duration-300 flex items-center space-x-2"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                        </svg>
                        <span>Add Your First Contact</span>
                    </button>
                </div>
            </main>
        )
    }

    return (
        <main className="flex flex-col items-center bg-color_backgroundGrey w-full flex-grow pt-12 px-4">
            <div className="w-full max-w-7xl">
                <div className="flex justify-between items-center mb-6">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-800">Contacts</h1>
                        <p className="text-gray-600">Manage your contacts</p>
                    </div>
                    <div className="flex items-center space-x-4">
                        <button
                            onClick={handleNewContact}
                            className="bg-color_darkBlue text-white px-4 py-2 rounded-lg hover:bg-color_lightBlue transition-colors duration-300 flex items-center space-x-2"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                            </svg>
                            <span>New Contact</span>
                        </button>
                        <div className="relative">
                            <input
                                type="text"
                                placeholder="Search contacts..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-color_darkBlue focus:border-color_darkBlue"
                            />
                            <svg className="w-5 h-5 text-gray-400 absolute left-3 top-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                        </div>
                        <div className="flex items-center space-x-2 bg-white rounded-lg p-1 border border-gray-200">
                            <button
                                onClick={() => setViewMode('grid')}
                                className={`p-2 rounded-md ${viewMode === 'grid' ? 'bg-color_darkBlue text-white' : 'text-gray-600'}`}
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                                </svg>
                            </button>
                            <button
                                onClick={() => setViewMode('list')}
                                className={`p-2 rounded-md ${viewMode === 'list' ? 'bg-color_darkBlue text-white' : 'text-gray-600'}`}
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                                </svg>
                            </button>
                        </div>
                    </div>
                </div>

                {viewMode === 'grid' ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredContacts.map(contact => (
                            <div
                                key={contact.id}
                                className="bg-white cursor-pointer rounded-lg shadow-sm hover:shadow-md transition-all duration-300 border border-gray-100"
                                onClick={() => handleContactClick(contact)}
                            >
                                <div className="p-6">
                                    <div className="flex items-start justify-between mb-4">
                                        <div className="flex items-center space-x-3">
                                            <div className="w-12 h-12 rounded-full bg-color_lightGrey flex items-center justify-center">
                                                <span className="text-lg font-semibold text-color_darkBlue">
                                                    {contact.name.charAt(0)}
                                                </span>
                                            </div>
                                            <div>
                                                <h3 className="text-lg font-semibold text-gray-800">
                                                    {contact.name}
                                                </h3>
                                                <p className="text-sm text-gray-500">{contact.email}</p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="space-y-3">
                                        <div className="flex items-center justify-between text-sm">
                                            <span className="text-gray-500">Type</span>
                                            <span className="font-medium text-gray-700">{contact.contactType}</span>
                                        </div>
                                        <div className="flex items-center justify-between text-sm">
                                            <span className="text-gray-500">City</span>
                                            <span className="font-medium text-gray-700">{contact.city}</span>
                                        </div>
                                        <div className="flex items-center justify-between text-sm">
                                            <span className="text-gray-500">Phone</span>
                                            <span className="font-medium text-gray-700">{contact.phone}</span>
                                        </div>
                                        {contact.numberOfSessions && (
                                            <div className="flex items-center justify-between text-sm">
                                                <span className="text-gray-500">Sessions</span>
                                                <span className="font-medium text-gray-700">
                                                    {contact.numberOfSessions} ({contact.sessionsRecurrency})
                                                </span>
                                            </div>
                                        )}
                                        {contact.lastInteraction && (
                                            <div className="flex items-center justify-between text-sm">
                                                <span className="text-gray-500">Last Interaction</span>
                                                <span className="font-medium text-gray-700">
                                                    {new Date(contact.lastInteraction).toLocaleDateString('es-ES', {
                                                        day: '2-digit',
                                                        month: '2-digit',
                                                        year: 'numeric'
                                                    })}
                                                </span>
                                            </div>
                                        )}
                                    </div>

                                    <button className="w-full mt-4 bg-color_darkBlue text-white py-2 px-4 rounded-md hover:bg-color_lightBlue transition-colors duration-300 flex items-center justify-center space-x-2">
                                        <span>View Details</span>
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                                        </svg>
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contact</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">City</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Phone</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Sessions</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Last Interaction</th>
                                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {filteredContacts.map(contact => (
                                    <tr
                                        key={contact.id}
                                        className="hover:bg-gray-50 cursor-pointer"
                                        onClick={() => handleContactClick(contact)}
                                    >
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center">
                                                <div className="w-10 h-10 rounded-full bg-color_lightGrey flex items-center justify-center">
                                                    <span className="text-sm font-semibold text-color_darkBlue">
                                                        {contact.name.charAt(0)}
                                                    </span>
                                                </div>
                                                <div className="ml-4">
                                                    <div className="text-sm font-medium text-gray-900">
                                                        {contact.name}
                                                    </div>
                                                    <div className="text-sm text-gray-500">
                                                        {contact.email}
                                                    </div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm text-gray-900">{contact.contactType}</div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm text-gray-900">{contact.city}</div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm text-gray-900">{contact.phone}</div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm text-gray-900">
                                                {contact.numberOfSessions ? `${contact.numberOfSessions} (${contact.sessionsRecurrency})` : '-'}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm text-gray-900">
                                                {contact.lastInteraction ? new Date(contact.lastInteraction).toLocaleDateString('es-ES', {
                                                    day: '2-digit',
                                                    month: '2-digit',
                                                    year: 'numeric'
                                                }) : '-'}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                            <button className="text-color_darkBlue hover:text-color_lightBlue">
                                                View Details
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {showDetails && selectedContact && (
                <ContactDetails
                    contact={selectedContact}
                    onClose={handleCloseDetails}
                    isCreating={isCreating}
                    onContactCreated={refreshContacts}
                />
            )}

            <Tooltip id="tooltip"
                place="top"
                className="!bg-white !text-gray-800 !rounded-md !px-3 !py-2 !text-sm !border !border-gray-300 !shadow-md" />

            <a
                href=""
                title="Go back home"
                onClick={handleHomeClick}
                className="mt-8 text-color_darkBlue hover:underline"
            >
                Back to home
            </a>
        </main>
    )
} 
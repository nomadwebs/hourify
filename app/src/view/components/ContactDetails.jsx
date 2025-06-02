import { useEffect, useState } from 'react'
import { Button, Field, Input, Label, Textarea } from '../../library'
import logic from '../../logic'
import useContex from '../useContext'

export default function ContactDetails({ contact, onClose, isCreating = false, onContactCreated }) {
    const [editedContact, setEditedContact] = useState(contact)
    const [linkedUserName, setLinkedUserName] = useState(null)
    const [customers, setCustomers] = useState([])
    const { alert, confirm } = useContex()

    useEffect(() => {
        // Fetch customers for the dropdown
        logic.getCustomers()
            .then(customers => {
                setCustomers(customers)
                // If there's a linked user, find and set their name
                if (contact.linkedUserId) {
                    const linkedCustomer = customers.find(customer => customer.id === contact.linkedUserId)
                    if (linkedCustomer) {
                        setLinkedUserName(`${linkedCustomer.name} ${linkedCustomer.surname1 || ''}`)
                    }
                }
            })
            .catch(error => console.error('Error fetching customers:', error))
    }, [contact.linkedUserId])

    const handleCancelButton = event => {
        event.preventDefault()

        confirm('Do you want to cancel?', accepted => {
            if (accepted) {
                onClose()
            }
        }, 'warn')
    }

    const handleDeleteButton = event => {
        event.preventDefault()

        confirm('Are you sure you want to delete this contact? This action cannot be undone.', accepted => {
            if (accepted) {
                logic.deleteContact(contact.id)
                    .then(() => {
                        alert('Contact deleted successfully!', 'success')
                        onContactCreated()
                        onClose()
                    })
                    .catch(error => {
                        alert(error.message)
                    })
            }
        }, 'error')
    }

    const handleLinkedUserChange = event => {
        const { value } = event.target
        setEditedContact(prev => ({
            ...prev,
            linkedUserId: value
        }))
    }

    const handleSubmit = event => {
        event.preventDefault()

        const { target: form } = event
        const {
            name: { value: name },
            email: { value: email },
            phone: { value: phone },
            contactType: { value: contactType },
            nif: { value: nif },
            address: { value: address },
            city: { value: city },
            postalCode: { value: postalCode },
            website: { value: website },
            linkedUserId: { value: linkedUserId },
            numberOfSessions: { value: numberOfSessions },
            sessionsRecurrency: { value: sessionsRecurrency },
            timeSchedule: { value: timeSchedule },
            notes: { value: notes }
        } = form

        try {
            if (isCreating) {
                logic.createContact(name, email, phone, contactType, nif, address, city, postalCode, website, notes, linkedUserId || null, numberOfSessions, sessionsRecurrency, timeSchedule)
                    .then(() => {
                        alert('Contact created successfully!', 'success')
                        onContactCreated()
                        onClose()
                    })
                    .catch(error => {
                        alert(error.message)
                    })
            } else {
                logic.updateContact(
                    contact.id,
                    name,
                    email,
                    phone,
                    contactType,
                    nif,
                    address,
                    city,
                    postalCode,
                    website,
                    notes,
                    linkedUserId || null,
                    numberOfSessions,
                    sessionsRecurrency,
                    timeSchedule
                )
                    .then(() => {
                        alert('Contact updated successfully!', 'success')
                        onContactCreated()
                        onClose()
                    })
                    .catch(error => {
                        alert(error.message)
                    })
            }
        } catch (error) {
            alert(error.message)
            console.error(error)
        }
    }

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
                <div className="p-6">
                    <div className="flex justify-between items-start mb-6">
                        <div className="flex items-center space-x-4">
                            <div className="w-16 h-16 rounded-full bg-color_lightGrey flex items-center justify-center">
                                <span className="text-2xl font-semibold text-color_darkBlue">
                                    {isCreating ? '+' : contact.name.charAt(0)}
                                </span>
                            </div>
                            <div>
                                <h2 className="text-2xl font-bold text-gray-800">
                                    {isCreating ? 'New Contact' : 'Contact Details'}
                                </h2>
                                <p className="text-gray-600">
                                    {isCreating ? 'Create new contact' : 'Edit contact information'}
                                </p>
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

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-4">
                                <Field>
                                    <Label htmlFor="name">Name</Label>
                                    <Input
                                        type="text"
                                        id="name"
                                        name="name"
                                        defaultValue={contact.name}
                                        required
                                    />
                                </Field>
                                <Field>
                                    <Label htmlFor="email">Email</Label>
                                    <Input
                                        type="email"
                                        id="email"
                                        name="email"
                                        defaultValue={contact.email}
                                    />
                                </Field>
                                <Field>
                                    <Label htmlFor="phone">Phone</Label>
                                    <Input
                                        type="tel"
                                        id="phone"
                                        name="phone"
                                        defaultValue={contact.phone}
                                    />
                                </Field>
                                <Field>
                                    <Label htmlFor="nif">NIF</Label>
                                    <Input
                                        type="text"
                                        id="nif"
                                        name="nif"
                                        defaultValue={contact.nif}
                                    />
                                </Field>
                            </div>

                            <div className="space-y-4">
                                <Field>
                                    <Label htmlFor="address">Address</Label>
                                    <Input
                                        type="text"
                                        id="address"
                                        name="address"
                                        defaultValue={contact.address}
                                    />
                                </Field>
                                <Field>
                                    <Label htmlFor="city">City</Label>
                                    <Input
                                        type="text"
                                        id="city"
                                        name="city"
                                        defaultValue={contact.city}
                                    />
                                </Field>
                                <Field>
                                    <Label htmlFor="postalCode">Postal Code</Label>
                                    <Input
                                        type="text"
                                        id="postalCode"
                                        name="postalCode"
                                        defaultValue={contact.postalCode}
                                    />
                                </Field>
                                <Field>
                                    <Label htmlFor="website">Website</Label>
                                    <Input
                                        type="url"
                                        id="website"
                                        name="website"
                                        defaultValue={contact.website}
                                    />
                                </Field>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <Field>
                                <Label htmlFor="contactType">Contact Type</Label>
                                <select
                                    id="contactType"
                                    name="contactType"
                                    defaultValue={contact.contactType || 'default'}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-color_primary"
                                    required
                                >
                                    <option value="customer">Customer</option>
                                    <option value="provider">Provider</option>
                                    <option value="lead">Lead</option>
                                    <option value="default">Default</option>
                                </select>
                            </Field>
                            <Field>
                                <Label htmlFor="numberOfSessions">Number of Sessions</Label>
                                <Input
                                    type="number"
                                    id="numberOfSessions"
                                    name="numberOfSessions"
                                    defaultValue={contact.numberOfSessions}
                                />
                            </Field>
                            <Field>
                                <Label htmlFor="sessionsRecurrency">Session Recurrency</Label>
                                <select
                                    id="sessionsRecurrency"
                                    name="sessionsRecurrency"
                                    defaultValue={contact.sessionsRecurrency || 'weekly'}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-color_primary"
                                >
                                    <option value="weekly">Weekly</option>
                                    <option value="month">Monthly</option>
                                </select>
                            </Field>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <Field>
                                <Label htmlFor="timeSchedule">Time Schedule</Label>
                                <Input
                                    type="text"
                                    id="timeSchedule"
                                    name="timeSchedule"
                                    defaultValue={contact.timeSchedule}
                                />
                            </Field>
                            <Field>
                                <Label htmlFor="linkedUserId">Linked Customer</Label>
                                <select
                                    id="linkedUserId"
                                    name="linkedUserId"
                                    value={editedContact.linkedUserId || ''}
                                    onChange={handleLinkedUserChange}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-color_primary"
                                >
                                    <option value="">-- Select Customer --</option>
                                    {customers.map(customer => (
                                        <option key={customer.id} value={customer.id}>
                                            {customer.name} {customer.surname1 || ''}
                                        </option>
                                    ))}
                                </select>
                            </Field>
                        </div>

                        <Field>
                            <Label htmlFor="notes">Notes</Label>
                            <Textarea
                                id="notes"
                                name="notes"
                                defaultValue={contact.notes}
                            />
                        </Field>

                        {!isCreating && (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-gray-50 p-4 rounded-lg">
                                <div>
                                    <h3 className="text-sm font-medium text-gray-500">Created At</h3>
                                    <p className="mt-1 text-gray-900">
                                        {contact.createdAt ? new Date(contact.createdAt).toLocaleDateString('es-ES', {
                                            day: '2-digit',
                                            month: '2-digit',
                                            year: 'numeric'
                                        }) : 'N/A'}
                                    </p>
                                </div>
                                <div>
                                    <h3 className="text-sm font-medium text-gray-500">Last Interaction</h3>
                                    <p className="mt-1 text-gray-900">
                                        {contact.lastInteraction ? new Date(contact.lastInteraction).toLocaleDateString('es-ES', {
                                            day: '2-digit',
                                            month: '2-digit',
                                            year: 'numeric'
                                        }) : 'N/A'}
                                    </p>
                                </div>
                                {linkedUserName && (
                                    <div className="md:col-span-2">
                                        <h3 className="text-sm font-medium text-gray-500">Linked User</h3>
                                        <p className="mt-1 text-gray-900">{linkedUserName}</p>
                                    </div>
                                )}
                            </div>
                        )}

                        <div className="flex flex-col sm:flex-row justify-center items-center space-y-2 sm:space-y-0 sm:space-x-4">
                            <Button type="submit" className="btn m-2">
                                {isCreating ? 'Create contact' : 'Update contact'}
                            </Button>
                            <Button className="btn m-2 bg-color_softRed hover:bg-red-800 transition" onClick={handleCancelButton}>Cancel</Button>
                        </div>

                        {!isCreating && (
                            <div className="mt-8 pt-4 border-t border-gray-200">
                                <div className="flex justify-center">
                                    <Button
                                        className="btn text-sm py-1 px-3 bg-red-600 hover:bg-red-700 transition"
                                        onClick={handleDeleteButton}
                                    >
                                        Delete Contact
                                    </Button>
                                </div>
                            </div>
                        )}
                    </form>
                </div>
            </div>
        </div>
    )
} 
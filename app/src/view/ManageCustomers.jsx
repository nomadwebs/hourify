import { useNavigate } from 'react-router-dom'
import { useState, useEffect } from 'react'
import logic from '../logic'

export default function ManageCustomers(props) {
    const [loading, setLoading] = useState(true)
    const [customers, setCustomers] = useState([])
    const navigate = useNavigate()

    useEffect(() => {
        const fetchCustomers = async () => {
            try {
                const customers = await logic.getCustomers()
                setCustomers(customers)
            } catch (error) {
                console.error(error)
            } finally {
                setLoading(false)
            }
        }
        fetchCustomers()
    }, [])

    const handleCustomerPacksClick = (customerId, customerName) => {
        navigate(`/customer-packs/${customerId}`, { state: { customerName } })
    }

    const handleHomeClick = event => {
        event.preventDefault()
        props.onHomeClick()
    }

    if (loading) {
        return (
            <main className="flex flex-col items-center bg-color_backgroundGrey w-full flex-grow pt-12 px-4">
                <h2 className="text-2xl font-bold mb-6">Manage Customers</h2>
                <div className="flex justify-center items-center h-full">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-color_green"></div>
                </div>
            </main>
        )
    }

    if (customers.length === 0) {
        return (
            <main className="flex flex-col items-center bg-color_backgroundGrey w-full flex-grow pt-12 px-4">
                <h2 className="text-2xl font-bold mb-6">Manage Customers</h2>
                <div className="bg-white shadow-md rounded p-6 w-full max-w-4xl">
                    <p>You should create first a pack and assign it to a customer to see this page</p>
                    <br></br>
                    <ul className="list-decimal pl-5">
                        <li>Go Manage packs</li>
                        <li>Clic on create new pack</li>
                        <li>Go to assign pack</li>
                    </ul>
                    <br></br>
                    <hr></hr>
                    <p>After this steps you'll can manage it on this page</p>
                </div>
            </main>
        )
    }

    return (
        <main className="flex flex-col items-center bg-color_backgroundGrey w-full flex-grow pt-12 px-4">
            <h1 className="text-3xl font-bold mb-2">Manage Customers</h1>
            <p className="text-gray-600 mb-6">View and manage your customers</p>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 w-full max-w-6xl">
                {customers.map(customer => (
                    <div
                        key={customer.id}
                        className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300 cursor-pointer border border-transparent hover:border-color_primary"
                        onClick={() => handleCustomerPacksClick(customer.id, customer.name)}
                    >
                        <div className="p-5">
                            <div className="flex justify-between items-start mb-2">
                                <h3 className="text-xl font-semibold text-color_darkBlue truncate">
                                    {customer.name} {customer.surname1 ?? ''}
                                </h3>
                                <span className="inline-block bg-gray-200 text-gray-800 text-sm font-semibold rounded-full px-3 py-1">
                                    {customer.packCount} {customer.packCount === 1 ? 'pack' : 'packs'}
                                </span>
                            </div>

                            <p className="text-gray-600 mb-4 truncate">
                                {customer.email}
                            </p>

                            <button
                                className="w-full bg-color_primary text-white py-2 px-4 rounded-md hover:bg-color_primaryHover transition-colors duration-300 mt-2"
                            >
                                View Customer Packs
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            <a
                href=""
                title="Go back home"
                onClick={handleHomeClick}
                className="mt-8 text-color_primary hover:underline"
            >
                Back to home
            </a>
        </main>
    )
}
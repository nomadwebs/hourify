import { useNavigate } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { Tooltip } from 'react-tooltip'
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
                console.log('customers con mucha info: ', customers)
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
                <h2 className="text-3xl font-bold mb-2">Manage Customers</h2>
                <p className="text-gray-600 mb-6">View and manage your customers</p>
                <div className="bg-white shadow-md rounded-lg p-6 w-full max-w-4xl">
                    <h2 className="text-xl font-semibold text-color_darkBlue mb-4">No Customers Found</h2>
                    <p className="text-gray-600 mb-4">You need to create and assign a pack to a customer to see them here.</p>

                    <div className="bg-gray-50 p-4 rounded-md mb-4">
                        <h3 className="font-medium text-gray-700 mb-2">Follow these steps:</h3>
                        <ol className="list-decimal pl-5 space-y-2 text-gray-600">
                            <li>Go to <span className="font-medium">Manage Packs</span></li>
                            <li>Create a new service pack or select an existing one</li>
                            <li>Use the <span className="font-medium">Assign Pack</span> option to connect it with a customer</li>
                        </ol>
                    </div>

                    <div className="border-t border-gray-200 pt-4 mt-4">
                        <p className="text-gray-600">After assigning packs to customers, you'll be able to manage them from this page.</p>
                    </div>
                </div>
            </main>
        )
    }

    return (
        <main className="flex flex-col items-center bg-color_backgroundGrey w-full flex-grow pt-12 px-4">
            <h1 className="text-3xl font-bold mb-2">Manage Customers</h1>
            <p className="text-gray-600 mb-6">View and manage your customers</p>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 w-full max-w-6xl">
                {customers.map(customer => {
                    const hasPendingPayments = customer.packs?.some(pack => pack.totalDue > 0);
                    const hasLowQuantity = customer.packs?.some(pack => pack.remainingQuantity < 2 && pack.remainingQuantity > 0);
                    const totalByUnit = customer.packs?.reduce(
                        (acc, pack) => {
                            if (!pack.remainingQuantity || isNaN(pack.remainingQuantity)) return acc;
                            const unit = pack.unit === 'hours' ? 'horas' : 'sesiones';
                            acc[unit] = (acc[unit] || 0) + pack.remainingQuantity;
                            return acc;
                        },
                        {}
                    );
                    const isAllOk = !hasPendingPayments && !hasLowQuantity;

                    return (
                        <div
                            key={customer.id}
                            className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300 cursor-pointer border border-transparent hover:border-color_primary"
                            onClick={() => handleCustomerPacksClick(customer.id, customer.name)}
                        >
                            <div className="p-5">
                                <div className="flex justify-between items-start mb-2">
                                    <h3 className="text-xl font-semibold text-color_darkBlue truncate flex items-center gap-2">
                                        {customer.name} {customer.surname1 ?? ''}
                                        {isAllOk && (
                                            <span
                                                data-tooltip-id="tooltip"
                                                data-tooltip-content="All good"
                                                className="text-green-600 text-lg"
                                            >
                                                ✅
                                            </span>
                                        )}

                                        {hasPendingPayments && (
                                            <span
                                                data-tooltip-id="tooltip"
                                                data-tooltip-content="This customer has unpaid packs"
                                                className="text-yellow-500 text-lg"
                                            >
                                                ⚠️
                                            </span>
                                        )}

                                        {hasLowQuantity && (
                                            <span
                                                data-tooltip-id="tooltip"
                                                data-tooltip-content="Less than 2 units remaining in one or more packs"
                                                className="text-orange-500 text-lg"
                                            >
                                                🪫
                                            </span>
                                        )}
                                    </h3>
                                    <span className="inline-block bg-gray-200 text-gray-800 text-sm font-semibold rounded-full px-3 py-1">
                                        {customer.packCount} {customer.packCount === 1 ? 'pack' : 'packs'}
                                    </span>
                                </div>
                                <p className="text-gray-600 mb-4 truncate">
                                    {customer.email}
                                </p>
                                <span>
                                    {totalByUnit && (
                                        <p className="text-sm text-gray-700 mt-1">
                                            {totalByUnit.horas && `🕒 ${totalByUnit.horas.toFixed(1)} horas `}
                                            {totalByUnit.sesiones && `🎯 ${totalByUnit.sesiones.toFixed(0)} sesiones`}
                                        </p>
                                    )}
                                </span>

                                <button
                                    className="w-full bg-color_primary text-white py-2 px-4 rounded-md hover:bg-color_primaryHover transition-colors duration-300 mt-2"
                                >
                                    View Customer Packs
                                </button>
                            </div>
                        </div>
                    );
                })}
                <Tooltip id="tooltip"
                    place="top"
                    className="!bg-white !text-gray-800 !rounded-md !px-3 !py-2 !text-sm !border !border-gray-300 !shadow-md" />
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
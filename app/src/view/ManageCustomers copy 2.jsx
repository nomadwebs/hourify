import { useNavigate } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { Tooltip } from 'react-tooltip'
import logic from '../logic'

export default function ManageCustomers(props) {
    const [loading, setLoading] = useState(true)
    const [customers, setCustomers] = useState([])
    const [viewMode, setViewMode] = useState('grid')
    const [searchQuery, setSearchQuery] = useState('')
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

    const filteredCustomers = customers.filter(customer =>
        customer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        customer.email.toLowerCase().includes(searchQuery.toLowerCase())
    )

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
            <div className="w-full max-w-7xl">
                <div className="flex justify-between items-center mb-6">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-800">Manage Customers</h1>
                        <p className="text-gray-600">View and manage your customers</p>
                    </div>
                    <div className="flex items-center space-x-4">
                        <div className="relative">
                            <input
                                type="text"
                                placeholder="Search customers..."
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
                        {filteredCustomers.map(customer => {
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
                                    className="bg-white cursor-pointer rounded-lg shadow-sm hover:shadow-md transition-all duration-300 border border-gray-100"
                                    onClick={() => handleCustomerPacksClick(customer.id, customer.name)}
                                >
                                    <div className="p-6">
                                        <div className="flex items-start justify-between mb-4">
                                            <div className="flex items-center space-x-3">
                                                <div className="w-12 h-12 rounded-full bg-color_lightGrey flex items-center justify-center">
                                                    <span className="text-lg font-semibold text-color_darkBlue">
                                                        {customer.name.charAt(0)}
                                                    </span>
                                                </div>
                                                <div>
                                                    <h3 className="text-lg font-semibold text-gray-800">
                                                        {customer.name} {customer.surname1 ?? ''}
                                                    </h3>
                                                    <p className="text-sm text-gray-500">{customer.email}</p>
                                                </div>
                                            </div>
                                            <div className="flex items-center space-x-2">
                                                {isAllOk && (
                                                    <span
                                                        data-tooltip-id="tooltip"
                                                        data-tooltip-content="All good"
                                                        className="text-green-600"
                                                    >
                                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                        </svg>
                                                    </span>
                                                )}
                                                {hasPendingPayments && (
                                                    <span
                                                        data-tooltip-id="tooltip"
                                                        data-tooltip-content="This customer has unpaid packs"
                                                        className="text-yellow-500"
                                                    >
                                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                                                        </svg>
                                                    </span>
                                                )}
                                                {hasLowQuantity && (
                                                    <span
                                                        data-tooltip-id="tooltip"
                                                        data-tooltip-content="Less than 2 units remaining in one or more packs"
                                                        className="text-orange-500"
                                                    >
                                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                                                        </svg>
                                                    </span>
                                                )}
                                            </div>
                                        </div>

                                        <div className="space-y-3">
                                            <div className="flex items-center justify-between text-sm">
                                                <span className="text-gray-500">Active Packs</span>
                                                <span className="font-medium text-gray-700">{customer.packCount}</span>
                                            </div>
                                            {totalByUnit && (
                                                <div className="flex items-center justify-between text-sm">
                                                    <span className="text-gray-500">Remaining Units</span>
                                                    <div className="flex items-center space-x-4">
                                                        {totalByUnit.horas && (
                                                            <span className="flex items-center text-gray-700">
                                                                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                                </svg>
                                                                {totalByUnit.horas.toFixed(1)}h
                                                            </span>
                                                        )}
                                                        {totalByUnit.sesiones && (
                                                            <span className="flex items-center text-gray-700">
                                                                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                                                                </svg>
                                                                {totalByUnit.sesiones.toFixed(0)} ses.
                                                            </span>
                                                        )}
                                                    </div>
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
                            );
                        })}
                    </div>
                ) : (
                    <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Active Packs</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Remaining Units</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {filteredCustomers.map(customer => {
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
                                        <tr
                                            key={customer.id}
                                            className="hover:bg-gray-50 cursor-pointer"
                                            onClick={() => handleCustomerPacksClick(customer.id, customer.name)}
                                        >
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="flex items-center">
                                                    <div className="w-10 h-10 rounded-full bg-color_lightGrey flex items-center justify-center">
                                                        <span className="text-sm font-semibold text-color_darkBlue">
                                                            {customer.name.charAt(0)}
                                                        </span>
                                                    </div>
                                                    <div className="ml-4">
                                                        <div className="text-sm font-medium text-gray-900">
                                                            {customer.name} {customer.surname1 ?? ''}
                                                        </div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm text-gray-500">{customer.email}</div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm text-gray-900">{customer.packCount}</div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="flex items-center space-x-4">
                                                    {totalByUnit?.horas && (
                                                        <span className="flex items-center text-sm text-gray-500">
                                                            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                            </svg>
                                                            {totalByUnit.horas.toFixed(1)}h
                                                        </span>
                                                    )}
                                                    {totalByUnit?.sesiones && (
                                                        <span className="flex items-center text-sm text-gray-500">
                                                            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                                                            </svg>
                                                            {totalByUnit.sesiones.toFixed(0)} ses.
                                                        </span>
                                                    )}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="flex items-center space-x-2">
                                                    {isAllOk && (
                                                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                                            All Good
                                                        </span>
                                                    )}
                                                    {hasPendingPayments && (
                                                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                                                            Pending Payment
                                                        </span>
                                                    )}
                                                    {hasLowQuantity && (
                                                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-orange-100 text-orange-800">
                                                            Low Units
                                                        </span>
                                                    )}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                <button className="text-color_darkBlue hover:text-color_lightBlue">
                                                    View Details
                                                </button>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

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
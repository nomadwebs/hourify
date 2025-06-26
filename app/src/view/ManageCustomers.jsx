import { useNavigate } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { Tooltip } from 'react-tooltip'
import logic from '../logic'
import CreateUserByProvider from './components/CreateUserByProvider'
import useContext from './useContext'

export default function ManageCustomers(props) {
    const { alert } = useContext()

    const [loading, setLoading] = useState(true)
    const [customers, setCustomers] = useState([])
    const [invitedUsers, setInvitedUsers] = useState([])
    const [viewMode, setViewMode] = useState('grid')
    const [searchQuery, setSearchQuery] = useState('')
    const [showCreateUser, setShowCreateUser] = useState(false)
    const [resetPasswordConfirm, setResetPasswordConfirm] = useState(null)
    const [resettingPassword, setResettingPassword] = useState(false)
    const navigate = useNavigate()

    const refreshInvitedUsers = async () => {
        try {
            const invitedUsersData = await logic.getCreatedUsers()
            setInvitedUsers(invitedUsersData)
        } catch (error) {
            console.error(error)
        }
    }

    const handleResetPassword = (user) => {
        setResetPasswordConfirm(user)
    }

    const confirmResetPassword = async () => {
        if (!resetPasswordConfirm) return

        setResettingPassword(true)
        try {
            await logic.resetCreatedUserPassword(resetPasswordConfirm.id)
            alert(`Password has been reset successfully and sent to ${resetPasswordConfirm.email}`, 'success')
            setResetPasswordConfirm(null)
        } catch (error) {
            console.error('Error resetting password:', error)
            alert(`Error resetting password: ${error.message}`)
        } finally {
            setResettingPassword(false)
        }
    }

    const cancelResetPassword = () => {
        setResetPasswordConfirm(null)
    }

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [customersData, invitedUsersData] = await Promise.all([
                    logic.getCustomers(),
                    logic.getCreatedUsers()
                ])
                setCustomers(customersData)
                setInvitedUsers(invitedUsersData)
            } catch (error) {
                console.error(error)
            } finally {
                setLoading(false)
            }
        }
        fetchData()
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
        <main className="flex flex-col items-center bg-color_backgroundGrey w-full flex-grow pt-8 lg:pt-12 px-4">
            <div className="w-full max-w-7xl">
                {/* TODO: Componentize PageHeader - This header section could be reusable */}
                <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center mb-6 space-y-4 lg:space-y-0">
                    <div>
                        <h1 className="text-2xl lg:text-3xl font-bold text-gray-800">Manage Customers</h1>
                        <p className="text-sm lg:text-base text-gray-600">View and manage your customers</p>
                    </div>
                    {/* TODO: Componentize SearchAndFilter - This controls section could be its own component */}
                    <div className="flex flex-col sm:flex-row sm:items-center space-y-3 sm:space-y-0 sm:space-x-4">
                        <div className="relative w-full sm:w-auto">
                            <input
                                type="text"
                                placeholder="Search customers..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full sm:w-64 pl-10 pr-4 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-color_darkBlue focus:border-color_darkBlue"
                            />
                            <svg className="w-4 h-4 lg:w-5 lg:h-5 text-gray-400 absolute left-3 top-2.5 lg:top-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                        </div>
                        <div className="flex items-center justify-center sm:justify-start space-x-2 bg-white rounded-lg p-1 border border-gray-200">
                            <button
                                onClick={() => setViewMode('grid')}
                                className={`p-2 rounded-md transition-colors ${viewMode === 'grid' ? 'bg-color_darkBlue text-white' : 'text-gray-600 hover:text-gray-800'}`}
                                title="Grid View"
                            >
                                <svg className="w-4 h-4 lg:w-5 lg:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                                </svg>
                            </button>
                            <button
                                onClick={() => setViewMode('list')}
                                className={`p-2 rounded-md transition-colors ${viewMode === 'list' ? 'bg-color_darkBlue text-white' : 'text-gray-600 hover:text-gray-800'}`}
                                title="List View"
                            >
                                <svg className="w-4 h-4 lg:w-5 lg:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                                </svg>
                            </button>
                        </div>
                    </div>
                </div>

                {/* TODO: Componentize CustomersList - Both grid and list views could be separate components */}
                {viewMode === 'grid' ? (
                    /* TODO: Componentize CustomerCard - Each customer card could be its own component */
                    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 lg:gap-6 mb-8 lg:mb-12">
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
                    /* TODO: Componentize CustomersTable - The table view could be its own component */
                    <div className="bg-white rounded-lg shadow-sm overflow-hidden mb-8 lg:mb-12">
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

                {/* TODO: Componentize InvitedUsersSection - This entire section could be its own component */}
                <div className="mt-8 lg:mt-12">
                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-6 space-y-4 sm:space-y-0">
                        <div>
                            <h2 className="text-xl lg:text-2xl font-bold text-gray-800">Invited Users</h2>
                            <p className="text-sm lg:text-base text-gray-600">Users who have been invited to the platform. Their status will change once they complete their registration.</p>
                        </div>
                        <button
                            onClick={() => setShowCreateUser(true)}
                            className="bg-color_darkBlue text-white px-3 py-2 lg:px-4 lg:py-2 rounded-lg hover:bg-color_lightBlue transition-colors duration-300 flex items-center justify-center space-x-2 text-sm lg:text-base"
                        >
                            <svg className="w-4 h-4 lg:w-5 lg:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                            </svg>
                            <span className="hidden sm:inline">Invite New User</span>
                            <span className="sm:hidden">Invite User</span>
                        </button>
                    </div>

                    {/* TODO: Componentize ModalWrapper - The modal wrapper could be reusable */}
                    {showCreateUser && (
                        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                            <div className="w-full max-w-md max-h-[90vh] overflow-y-auto">
                                <CreateUserByProvider
                                    onUserCreated={() => {
                                        setShowCreateUser(false)
                                        refreshInvitedUsers()
                                    }}
                                />
                            </div>
                        </div>
                    )}

                    {invitedUsers.length > 0 ? (
                        <>
                            {/* TODO: Componentize InvitedUserCard - Each user card could be its own component */}
                            {/* Mobile Card View */}
                            <div className="block lg:hidden space-y-4">
                                {invitedUsers.map(user => (
                                    <div key={user.id} className="bg-white rounded-lg shadow-sm border border-gray-100 p-4">
                                        <div className="flex items-start justify-between mb-3">
                                            <div className="flex items-center space-x-3 flex-1 min-w-0">
                                                <div className="w-10 h-10 rounded-full bg-color_lightGrey flex items-center justify-center flex-shrink-0">
                                                    <span className="text-sm font-semibold text-color_darkBlue">
                                                        {user.name?.charAt(0) || '?'}
                                                    </span>
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <div className="text-sm font-medium text-gray-900 truncate">
                                                        {user.name || 'Pending'}
                                                    </div>
                                                    <div className="text-xs text-gray-500 truncate">
                                                        {user.email}
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="flex-shrink-0">
                                                {user.creationStatus !== 'true' ?
                                                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                                                        Pending
                                                    </span>
                                                    :
                                                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                                        Confirmed
                                                    </span>
                                                }
                                            </div>
                                        </div>

                                        <div className="space-y-2 mb-3">
                                            <div className="flex justify-between text-xs">
                                                <span className="text-gray-500">Username:</span>
                                                <span className="text-gray-700 font-medium">{user.username}</span>
                                            </div>
                                            <div className="flex justify-between text-xs">
                                                <span className="text-gray-500">Invited:</span>
                                                <span className="text-gray-700">
                                                    {new Date(user.createdDate).toLocaleDateString()}
                                                </span>
                                            </div>
                                        </div>

                                        <button
                                            onClick={() => handleResetPassword(user)}
                                            className="w-full bg-color_darkBlue text-white py-2 px-3 rounded-md hover:bg-color_lightBlue transition-colors duration-300 flex items-center justify-center space-x-2 text-sm"
                                        >
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                            </svg>
                                            <span>Reset Password</span>
                                        </button>
                                    </div>
                                ))}
                            </div>

                            {/* TODO: Componentize InvitedUsersTable - The table could be its own component */}
                            {/* Desktop Table View */}
                            <div className="hidden lg:block bg-white rounded-lg shadow-sm overflow-hidden">
                                <div className="overflow-x-auto">
                                    <table className="min-w-full divide-y divide-gray-200">
                                        <thead className="bg-gray-50">
                                            <tr>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Username</th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Invited Date</th>
                                                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody className="bg-white divide-y divide-gray-200">
                                            {invitedUsers.map(user => (
                                                <tr key={user.id} className="hover:bg-gray-50">
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <div className="flex items-center">
                                                            <div className="w-10 h-10 rounded-full bg-color_lightGrey flex items-center justify-center">
                                                                <span className="text-sm font-semibold text-color_darkBlue">
                                                                    {user.name?.charAt(0) || '?'}
                                                                </span>
                                                            </div>
                                                            <div className="ml-4">
                                                                <div className="text-sm font-medium text-gray-900">
                                                                    {user.name || 'Pending'}
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <div className="text-sm text-gray-500">{user.email}</div>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <div className="text-sm text-gray-500">{user.username}</div>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        {user.creationStatus !== 'true' ?
                                                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                                                                Pending Access
                                                            </span>
                                                            :
                                                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                                                Confirmed
                                                            </span>
                                                        }
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <div className="text-sm text-gray-500">
                                                            {new Date(user.createdDate).toLocaleDateString()}
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                        <button
                                                            onClick={() => handleResetPassword(user)}
                                                            className="text-color_darkBlue hover:text-color_lightBlue inline-flex items-center space-x-1"
                                                            title="Reset Password"
                                                        >
                                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                                            </svg>
                                                            <span>Reset Password</span>
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </>
                    ) : (
                        /* TODO: Componentize EmptyState - Empty states could be reusable components */
                        <div className="bg-white rounded-lg shadow-sm p-6 text-center">
                            <p className="text-sm lg:text-base text-gray-600">No invited users yet. Click the button above to invite a new user.</p>
                        </div>
                    )}
                </div>
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

            {/* TODO: Componentize ConfirmationModal - This modal could be reusable across the app */}
            {/* Reset Password Confirmation Modal */}
            {resetPasswordConfirm && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-lg shadow-xl w-full max-w-md mx-4 max-h-[90vh] overflow-y-auto">
                        <div className="p-4 sm:p-6">
                            <div className="flex items-start sm:items-center mb-4">
                                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-red-100 flex items-center justify-center mr-3 sm:mr-4 flex-shrink-0">
                                    <svg className="w-5 h-5 sm:w-6 sm:h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                    </svg>
                                </div>
                                <div className="flex-1 min-w-0">
                                    <h3 className="text-base sm:text-lg font-medium text-gray-900">Reset Password</h3>
                                    <p className="text-xs sm:text-sm text-gray-500">This action cannot be undone</p>
                                </div>
                            </div>

                            <div className="mb-6">
                                <p className="text-sm sm:text-base text-gray-700">
                                    Are you sure you want to reset the password for{' '}
                                    <span className="font-semibold break-words">{resetPasswordConfirm.name}</span>?
                                </p>
                                <p className="text-xs sm:text-sm text-gray-500 mt-1 break-words">
                                    Email: {resetPasswordConfirm.email}
                                </p>
                                <p className="text-xs sm:text-sm text-gray-500 mt-2">
                                    A new password will be generated and sent to their email address.
                                </p>
                            </div>

                            <div className="flex flex-col sm:flex-row sm:justify-end space-y-2 sm:space-y-0 sm:space-x-3">
                                <button
                                    onClick={cancelResetPassword}
                                    disabled={resettingPassword}
                                    className="w-full sm:w-auto px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 order-2 sm:order-1"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={confirmResetPassword}
                                    disabled={resettingPassword}
                                    className="w-full sm:w-auto px-4 py-2 text-sm font-medium text-white bg-red-600 border border-transparent rounded-md hover:bg-red-700 disabled:opacity-50 flex items-center justify-center space-x-2 order-1 sm:order-2"
                                >
                                    {resettingPassword && (
                                        <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white"></div>
                                    )}
                                    <span>{resettingPassword ? 'Resetting...' : 'Reset Password'}</span>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </main>
    )
}
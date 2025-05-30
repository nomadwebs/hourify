import { useParams, useLocation } from 'react-router-dom'
import { useState, useEffect, useRef } from 'react'
import logic from '../logic'

import { errors } from 'com'
import { TagOK, TagWARN, TagKO, TagEXTRA, StatusFilter } from '../library/index'

import { ViewCustomerBoughtPack } from './components'
import { getDecimalToTimeFormat } from '../logic/helpers'

const { SystemError } = errors

export default function CustomerPacks(props) {
    const [view, setView] = useState(false)
    const [selectedPack, setSelectedPack] = useState(null) // Estado para almacenar el pack seleccionado
    const [customerPacks, setCustomerPacks] = useState([])
    const [loading, setLoading] = useState(true) //This is to show the loader as active by default
    const updatePackView = useRef(null)
    const [statusFilter, setStatusFilter] = useState('All')
    const [userDetails, setUserDetails] = useState(null)

    useEffect(() => {
        if (!userDetails) {
            try {
                logic.getUserDetails()
                    .then(setUserDetails)

                    .catch(error => {
                        alert(error.error)
                        console.error(error)
                    })
            } catch (error) {
                alert(error.error)
                console.error(error)
            }
        }
    }, [])
    const customerId = userDetails?.id


    useEffect(() => {
        if (!userDetails) return
        const fetchCustomers = async () => {
            try {
                setLoading(true)
                console.log('user details: ', userDetails)
                const customerPacks = await logic.getCustomerBoughtPacks(customerId)
                const formattedPacks = await formatCustomerPacks(customerPacks)
                setCustomerPacks(formattedPacks)
            } catch (error) {
                console.error(error)
                alert(error.message)
            } finally {
                setLoading(false)
            }
        }
        fetchCustomers()
    }, [customerId])

    useEffect(() => {
        if (view && updatePackView.current) {
            updatePackView.current.scrollIntoView({ behavior: 'smooth', block: 'start' })
        }
    }, [view])


    const handleManageClick = (event, customerPack) => {
        event.preventDefault()
        setSelectedPack(customerPack) //Guarda el basePack en el estado
        setView(view ? null : 'ViewCustomerBoughtPack')
    }

    const handleHomeClick = event => {
        event.preventDefault()
        props.onHomeClick()
    }

    //Función de formateo de los packs
    const formatCustomerPacks = async (packs) => {
        return await Promise.all(
            packs.map(async (pack) => {
                // Formatear remainingQuantity
                let formattedRemaining
                let formattedOriginal
                if (pack.unit === 'hours') {
                    formattedRemaining = await getDecimalToTimeFormat(pack.remainingQuantity)
                    formattedRemaining += ' h'
                    formattedOriginal = await getDecimalToTimeFormat(pack.originalQuantity)
                    formattedOriginal += ' h'
                } else if (pack.unit === 'units') {
                    formattedRemaining = `${pack.remainingQuantity || 0} un.`
                    formattedOriginal = `${pack.remainingQuantity || 0} un.`
                }

                // Formatear fechas
                const formattedPurchaseDate = pack.purchaseDate
                    ? new Date(pack.purchaseDate).toLocaleDateString()
                    : 'N/A'
                const formattedExpiryDate = pack.expiryDate
                    ? new Date(pack.expiryDate).toLocaleDateString()
                    : 'N/A'

                // Formatear precio
                const formattedPrice = `${pack.price || 0} ${pack.currency || ''}`

                // Formatear totalPayments
                const formattedTotalPayments = `${pack.totalPayments || 0} ${pack.currency || ''}`

                return {
                    ...pack,
                    formattedRemaining,
                    formattedOriginal,
                    formattedPurchaseDate,
                    formattedExpiryDate,
                    formattedPrice,
                    formattedTotalPayments,
                }
            })
        )
    }

    // Filter packs by status
    const filteredPacks = customerPacks.filter(pack =>
        statusFilter === 'All' || pack.status === statusFilter
    )

    return (
        <main className="flex flex-col items-center bg-color_backgroundGrey w-full flex-grow pt-12 px-4">
            <h1 className='text-3xl font-bold mb-2'>Bought Services</h1>
            <p className="text-gray-600 mb-6">View your bought services</p>

            {loading ? (
                <div className="flex justify-center items-center h-full">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-color_green"></div>
                </div>
            ) : customerPacks.length === 0 ? (
                <div className="bg-white shadow-md rounded p-6 w-full max-w-4xl">
                    <p className="text-lg text-center">No services found.</p>
                </div>
            ) : (
                <div className="w-full max-w-6xl">
                    <StatusFilter
                        activeFilter={statusFilter}
                        setFilter={setStatusFilter}
                    /* title={`${customerName}'s Packs`} */
                    />

                    {filteredPacks.length === 0 ? (
                        <div className="bg-white shadow-md rounded p-6 text-center">
                            <p className="text-gray-500">No {statusFilter.toLowerCase()} services found for this customer.</p>
                            <button
                                onClick={() => setStatusFilter('All')}
                                className="mt-2 text-color_primary hover:underline"
                            >
                                Show all Services
                            </button>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {filteredPacks.map(customerPack => (
                                <div
                                    key={customerPack.id}
                                    className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300 cursor-pointer border border-transparent hover:border-color_primary"
                                    onClick={(event) => handleManageClick(event, customerPack)}
                                >
                                    <div className="bg-gray-700 text-white py-2 px-4 flex items-center justify-between">
                                        <h3 className="font-semibold truncate">{customerPack.providerName}</h3>
                                        <div className="flex items-center space-x-2">
                                            <a
                                                href={`mailto:${customerPack.providerEmail}`}
                                                title="Send an email"
                                                className="hover:text-color_green transition-colors"
                                                onClick={event => event.stopPropagation()}
                                            >
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-white hover:text-color_green" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8m-18 0a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2V8z" />
                                                </svg>
                                            </a>
                                            <p className="text-xs text-gray-300 truncate">{customerPack.providerEmail}</p>

                                        </div>
                                    </div>
                                    <div className="p-4">
                                        {customerPack.timerActivated && (
                                            <div className="bg-green-50 border-l-4 border-green-500 p-3 mb-3 rounded-r-md animate-pulse">
                                                <div className="flex items-center">
                                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-green-600 mr-2 animate-spin" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                    </svg>
                                                    <span className="text-xs font-semibold text-green-800">Timer Active</span>
                                                </div>
                                                {customerPack.descriptionActivityTemp && (
                                                    <p className="mt-1 text-xs text-gray-700 truncate">
                                                        {customerPack.descriptionActivityTemp}
                                                    </p>
                                                )}
                                            </div>
                                        )}

                                        <div className="flex justify-between items-center mb-2">
                                            <span className="text-sm font-medium text-gray-600">Description:</span>
                                            <span className="font-semibold">{customerPack.description}</span>
                                        </div>

                                        <div className="flex justify-between items-center mb-2">
                                            <span className="text-sm font-medium text-gray-600">Remaining:</span>
                                            <span className="font-semibold">{customerPack.formattedRemaining}</span>
                                        </div>


                                        <div className="grid grid-cols-2 gap-x-2 gap-y-1 mb-4 text-xs text-gray-600">
                                            <span>Purchase Date:</span>
                                            <span className="text-right">{customerPack.formattedPurchaseDate}</span>

                                            <span>Expiry Date:</span>
                                            <span className="text-right">{customerPack.formattedExpiryDate}</span>

                                            <span>Price:</span>
                                            <span className="text-right">{customerPack.formattedPrice}</span>

                                            <span>Paid Amount:</span>
                                            <span className="text-right">{customerPack.formattedTotalPayments}</span>

                                            <span>Payment Method:</span>
                                            <span className="text-right">{customerPack.paymentMethods || 'N/A'}</span>
                                        </div>
                                    </div>

                                    <div className="bg-gray-50 px-4 py-3 border-t flex flex-col gap-2">
                                        <div className="flex justify-between items-center">
                                            <div className="flex items-center">
                                                <span className="text-xs font-medium text-gray-600 mr-2">Pack:</span>
                                                {customerPack.status === 'Active' && (<TagOK>Active</TagOK>)}
                                                {customerPack.status === 'Pending' && (<TagKO>Pending</TagKO>)}
                                                {customerPack.status === 'Expired' && (<TagKO>Expired</TagKO>)}
                                                {customerPack.status === 'Finished' && (<TagKO>Finished</TagKO>)}
                                            </div>
                                            <div className="flex items-center">
                                                <span className="text-xs font-medium text-gray-600 mr-2">Payment:</span>
                                                {customerPack.paymentStatus === 'pending' && (<TagKO>Pending</TagKO>)}
                                                {customerPack.paymentStatus === 'partially payed' && (<TagWARN>Partially Paid</TagWARN>)}
                                                {customerPack.paymentStatus === 'completed' && (<TagOK>Completed</TagOK>)}
                                                {customerPack.paymentStatus === 'payment exceded' && (<TagEXTRA>Payment Exceded</TagEXTRA>)}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )}

            {view === 'ViewCustomerBoughtPack' && selectedPack && (
                <div ref={updatePackView} className="w-full mt-8">
                    <ViewCustomerBoughtPack
                        pack={selectedPack}
                        onCancelClick={() => {
                            setView(null)
                            setSelectedPack(null)
                        }} />
                </div>
            )}

            <a href=""
                title="Go back home"
                onClick={handleHomeClick}
                className="mt-8 text-color_primary hover:underline"
            >
                Back to home
            </a>
        </main>
    )
} 
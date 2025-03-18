import { useState, useEffect } from "react"
import logic from "../logic"

import { Button, TagKO, TagOK, TagEXTRA, TagWARN, StatusFilter } from "../library"
import { useLocation } from 'react-router-dom'

import useContext from './useContext'

import { getDecimalToTimeFormat } from '../logic/helpers'


export default function Home(props) {
    const [name, setName] = useState('')
    const [providerSoldPacks, setProviderSoldPacks] = useState([])
    const [customerBoughtPacks, setCustomerBoughtPacks] = useState([])
    const [soldPacksFilter, setSoldPacksFilter] = useState('All')
    const [boughtPacksFilter, setBoughtPacksFilter] = useState('All')

    const location = useLocation()

    const { alert, confirm } = useContext()

    useEffect(() => {
        if (logic.isUserLoggedIn()) {
            if (!name)
                try {
                    logic.getUserName()
                        .then(setName)
                        .catch(error => {
                            if (error.message === 'jwt expired') {
                                error.message = 'Your session has expired.'
                                alert(error.message)
                                console.error(error.message)
                                localStorage.removeItem('token')
                                navigate('/login')
                            }
                            alert(error.message)
                            console.error(error.message)
                        })
                } catch (error) {
                    alert(error.message)
                    console.error(error)
                }
        } else {
            setName(null)
            //setStats(null)
        }
    }, [location.pathname])


    // Obtener packs vendidos por el proveedor
    useEffect(() => {
        const fetchProviderSoldPacks = async () => {
            try {
                const userId = logic.getUserId()

                if (userId) {
                    const providerSold = await logic.getProviderSoldPacks(userId)
                    const formattedProviderSold = await formatCustomerPacks(providerSold)

                    setProviderSoldPacks(formattedProviderSold)
                } else {
                    console.warn("UserId no encontrado")
                }
            } catch (error) {
                console.error("Error obteniendo userId:", error.message)
                alert(error.message)
            }
        }

        fetchProviderSoldPacks()
    }, [])

    useEffect(() => {
        //console.log("Estado actualizado - providerSoldPacks:", providerSoldPacks)
    }, [providerSoldPacks])



    // Obtener packs comprados por el cliente
    useEffect(() => {
        const fetchCustomerBoughtPacks = async () => {
            try {
                const userId = logic.getUserId()

                if (userId) {
                    const customerBought = await logic.getCustomerBoughtPacks(userId)
                    const formattedcustomerBought = await formatCustomerPacks(customerBought)

                    setCustomerBoughtPacks(formattedcustomerBought)
                } else {
                    console.warn("UserId no encontrado")
                }
            } catch (error) {
                console.error("Error obteniendo userId:", error.message)
                alert(error.message)
            }
        }

        fetchCustomerBoughtPacks()
    }, [])

    useEffect(() => {
        //console.log("Estado actualizado - customerBoughtPacks:", customerBoughtPacks)
    }, [customerBoughtPacks])



    const handleTrackerClick = event => {
        props.onTrackerClick()
    }

    const handleManagePacks = event => {
        props.onManagePacksClick()
    }

    const handleManageCustomers = event => {
        props.onManageCustomersClick()
    }

    /* const handleManagePurchasedPacks = event => {
        props.onManagePurchasedPacksClick()
    } */

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

                /* // Formatear precio
                const formattedPrice = `${pack.price || 0} ${pack.currency || ''}`

                // Formatear totalPayments
                const formattedTotalPayments = `${pack.totalPayments || 0} ${pack.currency || ''}` */

                return {
                    ...pack,
                    formattedRemaining,
                    formattedOriginal,
                    formattedPurchaseDate,
                    formattedExpiryDate,
                    /* formattedPrice,
                    formattedTotalPayments, */
                }
            })
        )

    }

    // Filter functions for pack status
    const filteredSoldPacks = providerSoldPacks.filter(pack =>
        soldPacksFilter === 'All' || pack.status === soldPacksFilter
    )

    const filteredBoughtPacks = customerBoughtPacks.filter(pack =>
        boughtPacksFilter === 'All' || pack.status === boughtPacksFilter
    )

    {
        return (
            <main className="flex flex-col items-center bg-color_backgroundGrey w-full flex-grow p-4 pt-12">

                <header className="w-full max-w-6xl mb-8">
                    <h2 className="text-3xl font-bold text-color_darkBlue mb-2">{`Welcome back, ${name}`}</h2>
                    <p className="text-color_strongGrey mb-6">Here's an overview of your business</p>

                    {/* Stats Dashboard */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                        {/* Active Packs */}
                        <div className="bg-white rounded-lg shadow-md p-4 border-l-4 border-green-500">
                            <div className="flex justify-between items-start">
                                <div>
                                    <p className="text-sm text-gray-500">Active Packs</p>
                                    <p className="text-2xl font-bold">{providerSoldPacks.filter(p => p.status === 'Active').length}</p>
                                </div>
                                <div className="p-2 bg-green-100 rounded-full">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                </div>
                            </div>
                        </div>

                        {/* Earned (placeholder) */}
                        <div className="bg-white rounded-lg shadow-md p-4 border-l-4 border-blue-500">
                            <div className="flex justify-between items-start">
                                <div>
                                    <p className="text-sm text-gray-500">Total Earned</p>
                                    <p className="text-2xl font-bold">0.00€</p>
                                </div>
                                <div className="p-2 bg-blue-100 rounded-full">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                </div>
                            </div>
                        </div>

                        {/* Hours/Units Spent (placeholder) */}
                        <div className="bg-white rounded-lg shadow-md p-4 border-l-4 border-purple-500">
                            <div className="flex justify-between items-start">
                                <div>
                                    <p className="text-sm text-gray-500">Hours Tracked</p>
                                    <p className="text-2xl font-bold">0h</p>
                                </div>
                                <div className="p-2 bg-purple-100 rounded-full">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                </div>
                            </div>
                        </div>

                        {/* Pending Payments (placeholder) */}
                        <div className="bg-white rounded-lg shadow-md p-4 border-l-4 border-yellow-500">
                            <div className="flex justify-between items-start">
                                <div>
                                    <p className="text-sm text-gray-500">Pending Payments</p>
                                    <p className="text-2xl font-bold">0.00€</p>
                                </div>
                                <div className="p-2 bg-yellow-100 rounded-full">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-yellow-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Quick Action Buttons */}
                    <div className="flex flex-wrap gap-3">
                        <button
                            onClick={handleTrackerClick}
                            className="flex items-center text-sm bg-gray-700 hover:bg-gray-800 text-white px-4 py-2 rounded-md transition-colors duration-300"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                            </svg>
                            Track Time
                        </button>
                        <button
                            onClick={handleManagePacks}
                            className="flex items-center text-sm bg-gray-700 hover:bg-gray-800 text-white px-4 py-2 rounded-md transition-colors duration-300"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                                <path d="M4 3a2 2 0 100 4h12a2 2 0 100-4H4z" />
                                <path fillRule="evenodd" d="M3 8h14v7a2 2 0 01-2 2H5a2 2 0 01-2-2V8zm5 3a1 1 0 011-1h2a1 1 0 110 2H9a1 1 0 01-1-1z" clipRule="evenodd" />
                            </svg>
                            Manage Packs
                        </button>
                        <button
                            onClick={handleManageCustomers}
                            className="flex items-center text-sm bg-gray-700 hover:bg-gray-800 text-white px-4 py-2 rounded-md transition-colors duration-300"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                                <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z" />
                            </svg>
                            Manage Customers
                        </button>
                    </div>
                </header>

                {providerSoldPacks.length > 0 && (
                    <div className="w-full max-w-6xl mb-8">
                        <StatusFilter
                            activeFilter={soldPacksFilter}
                            setFilter={setSoldPacksFilter}
                            title="Sold Packs"
                        />

                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                            {filteredSoldPacks.length > 0 ? (
                                filteredSoldPacks.map(pack => (
                                    <div
                                        key={pack.id}
                                        className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300 cursor-pointer border border-transparent hover:border-color_primary"
                                    /* onClick={(event) => handleManageClick(event, pack)} */
                                    >
                                        <div className="bg-gray-700 text-white py-2 px-4">
                                            <h3 className="font-semibold truncate">{pack.customerName}</h3>
                                        </div>
                                        <div className="p-4">
                                            {pack.timerActivated && (
                                                <div className="flex items-center gap-1 bg-green-50 border-l-2 border-green-500 px-2 py-1 mb-2 rounded-sm animate-pulse">
                                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 text-green-600 animate-spin" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                    </svg>
                                                    <span className="text-xs font-medium text-green-800">Timer active</span>
                                                </div>
                                            )}

                                            <div className="flex justify-between items-center mb-1">
                                                <span className="text-sm font-medium text-gray-600">Remaining:</span>
                                                <span className="font-semibold">{pack.formattedRemaining}</span>
                                            </div>



                                            <div className="mb-3 text-sm text-gray-600 line-clamp-2">
                                                {pack.descriptionActivityTemp || pack.description}
                                            </div>

                                            <div className="flex justify-between text-xs text-gray-500 mb-3">
                                                <div>
                                                    <div>Purchase: {pack.formattedPurchaseDate}</div>
                                                    <div>Expires: {pack.formattedExpiryDate}</div>
                                                </div>
                                                <div className="flex items-start">
                                                    {pack.status === 'Active' && (<TagOK>Active</TagOK>)}
                                                    {pack.status === 'Pending' && (<TagKO>Pending</TagKO>)}
                                                    {pack.status === 'Expired' && (<TagKO>Expired</TagKO>)}
                                                    {pack.status === 'Finished' && (<TagKO>Finished</TagKO>)}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="col-span-full py-8 text-center text-gray-500">
                                    No {soldPacksFilter.toLowerCase()} packs found.
                                    <button
                                        onClick={() => setSoldPacksFilter('All')}
                                        className="ml-2 text-color_primary hover:underline"
                                    >
                                        Show all packs
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                )}


                {customerBoughtPacks.length > 0 && (
                    <div className="w-full max-w-6xl">
                        <StatusFilter
                            activeFilter={boughtPacksFilter}
                            setFilter={setBoughtPacksFilter}
                            title="Acquired Packs"
                        />

                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                            {filteredBoughtPacks.length > 0 ? (
                                filteredBoughtPacks.map(pack => (
                                    <div
                                        key={pack.id}
                                        className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300 cursor-pointer border border-transparent hover:border-color_primary"
                                    /* onClick={(event) => handleManageClick(event, pack)} */
                                    >
                                        <div className="bg-gray-600 text-white py-2 px-4">
                                            <h3 className="font-semibold truncate">{pack.providerName}</h3>
                                        </div>
                                        <div className="p-4">
                                            <div className="flex justify-between items-center mb-1">
                                                <span className="text-sm font-medium text-gray-600">Remaining:</span>
                                                <span className="font-semibold">{pack.formattedRemaining}</span>
                                            </div>

                                            {pack.timerActivated && (
                                                <div className="flex items-center gap-1 bg-green-50 border-l-2 border-green-500 px-2 py-1 mb-2 rounded-sm animate-pulse">
                                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 text-green-600 animate-spin" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                    </svg>
                                                    <span className="text-xs font-medium text-green-800">Timer active</span>
                                                </div>
                                            )}

                                            <div className="mb-3 text-sm text-gray-600 line-clamp-2">
                                                {pack.descriptionActivityTemp || pack.description}
                                            </div>

                                            <div className="flex justify-between text-xs text-gray-500">
                                                <div>
                                                    <div>Purchase: {pack.formattedPurchaseDate}</div>
                                                    <div>Expires: {pack.formattedExpiryDate}</div>
                                                </div>
                                                <div className="flex items-start">
                                                    {pack.status === 'Active' && (<TagOK>Active</TagOK>)}
                                                    {pack.status === 'Pending' && (<TagKO>Pending</TagKO>)}
                                                    {pack.status === 'Expired' && (<TagKO>Expired</TagKO>)}
                                                    {pack.status === 'Finished' && (<TagKO>Finished</TagKO>)}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="col-span-full py-8 text-center text-gray-500">
                                    No {boughtPacksFilter.toLowerCase()} packs found.
                                    <button
                                        onClick={() => setBoughtPacksFilter('All')}
                                        className="ml-2 text-color_primary hover:underline"
                                    >
                                        Show all packs
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                )}

            </main>
        )
    }
}
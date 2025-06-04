import { useState, useEffect } from 'react'
import logic from '../logic/index.js'

import { TagKO, TagOK, TagEXTRA, TagWARN, StatusFilter, PackCard } from '../library'
import { StatCard } from './components/index.js'
import { useLocation } from 'react-router-dom'

import useContext from './useContext'

import { getDecimalToTimeFormat } from '../logic/helpers'

export default function Home(props) {
    const [name, setName] = useState('')
    const [userDetails, setUserDetails] = useState({})
    const [providerSoldPacks, setProviderSoldPacks] = useState([])
    const [customerBoughtPacks, setCustomerBoughtPacks] = useState([])
    const [monthEarned, setMonthEarned] = useState([])
    const [monthPayments, setMonthPayments] = useState([])
    const [monthHoursTracked, setMonthHoursTracked] = useState([])
    const [monthUnitsTracked, setMonthUnitsTracked] = useState([])
    const [soldPacksFilter, setSoldPacksFilter] = useState('All')
    const [boughtPacksFilter, setBoughtPacksFilter] = useState('All')

    const location = useLocation()

    const { alert, confirm } = useContext()

    useEffect(() => {
        try {
            logic.getUserDetails()
                .then(setUserDetails)
                .catch(error => {
                    alert(error.message)
                    console.error(error)
                })

        } catch (error) {
            alert(error.message)
            console.error(error)
        }
    }, [])
    console.log(userDetails)

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
                    console.warn('UserId no encontrado')
                }
            } catch (error) {
                console.error('Error obteniendo userId:', error.message)
                alert(error.message)
            }
        }
        fetchProviderSoldPacks()
    }, [])

    // Obtener importe vendido del mes actual
    useEffect(() => {
        const fetchMonthEarned = async () => {
            try {
                const userId = logic.getUserId()

                if (userId) {
                    const userMonthEarnings = await logic.getMonthEarned(userId)

                    setMonthEarned(userMonthEarnings)
                } else {
                    console.warn('UserId no encontrado')
                }
            } catch (error) {
                console.error('Error obteniendo userId:', error.message)
                alert(error.message)
            }
        }
        fetchMonthEarned()
    }, [])

    // Obtain amount about monthly payments received
    useEffect(() => {
        const fetchMonthPayments = async () => {
            try {
                const userId = logic.getUserId()
                if (userId) {
                    const userMonthPayments = await logic.getMonthPayments(userId)

                    setMonthPayments(userMonthPayments)
                } else {
                    console.warn('UserId not found')
                }
            } catch (error) {
                console.error('Error obteniendo userId:', error.message)
                alert(error.message)
            }
        }
        fetchMonthPayments()
    }, [])

    // Obtain month hours tracked
    useEffect(() => {
        const fetchMonthHoursTracked = async () => {
            try {
                const userId = logic.getUserId()
                if (userId) {
                    const userMonthHoursTracked = await logic.getMonthHoursTracked(userId)

                    setMonthHoursTracked(userMonthHoursTracked)
                } else {
                    console.warn('UserId not found')
                }
            } catch (error) {
                console.error('Error obteniendo userId:', error.message)
                alert(error.message)
            }
        }
        fetchMonthHoursTracked()
    }, [])

    // Obtain month units tracked
    useEffect(() => {
        const fetchMonthUnitsTracked = async () => {
            try {
                const userId = logic.getUserId()
                if (userId) {
                    const userMonthUnitsTracked = await logic.getMonthUnitsTracked(userId)

                    setMonthUnitsTracked(userMonthUnitsTracked)
                } else {
                    console.warn('UserId not found')
                }
            } catch (error) {
                console.error('Error obteniendo userId:', error.message)
                alert(error.message)
            }
        }
        fetchMonthUnitsTracked()
    }, [])


    //Obtain pending monthly payments
    const monthPendingPayments = logic.usePendingPayments(monthEarned, monthPayments)

    useEffect(() => {
        //console.log('Estado actualizado - providerSoldPacks:', providerSoldPacks)
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
                    console.warn('UserId no encontrado')
                }
            } catch (error) {
                console.error('Error obteniendo userId:', error.message)
                alert(error.message)
            }
        }

        fetchCustomerBoughtPacks()
    }, [])

    useEffect(() => {
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

    const handleManagePurchasedPacks = event => {
        props.onManagePurchasedPacksClick()
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
            <main className='flex flex-col items-center bg-color_backgroundGrey w-full flex-grow p-4 pt-12'>

                <header className='w-full max-w-6xl mb-8'>
                    <h2 className='text-3xl font-bold text-color_darkBlue mb-2'>{`Welcome back, ${name}`}</h2>

                    {providerSoldPacks.length > 0 && (
                        <>
                            <p className='text-color_strongGrey mb-6'>Here's an overview of your business</p>

                            {/* Stats Dashboard */}
                            <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6'>
                                <StatCard
                                    label='Active Packs'
                                    value={providerSoldPacks.filter(p => p.status === 'Active').length}
                                    icon={
                                        <svg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='currentColor'>
                                            <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z' />
                                        </svg>
                                    }
                                    borderColor='border-green-500'
                                    bgColor='bg-green-100'
                                    iconColor='text-green-600'
                                />

                                <StatCard
                                    label='Month Earned'
                                    value={monthEarned ? logic.formatCurrencyES(monthEarned) : logic.formatCurrencyES(0)}
                                    icon={
                                        <svg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='currentColor'>
                                            <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z' />
                                        </svg>
                                    }
                                    borderColor='border-blue-500'
                                    bgColor='bg-blue-100'
                                    iconColor='text-blue-600'
                                />

                                {/* Payments received */}
                                <StatCard
                                    label='Payments'
                                    value={monthPayments ? logic.formatCurrencyES(monthPayments) : logic.formatCurrencyES(0)}
                                    icon={
                                        <svg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='currentColor'>
                                            <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z' />
                                        </svg>
                                    }
                                    borderColor='border-yellow-500'
                                    bgColor='bg-yellow-100'
                                    iconColor='text-yellow-600'
                                />

                                <StatCard
                                    label='Pending Payments'
                                    value={monthPendingPayments ? logic.formatCurrencyES(monthPendingPayments) : logic.formatCurrencyES(0)}
                                    icon={
                                        <svg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='currentColor'>
                                            <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z' />
                                        </svg>
                                    }
                                    borderColor='border-red-500'
                                    bgColor='bg-red-100'
                                    iconColor='text-red-600'
                                />

                                <StatCard
                                    label='Hours Tracked'
                                    value={monthHoursTracked
                                        ? logic.getDecimalToTimeFormat(monthHoursTracked) + 'h'
                                        : '0h'}
                                    icon={
                                        <svg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='currentColor'>
                                            <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z' />
                                        </svg>
                                    }
                                    borderColor='border-purple-500'
                                    bgColor='bg-purple-100'
                                    iconColor='text-purple-600'
                                />

                                <StatCard
                                    label='Units/Sesions Tracked'
                                    value={monthUnitsTracked
                                        ? monthUnitsTracked + ' un.'
                                        : '0'}
                                    icon={
                                        <svg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' strokeWidth='1.5' stroke='currentColor' className='size-6'>
                                            <path strokeLinecap='round' strokeLinejoin='round' d='M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.325.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 0 1 1.37.49l1.296 2.247a1.125 1.125 0 0 1-.26 1.431l-1.003.827c-.293.241-.438.613-.43.992a7.723 7.723 0 0 1 0 .255c-.008.378.137.75.43.991l1.004.827c.424.35.534.955.26 1.43l-1.298 2.247a1.125 1.125 0 0 1-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.47 6.47 0 0 1-.22.128c-.331.183-.581.495-.644.869l-.213 1.281c-.09.543-.56.94-1.11.94h-2.594c-.55 0-1.019-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 0 1-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 0 1-1.369-.49l-1.297-2.247a1.125 1.125 0 0 1 .26-1.431l1.004-.827c.292-.24.437-.613.43-.991a6.932 6.932 0 0 1 0-.255c.007-.38-.138-.751-.43-.992l-1.004-.827a1.125 1.125 0 0 1-.26-1.43l1.297-2.247a1.125 1.125 0 0 1 1.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.086.22-.128.332-.183.582-.495.644-.869l.214-1.28Z' />
                                            <path strokeLinecap='round' strokeLinejoin='round' d='M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z' />
                                        </svg>
                                    }
                                    borderColor='border-fuchsia-500'
                                    bgColor='bg-fuchsia-100'
                                    iconColor='text-fuchsia-600'
                                />
                            </div>
                        </>
                    )}

                    {/* Quick Action Buttons */}
                    <div className='flex flex-wrap gap-3'>
                        {providerSoldPacks.length > 0 && (
                            <>
                                <button
                                    onClick={handleTrackerClick}
                                    className='flex items-center text-sm bg-gray-700 hover:bg-gray-800 text-white px-4 py-2 rounded-md transition-colors duration-300'
                                >
                                    <svg xmlns='http://www.w3.org/2000/svg' className='h-5 w-5 mr-2' viewBox='0 0 20 20' fill='currentColor'>
                                        <path fillRule='evenodd' d='M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z' clipRule='evenodd' />
                                    </svg>
                                    Track Time
                                </button>

                                <button
                                    onClick={handleManageCustomers}
                                    className='flex items-center text-sm bg-gray-700 hover:bg-gray-800 text-white px-4 py-2 rounded-md transition-colors duration-300'
                                >
                                    <svg xmlns='http://www.w3.org/2000/svg' className='h-5 w-5 mr-2' viewBox='0 0 20 20' fill='currentColor'>
                                        <path d='M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z' />
                                    </svg>
                                    Manage Customers
                                </button>
                            </>

                        )}

                        <button
                            onClick={handleManagePacks}
                            className='flex items-center text-sm bg-gray-700 hover:bg-gray-800 text-white px-4 py-2 rounded-md transition-colors duration-300'
                        >
                            <svg xmlns='http://www.w3.org/2000/svg' className='h-5 w-5 mr-2' viewBox='0 0 20 20' fill='currentColor'>
                                <path d='M4 3a2 2 0 100 4h12a2 2 0 100-4H4z' />
                                <path fillRule='evenodd' d='M3 8h14v7a2 2 0 01-2 2H5a2 2 0 01-2-2V8zm5 3a1 1 0 011-1h2a1 1 0 110 2H9a1 1 0 01-1-1z' clipRule='evenodd' />
                            </svg>
                            My Services
                        </button>

                        {customerBoughtPacks.length > 0 && (
                            <button
                                onClick={handleManagePurchasedPacks}
                                className='flex items-center text-sm bg-gray-700 hover:bg-gray-800 text-white px-4 py-2 rounded-md transition-colors duration-300'
                            >
                                <svg xmlns='http://www.w3.org/2000/svg' className='h-5 w-5 mr-2' viewBox='0 0 20 20' fill='currentColor'>
                                    <path d='M4 3a2 2 0 100 4h12a2 2 0 100-4H4z' />
                                    <path fillRule='evenodd' d='M3 8h14v7a2 2 0 01-2 2H5a2 2 0 01-2-2V8zm5 3a1 1 0 011-1h2a1 1 0 110 2H9a1 1 0 01-1-1z' clipRule='evenodd' />
                                </svg>
                                Bought Services
                            </button>
                        )}

                    </div>
                </header>

                {providerSoldPacks.length > 0 && (
                    <div className='w-full max-w-6xl mb-8'>
                        <StatusFilter
                            activeFilter={soldPacksFilter}
                            setFilter={setSoldPacksFilter}
                            title='Sold Packs'
                        />

                        <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4'>
                            {filteredSoldPacks.length > 0 ? (
                                filteredSoldPacks.map(pack => (
                                    <PackCard
                                        key={pack.id}
                                        id={pack.id}
                                        customerName={pack.customerName}
                                        originalQuantity={pack.originalQuantity}
                                        remainingQuantity={pack.remainingQuantity}
                                        formattedRemaining={pack.formattedRemaining}
                                        description={pack.description}
                                        descriptionActivityTemp={pack.descriptionActivityTemp}
                                        formattedPurchaseDate={pack.formattedPurchaseDate}
                                        formattedExpiryDate={pack.formattedExpiryDate}
                                        status={pack.status}
                                        timerActivated={pack.timerActivated}
                                    />
                                ))
                            ) : (
                                <div className='col-span-full py-8 text-center text-gray-500'>
                                    No {soldPacksFilter.toLowerCase()} packs found.
                                    <button
                                        onClick={() => setSoldPacksFilter('All')}
                                        className='ml-2 text-color_primary hover:underline'
                                    >
                                        Show all packs
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                )
                }


                {
                    customerBoughtPacks.length > 0 && (

                        <div className='w-full max-w-6xl'>
                            <StatusFilter
                                activeFilter={boughtPacksFilter}
                                setFilter={setBoughtPacksFilter}
                                title='Acquired Packs'
                            />

                            <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4'>
                                {filteredBoughtPacks.length > 0 ? (
                                    filteredBoughtPacks.map(pack => (
                                        <div
                                            key={pack.id}
                                            className='bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300 cursor-pointer border border-transparent hover:border-color_primary'
                                        /* onClick={(event) => handleManageClick(event, pack)} */
                                        >
                                            <div className='bg-gray-600 text-white py-2 px-4'>
                                                <h3 className='font-semibold truncate'>{pack.providerName}</h3>
                                            </div>
                                            <div className='p-4'>
                                                <div className='flex justify-between items-center mb-1'>
                                                    <span className='text-sm font-medium text-gray-600'>Remaining:</span>
                                                    <span className='font-semibold'>{pack.formattedRemaining}</span>
                                                </div>

                                                <div className='relative w-full h-2 bg-gray-200 rounded-full mb-3 overflow-hidden'>
                                                    <div
                                                        className='absolute top-0 left-0 h-full  bg-purple-500 transition-all duration-300'
                                                        style={{
                                                            width: `${Math.max(0, Math.min(100, (pack.remainingQuantity / pack.originalQuantity) * 100))}%`,
                                                            minWidth: '2px'
                                                        }}
                                                    ></div>
                                                </div>

                                                {pack.timerActivated && (
                                                    <div className='flex items-center gap-1 bg-green-50 border-l-2 border-green-500 px-2 py-1 mb-2 rounded-sm animate-pulse'>
                                                        <svg xmlns='http://www.w3.org/2000/svg' className='h-3 w-3 text-green-600 animate-spin' fill='none' viewBox='0 0 24 24' stroke='currentColor'>
                                                            <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z' />
                                                        </svg>
                                                        <span className='text-xs font-medium text-green-800'>Timer active</span>
                                                    </div>
                                                )}

                                                <div className='mb-3 text-sm text-gray-600 line-clamp-2'>
                                                    {pack.descriptionActivityTemp || pack.description}
                                                </div>

                                                <div className='flex justify-between text-xs text-gray-500'>
                                                    <div>
                                                        <div>Purchase: {pack.formattedPurchaseDate}</div>
                                                        <div>Expires: {pack.formattedExpiryDate}</div>
                                                    </div>
                                                    <div className='flex items-start'>
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
                                    <div className='col-span-full py-8 text-center text-gray-500'>
                                        No {boughtPacksFilter.toLowerCase()} packs found.
                                        <button
                                            onClick={() => setBoughtPacksFilter('All')}
                                            className='ml-2 text-color_primary hover:underline'
                                        >
                                            Show all packs
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                    )
                }

            </main >
        )
    }
}
import { useState, useEffect } from "react"
import logic from "../logic"

import { Button, TagKO, TagOK, TagEXTRA, TagWARN } from "../library"
import { useLocation } from 'react-router-dom'

import useContext from './useContext'

import { getDecimalToTimeFormat } from '../logic/helpers'


export default function Home(props) {
    const [name, setName] = useState('')
    const [providerSoldPacks, setProviderSoldPacks] = useState([])
    const [customerBoughtPacks, setCustomerBoughtPacks] = useState([])

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

    {
        return (
            <main className="flex flex-col items-center bg-color_backgroundGrey w-full flex-grow p-4 pt-12">

                <header className="mb-8 text-center ">
                    <h2 className="text-3xl font-bold text-color_darkBlue mb-2">{`Welcome, ${name}`}</h2>
                    <p className="text-color_strongGrey">Here are your stats and options to manage your business</p>
                </header>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 w-full max-w-4xl justify-items-center">
                    <Button className="bg-color_green hover:bg-color_greenDark text-white" onClick={handleTrackerClick}>Start tracking</Button>
                    <Button className="bg-color_green hover:bg-color_greenDark text-white" onClick={handleManagePacks}>Manage your packs</Button>
                    <Button className="bg-color_green hover:bg-color_greenDark text-white" onClick={handleManageCustomers}>Manage your customers</Button>
                    {/* <Button className="bg-color_green hover:bg-color_greenDark text-white" onClick={handleManagePurchasedPacks}>See purchased services</Button> */}
                    {/* <Button className="bg-color_green hover:bg-color_greenDark text-white">Settings</Button> */}
                </div>

                <h2 className="text-3xl font-bold text-color_darkBlue mb-2">Sold Packs</h2>
                <p className="text-color_strongGrey">List of Sold Packs</p>

                <table className="table-auto mt-4 w-[80%] bg-white text-black rounded-md">
                    <thead>
                        <tr className='bg-amarilloCanario'>
                            <th className="border px-4 py-2">Customer</th>
                            <th className="border px-4 py-2">Pack description</th>
                            <th className="border px-4 py-2">Remaining</th>
                            <th className="border px-4 py-2">Purchase date</th>
                            <th className="border px-4 py-2">Expire date</th>
                            <th className="border px-4 py-2">Status</th>
                            {/* <th className="border px-4 py-2">Payment Status</th> */}
                        </tr>
                    </thead>
                    <tbody>
                        {providerSoldPacks.map(providerSoldPack => (

                            < tr key={providerSoldPack.id} className="cursor-pointer hover:bg-gray-100"
                                /* onClick={(event) => handleManageClick(event, providerSoldPack)} */>

                                <td className='border px-4 py-2'>{providerSoldPack.customerName}</td>
                                <td className='border px-4 py-2'>{providerSoldPack.description}</td>
                                <td className='border px-4 py-2'>{providerSoldPack.formattedRemaining}</td>
                                <td className='border px-4 py-2'>{providerSoldPack.formattedPurchaseDate}</td>
                                <td className='border px-4 py-2'>{providerSoldPack.formattedExpiryDate}</td>
                                {/* 'Pending', 'Active', 'Expired', 'Finished' */}

                                <td className="border px-4 py-2">
                                    {providerSoldPack.status === 'Active' && (<TagOK>Active</TagOK>)}
                                    {providerSoldPack.status === 'Pending' && (<TagKO>Pending</TagKO>)}
                                    {providerSoldPack.status === 'Expired' && (<TagKO>Expired</TagKO>)}
                                    {providerSoldPack.status === 'Finished' && (<TagKO>Finished</TagKO>)}
                                </td>

                                {/*  <td className="border px-4 py-2">
                                    {providerSoldPack.paymentStatus === 'pending' && (<TagKO>Pending</TagKO>)}
                                    {providerSoldPack.paymentStatus === 'partially payed' && (<TagWARN>Partially Paid</TagWARN>)}
                                    {providerSoldPack.paymentStatus === 'completed' && (<TagOK>Completed</TagOK>)}
                                    {providerSoldPack.paymentStatus === 'payment exceded' && (<TagEXTRA>Payment Exceded</TagEXTRA>)}
                                </td> */}
                            </tr>
                        ))}
                    </tbody>

                    {/* {view === 'UpdateCustomerPack' && selectedPack && (
                        <tr ref={updatePackView}>
                            <td colSpan="10" className="border px-4 py-2">
                                <UpdateCustomerPack
                                    pack={selectedPack}
                                    onUpdated={handlePackUpdated}
                                    onPaymentAdded={handlePackUpdated}
                                    onPaymentDeleted={handlePackUpdated}
                                    onCancelClick={() => {
                                        setView(null)
                                        setSelectedPack(null)
                                    }} />
                            </td>
                        </tr>
                    )} */}
                </table>

                <br />
                <br />
                <br />
                <h2 className="text-3xl font-bold text-color_darkBlue mb-2">Adquired Packs</h2>
                <p className="text-color_strongGrey">List of bought packs</p>

                <table className="table-auto mt-4 w-[80%] bg-white text-black rounded-md">
                    <thead>
                        <tr className='bg-amarilloCanario'>
                            <th className="border px-4 py-2">Provider</th>
                            <th className="border px-4 py-2">Pack description</th>
                            <th className="border px-4 py-2">Remaining</th>
                            <th className="border px-4 py-2">Purchase date</th>
                            <th className="border px-4 py-2">Expire date</th>
                            <th className="border px-4 py-2">Status</th>
                            {/* <th className="border px-4 py-2">Payment Status</th> */}
                        </tr>
                    </thead>
                    <tbody>
                        {customerBoughtPacks.map(customerBoughtPack => (

                            < tr key={customerBoughtPack.id} className="cursor-pointer hover:bg-gray-100"
                                /* onClick={(event) => handleManageClick(event, providerSoldPack)} */>

                                <td className='border px-4 py-2'>{customerBoughtPack.providerName}</td>
                                <td className='border px-4 py-2'>{customerBoughtPack.description}</td>
                                <td className='border px-4 py-2'>{customerBoughtPack.formattedRemaining}</td>
                                <td className='border px-4 py-2'>{customerBoughtPack.formattedPurchaseDate}</td>
                                <td className='border px-4 py-2'>{customerBoughtPack.formattedExpiryDate}</td>
                                {/* 'Pending', 'Active', 'Expired', 'Finished' */}

                                <td className="border px-4 py-2">
                                    {customerBoughtPack.status === 'Active' && (<TagOK>Active</TagOK>)}
                                    {customerBoughtPack.status === 'Pending' && (<TagKO>Pending</TagKO>)}
                                    {customerBoughtPack.status === 'Expired' && (<TagKO>Expired</TagKO>)}
                                    {customerBoughtPack.status === 'Finished' && (<TagKO>Finished</TagKO>)}
                                </td>

                                {/*  <td className="border px-4 py-2">
                                    {customerBoughtPack.paymentStatus === 'pending' && (<TagKO>Pending</TagKO>)}
                                    {customerBoughtPack.paymentStatus === 'partially payed' && (<TagWARN>Partially Paid</TagWARN>)}
                                    {customerBoughtPack.paymentStatus === 'completed' && (<TagOK>Completed</TagOK>)}
                                    {customerBoughtPack.paymentStatus === 'payment exceded' && (<TagEXTRA>Payment Exceded</TagEXTRA>)}
                                </td> */}
                            </tr>
                        ))}
                    </tbody>

                    {/* {view === 'UpdateCustomerPack' && selectedPack && (
                        <tr ref={updatePackView}>
                            <td colSpan="10" className="border px-4 py-2">
                                <UpdateCustomerPack
                                    pack={selectedPack}
                                    onUpdated={handlePackUpdated}
                                    onPaymentAdded={handlePackUpdated}
                                    onPaymentDeleted={handlePackUpdated}
                                    onCancelClick={() => {
                                        setView(null)
                                        setSelectedPack(null)
                                    }} />
                            </td>
                        </tr>
                    )} */}
                </table>

            </main>
        )
    }
}
import { useState, useEffect, useRef } from 'react'
import logic from '../logic'

import { errors } from 'com'
import { Button } from '../library/index'
import { getCurrencySymbol } from '../util'

import useContext from './useContext'

import { UpdateBasePack } from './components'

const { SystemError } = errors

export default function ManagePacks(props) {
    let [loading, setLoading] = useState(true)
    const { alert, confirm } = useContext()
    const [view, setView] = useState(false)
    const [selectedBasePack, setSelectedBasePack] = useState(null)
    const updateBasePackView = useRef(null)

    useEffect(() => {
        const fetchBasePacks = async () => {
            try {
                setLoading(true)
                const basePacks = await logic.getBasePacks()
                setPacks(basePacks)
            } catch (error) {
                //alert(error.message)
                console.error(error)
            } finally {
                setLoading(false)
            }
        }
        fetchBasePacks()
    }, [])

    useEffect(() => {
        if (view && updateBasePackView.current) {
            updateBasePackView.current.scrollIntoView({ behavior: 'smooth', block: 'start' })
        }
    }, [view])

    const handleDeleteClick = (event, basePackId) => {
        event.preventDefault()
        if (event) event.stopPropagation()
        confirm('Do you want delete this item? -This action can\'t be reversed', accepted => {
            if (accepted) {
                try {
                    logic.deleteBasePack(basePackId)
                        .then(() => {
                            alert('Pack deleted successfully', 'success')
                            setPacks(prevPacks => prevPacks.filter(pack => pack.id !== basePackId))
                        })
                        .catch(error => {
                            alert(error.message)
                            console.error(error)
                        })
                } catch (error) {
                    alert(error.message)
                    console.error(error)
                }
            }
        }, 'warn')
    }

    const handleUpdateClick = (event, basePack) => {
        event.preventDefault()
        if (event) event.stopPropagation()
        setSelectedBasePack(basePack) //Guarda el basePack en el estado
        setView(view ? null : 'UpdateBasePack')
    }

    const handleHomeClick = event => {
        event.preventDefault()
        props.onHomeClick()
    }

    const handleCancelClick = () => {
        setView(null) // Oculta el componente UpdateBasePack
        setSelectedBasePack(null) // Limpia el estado seleccionado
    }

    const handleAssignPacks = event => {
        props.onAssignPackClick()
    }

    const handleCreatePacks = event => {
        props.onCreatePackClick()
    }

    const handleUpdated = async () => {
        setView(null)
        setSelectedBasePack(null)

        try {
            setLoading = true
            const updatedBasePacks = await logic.getBasePacks()
            setPacks(updatedBasePacks)
            alert("Base pack updated successfully!", "success") // Muestra el mensaje de éxito
        } catch (error) {
            alert(error.message) // Muestra un mensaje en caso de error
            console.error(error)
        } finally {
            setLoading(false)
        }
    }

    const [basePacks, setPacks] = useState([])

    return (
        <main className="flex flex-col items-center bg-color_backgroundGrey w-full flex-grow pt-12 px-4">
            <h1 className="text-3xl font-bold mb-2">My Services</h1>
            <p className="text-gray-600 mb-6">Create, edit, and assign your services</p>

            {/* Quick Action Buttons */}
            <div className="flex flex-wrap gap-3 mb-8 w-full max-w-6xl">
                {basePacks.length !== 0 && (
                    <button
                        onClick={handleAssignPacks}
                        className="flex items-center text-sm bg-gray-700 hover:bg-gray-800 text-white px-4 py-2 rounded-md transition-colors duration-300"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                            <path d="M8 9a3 3 0 100-6 3 3 0 000 6zM8 11a6 6 0 016 6H2a6 6 0 016-6zM16 7a1 1 0 10-2 0v1h-1a1 1 0 100 2h1v1a1 1 0 102 0v-1h1a1 1 0 100-2h-1V7z" />
                        </svg>
                        Assign Service
                    </button>
                )}
                <button
                    onClick={handleCreatePacks}
                    className="flex items-center text-sm bg-gray-700 hover:bg-gray-800 text-white px-4 py-2 rounded-md transition-colors duration-300"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                    </svg>
                    Create New Service
                </button>
            </div>

            {loading ? (
                <div className="flex justify-center items-center h-full">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-color_green"></div>
                </div>
            ) : basePacks.length === 0 ? (
                <div className="bg-white shadow-md rounded-lg p-6 w-full max-w-4xl">
                    <h2 className="text-xl font-semibold text-color_darkBlue mb-4">No Services Available</h2>
                    <p className="text-gray-600 mb-4">You haven't created any service yet.</p>

                    <div className="bg-gray-50 p-4 rounded-md mb-4">
                        <h3 className="font-medium text-gray-700 mb-2">Getting Started:</h3>
                        <ol className="list-decimal pl-5 space-y-2 text-gray-600">
                            <li>Click the <span className="font-medium">"Create New Service"</span> button above</li>
                            <li>Define your service details (name, price, quantity, hours, units, etc.)</li>
                            <li>Save your service to make it available for assignment to customers</li>
                        </ol>
                    </div>

                    <div className="border-t border-gray-200 pt-4 mt-4">
                        <p className="text-gray-600">Service packs allow you to define your offerings and track time or units for customers.</p>
                    </div>
                </div>
            ) : (
                <>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 w-full max-w-6xl">
                        {basePacks.map(basePack => (
                            <div
                                key={basePack.id}
                                className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-all duration-300 border border-transparent hover:border-color_primary"
                            >
                                <div className="bg-gray-700 text-white py-2 px-4">
                                    <h3 className="font-semibold truncate">{basePack.packName}</h3>
                                </div>
                                <div className="p-4">
                                    <div className="mb-3 text-sm text-gray-600 line-clamp-2">
                                        {basePack.description}
                                    </div>
                                    <div className="grid grid-cols-2 gap-x-2 gap-y-1 mb-3 text-sm">
                                        <span className="text-gray-600 font-medium">Price:</span>
                                        <span className="text-right font-semibold">{basePack.price} {getCurrencySymbol(basePack)}</span>

                                        <span className="text-gray-600 font-medium">Quantity:</span>
                                        <span className="text-right font-semibold">{basePack.quantity} {basePack.unit === 'units' ? 'un' : 'h'}</span>

                                        <span className="text-gray-600 font-medium">Expire in:</span>
                                        <span className="text-right font-semibold">{basePack.expiringTime === -1 ? 'Unlimited' : `${basePack.expiringTime} ${basePack.expiringTime === 1 ? 'month' : 'months'}`}</span>

                                        <span className="text-gray-600 font-medium">In Use:</span>
                                        <span className="text-right">
                                            <span className="inline-block bg-gray-200 text-gray-800 text-sm font-semibold rounded-full px-3 py-1">{basePack.refCount}</span>
                                        </span>
                                    </div>
                                    <div className="flex justify-between mt-4">
                                        <button
                                            className="flex-1 mr-2 bg-gray-200 hover:bg-gray-300 text-gray-800 py-2 px-3 rounded-md transition-colors duration-200 text-sm font-medium flex items-center justify-center"
                                            onClick={(event) => handleUpdateClick(event, basePack)}
                                        >
                                            <span className="mr-1">✏️</span> Edit
                                        </button>
                                        <button
                                            className="flex-1 ml-2 bg-red-100 hover:bg-red-200 text-gray-800 py-2 px-3 rounded-md transition-colors duration-200 text-sm font-medium flex items-center justify-center"
                                            onClick={(event) => handleDeleteClick(event, basePack.id)}
                                        >
                                            <span className="mr-1">❌</span> Delete
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {view === 'UpdateBasePack' && selectedBasePack && (
                        <div ref={updateBasePackView} className="mt-8 w-full max-w-6xl bg-white rounded-lg shadow-md p-6">
                            <UpdateBasePack
                                basePack={selectedBasePack}
                                onCancelClick={handleCancelClick}
                                onUpdated={handleUpdated}
                            />
                        </div>
                    )}
                </>
            )}

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
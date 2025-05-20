import { useState, useEffect } from 'react'
//import { useRef } from 'react'
import logic from '../logic'
import { errors } from 'com'
import { getDecimalToTimeFormat } from "../logic/helpers"

import useContex from './useContext'
import { Button, Field, Label } from '../library/index'
import { ActivityTable } from './components/index'

const { SystemError } = errors
//const timerInputRef = useRef(null)

export default function Tracker(props) {
    let [loading, setLoading] = useState(true)
    const [customers, setCustomers] = useState([])
    const [filteredPacks, setFilteredPacks] = useState([])
    const [packActivities, setPackActivities] = useState([])
    const [selectedCustomer, setSelectedCustomer] = useState('')
    const [selectedPack, setSelectedPack] = useState(null)
    const [description, setDescription] = useState('')
    const [searchTerm, setSearchTerm] = useState('')
    const [showSearch, setShowSearch] = useState(false)

    const [elapsedTime, setElapsedTime] = useState(0)
    const [intervalId, setIntervalId] = useState(null)

    const { alert } = useContex()

    // Filter customers based on search term
    const filteredCustomers = customers.filter(customer =>
        customer.name.toLowerCase().includes(searchTerm.toLowerCase())
    )

    // Handle search input change
    const handleSearchChange = (e) => {
        const value = e.target.value
        setSearchTerm(value)

        // If there's only one match, select it automatically
        const matches = customers.filter(customer =>
            customer.name.toLowerCase().includes(value.toLowerCase())
        )

        if (matches.length === 1) {
            const event = {
                target: {
                    value: matches[0].id
                }
            }
            handleCustomerChange(event)
        }
    }

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true)
                const customers = await logic.getCustomers()
                setCustomers(customers)

                if (customers.length > 0) {
                    const firstCustomerId = customers[0]
                    setSelectedCustomer(firstCustomerId)

                    const packs = await logic.getAdquiredPacks(firstCustomerId.id)
                    setFilteredPacks(packs)

                    //load activities from first pack in the select
                    if (packs.length > 0) {
                        const firstPack = packs[0]
                        setSelectedPack(firstPack)

                        clearInterval(intervalId)
                        setIntervalId(null)
                        setElapsedTime(0)

                        const elapsed = calculateElapsedTime(firstPack.timerActivated)
                        setElapsedTime(elapsed)

                        if (firstPack.timerActivated) {
                            const id = setInterval(() => {
                                setElapsedTime((prevTime) => prevTime + 1)
                            }, 1000)
                            setIntervalId(id)
                        }

                        const activities = await logic.getActivitiesByPackId(firstPack.id)
                        setPackActivities(activities)
                    }

                } else {
                    setFilteredPacks([])
                }

            } catch (error) {
                //alert(error.message)
                console.error(error)

            } finally {
                setLoading(false)
            }
        }
        fetchData()
    }, [])


    const handleCustomerChange = (event) => {

        const customerId = event.target.value

        //Detenemos el temporizador actual y reseteamos el elapsed time
        if (intervalId) {
            clearInterval(intervalId)
            setIntervalId(null)
        }
        setElapsedTime(0)

        setSelectedCustomer(customerId)


        // Fetch packs based on the selected customer
        logic.getAdquiredPacks(customerId)
            .then((packs) => {
                setFilteredPacks(packs)

                if (packs.length > 0) {
                    const firstPack = packs[0]
                    setSelectedPack(firstPack)

                    // Calcular tiempo transcurrido y reiniciar temporizador
                    const elapsed = calculateElapsedTime(firstPack.timerActivated)
                    setElapsedTime(elapsed)

                    if (firstPack.timerActivated) {
                        const id = setInterval(() => {
                            setElapsedTime((prevTime) => prevTime + 1)
                        }, 1000)
                        setIntervalId(id)
                    }

                    logic.getActivitiesByPackId(firstPack.id)
                        .then((activities) => {
                            setPackActivities(activities)
                        })
                } else {
                    setFilteredPacks([])
                    setPackActivities([])
                }
            })
            .catch((error) => {
                alert(error.message)
                console.error(error)
                setFilteredPacks([])
                setDisabled(true)
            })
    }

    const handlePackChange = (event) => {

        const packId = event.target.value
        const selectedPackObject = filteredPacks.find(pack => pack.id === packId)

        setSelectedPack(packId)

        if (selectedPackObject) {
            if (intervalId) {
                clearInterval(intervalId)
                setIntervalId(null)
            }

            setSelectedPack(selectedPackObject)

            //Update elapsed if pack timer is running and start timer too
            const elapsed = calculateElapsedTime(selectedPackObject.timerActivated)
            setElapsedTime(elapsed)

            // Inicia el temporizador si `timerActivated` está definido
            if (selectedPackObject.timerActivated) {
                const id = setInterval(() => { setElapsedTime((prevTime) => prevTime + 1) }, 1000) // Increment elapsed time each second
                setIntervalId(id)
            }
        }

        logic.getActivitiesByPackId(packId)
            .then((packActivities) => {
                setPackActivities(packActivities)
            })
            .catch((error) => {
                alert(error.message)
                console.error(error)
                setPackActivities([])
            })
    }

    const handleHomeClick = event => {
        event.preventDefault()
        props.onHomeClick()
    }

    const handleDescriptionChange = (event) => {
        setDescription(event.target.value)
    }

    const handleAdjustManualTime = (event) => {
        event.preventDefault()

        //Obtiene el valor desde useRef en lugar de document.getElementById
        //const timerInput = timerInputRef.current?.value

        //TODO: Esto con useRef, nada de usar el DOM!!!
        const timerInput = document.getElementById('timerAdjust').value

        // Validar el formato del input de tiempo: (+/-)hh:mm:ss
        const timeRegex = /^[-+]?([0-9]{2}):([0-5][0-9]):([0-5][0-9])$/
        if (!timeRegex.test(timerInput)) {
            alert("Please enter a valid time in the format (+/-)hh:mm:ss.")
            return
        }

        const userId = logic.getUserId()
        const currentDescription = description || 'No description'


        logic.toggleManualTimeTracker(userId, selectedPack.id, selectedPack.customer, currentDescription, timerInput)
            .then((packUpdated) => {
                if (!packUpdated || !packUpdated.id) {
                    alert('Invalid pack data received from the server.')
                    return
                }
                // Fetch updated activities 
                logic.getActivitiesByPackId(packUpdated.id)
                    .then((updatedActivities) => {
                        setPackActivities(updatedActivities) // Update activities list
                    })
                    .catch((error) => {
                        alert(error.message)
                        console.error('Error fetching updated activities:', error)
                    })
            })
            .catch((error) => {
                alert(error.message)
                console.error(error)
            })
    }

    const handleAdjustManualUnits = (event) => {
        event.preventDefault()

        const UnitsInput = document.getElementById('unitsAdjust').value

        const userId = logic.getUserId()
        const currentDescription = description || 'No description'

        logic.toggleManualUnitsTracker(userId, selectedPack.id, selectedPack.customer, currentDescription, parseInt(UnitsInput))
            .then((packUpdated) => {
                if (!packUpdated || !packUpdated.id) {
                    alert('Invalid pack data received from the server.')
                    return
                }

                // Fetch updated activities 
                logic.getActivitiesByPackId(packUpdated.id)
                    .then((updatedActivities) => {
                        setPackActivities(updatedActivities)
                    })
                    .catch((error) => {
                        alert(error.message)
                        console.error('Error fetching updated activities:', error)
                    })
            })
            .catch((error) => {
                alert(error.message)
                console.error(error)
            })

    }

    const handleToggleTrackButton = () => {
        if (!selectedPack || !selectedPack.id) {
            alert('No pack selected or invalid pack ID.')
            return
        }

        const userId = logic.getUserId()
        const currentDescription = description || 'No description'

        logic.toggleTimeTracker(userId, selectedPack.id, selectedPack.customer, currentDescription, 'substract')
            .then((packUpdated) => {
                if (!packUpdated || !packUpdated.id) {
                    alert('Invalid pack data received from the server.')
                    return
                }

                setSelectedPack(packUpdated)

                setFilteredPacks(prevPacks =>
                    prevPacks.map(pack =>
                        pack.id === packUpdated.id ? packUpdated : pack
                    )
                )

                // Detenemos el temporizador actual
                if (intervalId) {
                    clearInterval(intervalId)
                    setIntervalId(null)
                }

                // Calculamos el tiempo inicial y activamos el temporizador
                const elapsed = calculateElapsedTime(packUpdated.timerActivated)
                setElapsedTime(elapsed)

                if (packUpdated.timerActivated) {
                    const id = setInterval(() => {
                        setElapsedTime((prevTime) => prevTime + 1)
                    }, 1000) // Incrementar cada segundo
                    setIntervalId(id)
                }

                if (selectedPack?.timerActivated) {
                    // Fetch updated activities 
                    logic.getActivitiesByPackId(packUpdated.id)
                        .then((updatedActivities) => {
                            setPackActivities(updatedActivities)
                        })
                        .catch((error) => {
                            alert(error.message)
                            console.error('Error fetching updated activities:', error)
                        })
                }

            })
            .catch((error) => {
                alert(error.message)
                console.error(error)
            })
    }

    // Cleanup on component unmount
    useEffect(() => {
        return () => {
            if (intervalId) {
                clearInterval(intervalId)
            }
        }
    }, [intervalId])

    useEffect(() => {
        if (selectedPack?.timerActivated) {
            document.title = `⏱️ Timer: ${new Date(elapsedTime * 1000).toISOString().substr(11, 8)}`
        } else {
            document.title = 'Hourify - Time Tracker'
        }
    }, [elapsedTime, selectedPack?.timerActivated])

    const calculateElapsedTime = (timerActivated) => {
        if (!timerActivated) return 0
        return Math.floor((Date.now() - new Date(timerActivated)) / 1000)
    }

    if (customers.length === 0) {
        return (
            <main className="flex flex-col items-center bg-color_backgroundGrey w-full flex-grow pt-12 px-4">
                <h1 className="text-3xl font-bold mb-2">Time Tracker</h1>
                <p className="text-gray-600 mb-6">Track time and manage your projects</p>

                {loading ? (
                    <div className="flex justify-center items-center h-full">
                        <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-color_green"></div>
                    </div>
                ) : (
                    <div className="bg-white shadow-md rounded-lg p-6 w-full max-w-4xl">
                        <h2 className="text-xl font-semibold text-color_darkBlue mb-4">No Packs Available</h2>
                        <p className="text-gray-600 mb-4">You need to create a pack and assign it to a customer to use the time tracker.</p>

                        <div className="bg-gray-50 p-4 rounded-md mb-4">
                            <h3 className="font-medium text-gray-700 mb-2">Follow these steps:</h3>
                            <ol className="list-decimal pl-5 space-y-2 text-gray-600">
                                <li>Go to Manage Packs</li>
                                <li>Click on Create New Pack</li>
                                <li>Go to Assign Pack to assign it to a customer</li>
                            </ol>
                        </div>

                        <div className="border-t border-gray-200 pt-4 mt-4">
                            <p className="text-gray-600">After completing these steps, you'll be able to track time for your projects.</p>
                        </div>
                    </div>
                )}
            </main>
        )
    }

    return (
        <main className="flex flex-col items-center bg-color_backgroundGrey w-full flex-grow pt-12 px-4">
            <h1 className="text-3xl font-bold mb-2">Time Tracker</h1>
            <p className="text-gray-600 mb-6">Track time and manage your projects</p>

            <div className="w-full max-w-6xl">
                {/* Main Content Card */}
                <div className="bg-white shadow-md rounded-lg p-6 mb-6">
                    <h2 className="text-xl font-semibold text-color_darkBlue mb-4">Select Customer & Pack</h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                        {/* Customer Search and Select */}
                        <Field>
                            <div className="flex items-center justify-between mb-2">
                                <Label htmlFor="selectCustomer" className="text-gray-700 font-medium">Customer</Label>
                                <button
                                    onClick={() => setShowSearch(!showSearch)}
                                    className="text-gray-500 hover:text-gray-700 transition-colors duration-200"
                                    title={showSearch ? "Hide search" : "Show search"}
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                        <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
                                    </svg>
                                </button>
                            </div>

                            <div className={`overflow-hidden transition-all duration-300 ease-in-out ${showSearch ? 'max-h-12 opacity-100' : 'max-h-0 opacity-0'}`}>
                                <input
                                    type="text"
                                    id="customerSearch"
                                    className="border-2 border-gray-300 rounded-lg w-full p-2 mb-2 focus:border-color_primary focus:ring-1 focus:ring-color_primary transition-colors"
                                    placeholder="Type to search customers..."
                                    value={searchTerm}
                                    onChange={handleSearchChange}
                                />
                            </div>

                            <select
                                id="selectCustomer"
                                name="selectCustomer"
                                className="border-2 border-gray-300 rounded-lg w-full p-2 focus:border-color_primary focus:ring-1 focus:ring-color_primary transition-colors"
                                onChange={handleCustomerChange}
                                value={selectedCustomer}
                            >
                                {filteredCustomers.map((customer) => (
                                    <option key={customer.id} value={customer.id}>{customer.name}</option>
                                ))}
                            </select>
                        </Field>

                        {/* Select Pack */}
                        <Field>
                            <Label htmlFor="selectPack" className="text-gray-700 font-medium mb-1 block">Pack</Label>
                            <select
                                id="selectPack"
                                name="selectPack"
                                className="border-2 border-gray-300 rounded-lg w-full p-2 focus:border-color_primary focus:ring-1 focus:ring-color_primary transition-colors"
                                disabled={!filteredPacks.length}
                                onChange={handlePackChange}
                            >
                                {filteredPacks.map((pack) => (
                                    <option key={pack.id} value={pack.id}>
                                        {pack.status === 'Active' ? ' 🟢 ' : ' 🔴 '}{pack.status} - {pack.description} - {pack.originalQuantity}{pack.unit}
                                    </option>
                                ))}
                            </select>
                        </Field>
                    </div>

                    {/* Selected Pack Status Card */}
                    {selectedPack && (
                        <div className={`mb-6 p-4 rounded-lg border-l-4 ${selectedPack.timerActivated ? 'bg-green-50 border-green-500' : 'bg-gray-50 border-gray-300'}`}>
                            <div className="flex flex-wrap justify-between items-center">
                                <div>
                                    <h3 className="font-semibold text-gray-800">{selectedPack.description}</h3>
                                    <p className="text-sm text-gray-600">Remaining: {selectedPack.unit === 'hours'
                                        ? `${getDecimalToTimeFormat(selectedPack.remainingQuantity)} h`
                                        : `${selectedPack.remainingQuantity} un.`}
                                    </p>
                                    <div className='relative w-full h-2 bg-gray-200 rounded-full mt-2 overflow-hidden'>
                                        <div
                                            className={`absolute top-0 left-0 h-full transition-all duration-300 ${(selectedPack.remainingQuantity / selectedPack.originalQuantity) * 100 < 20
                                                ? 'bg-red-500'
                                                : 'bg-purple-500'
                                                }`}
                                            style={{
                                                width: `${Math.max(0, Math.min(100, (selectedPack.remainingQuantity / selectedPack.originalQuantity) * 100))}%`,
                                                minWidth: '2px'
                                            }}
                                        ></div>
                                    </div>
                                </div>
                                {selectedPack.timerActivated && (
                                    <div className="flex items-center mt-2 sm:mt-0">
                                        <span className="inline-block w-2 h-2 rounded-full bg-green-500 animate-pulse mr-2"></span>
                                        <span className="text-sm font-medium text-green-800">Timer Active</span>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    {/* Description Field */}
                    <div className="mb-6">
                        <Label htmlFor="description" className="text-gray-700 font-medium mb-1 block">Activity Description</Label>
                        <textarea
                            id="description"
                            name="description"
                            rows="3"
                            className="border-2 border-gray-300 rounded-lg w-full p-3 focus:border-color_primary focus:ring-1 focus:ring-color_primary transition-colors"
                            placeholder="Describe what you're working on..."
                            value={description}
                            onChange={handleDescriptionChange}
                        ></textarea>
                    </div>

                    {/* Time Tracking Controls */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Timer & Start/Stop Button Section */}
                        {selectedPack?.unit === 'hours' && (
                            <div className="bg-gray-50 p-4 rounded-lg">
                                <h3 className="text-sm font-medium text-gray-700 mb-3">Timer Control</h3>
                                <div className="flex flex-col sm:flex-row gap-3">
                                    {/* Timer Display */}
                                    <div className="border-2 border-gray-300 bg-white rounded-lg p-3 text-center text-xl font-mono font-semibold flex-grow sm:flex-grow-0 sm:w-44">
                                        {new Date(elapsedTime * 1000).toISOString().substr(11, 8)}
                                    </div>

                                    {/* Start/Stop Button */}
                                    <Button
                                        type="button"
                                        className={`flex items-center justify-center rounded-lg py-3 px-6 text-white font-medium transition-colors duration-300 flex-grow sm:flex-grow-0 ${!selectedPack?.timerActivated ? 'bg-green-600 hover:bg-green-700' : 'bg-red-600 hover:bg-red-700'}`}
                                        onClick={handleToggleTrackButton}
                                    >
                                        {!selectedPack?.timerActivated ? (
                                            <>
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                                                </svg>
                                                Start Timer
                                            </>
                                        ) : (
                                            <>
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8 7a1 1 0 00-1 1v4a1 1 0 001 1h4a1 1 0 001-1V8a1 1 0 00-1-1H8z" clipRule="evenodd" />
                                                </svg>
                                                Stop Timer
                                            </>
                                        )}
                                    </Button>
                                </div>
                            </div>
                        )}

                        {/* Manual Time Entry Section */}
                        <div className="bg-gray-50 p-4 rounded-lg">
                            <h3 className="text-sm font-medium text-gray-700 mb-3">
                                {selectedPack?.unit === 'hours' ? 'Manual Time Entry' : 'Register Units'}
                            </h3>
                            <div className="flex flex-col sm:flex-row gap-3">
                                {/* Input for time or units */}
                                {selectedPack?.unit === 'hours' && !selectedPack?.timerActivated ? (
                                    <input
                                        type="text"
                                        id="timerAdjust"
                                        name="timerAdjust"
                                        placeholder="-01:00:00"
                                        defaultValue="-01:00:00"
                                        className="border-2 border-gray-300 bg-white rounded-lg p-3 text-center flex-grow sm:flex-grow-0 sm:w-44"
                                    />
                                ) : selectedPack?.unit === 'units' && (
                                    <input
                                        type="number"
                                        id="unitsAdjust"
                                        name="unitsAdjust"
                                        placeholder="-1"
                                        defaultValue="-1"
                                        className="border-2 border-gray-300 bg-white rounded-lg p-3 text-center flex-grow sm:flex-grow-0 sm:w-44"
                                    />
                                )}

                                {/* Register button */}
                                {(selectedPack?.unit === 'units' || (selectedPack?.unit === 'hours' && !selectedPack?.timerActivated)) && (
                                    <Button
                                        className="flex items-center justify-center bg-blue-600 hover:bg-blue-700 text-white rounded-lg py-3 px-6 font-medium transition-colors duration-300 flex-grow sm:flex-grow-0"
                                        onClick={selectedPack?.unit === 'units' ? handleAdjustManualUnits : handleAdjustManualTime}
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                                            <path d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z" />
                                        </svg>
                                        {selectedPack?.unit === 'units' ? 'Register Units' : 'Register Time'}
                                    </Button>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Activity History Section */}
                <div className="bg-white shadow-md rounded-lg p-6 mb-6">
                    <h2 className="text-xl font-semibold text-color_darkBlue mb-4">Activity History</h2>
                    <ActivityTable activities={packActivities} packInfo={selectedPack} />
                </div>
            </div>

            <a
                href=""
                title="Go back home"
                onClick={handleHomeClick}
                className="mt-6 text-color_primary hover:underline flex items-center"
            >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
                </svg>
                Back to home
            </a>
        </main>
    )
}
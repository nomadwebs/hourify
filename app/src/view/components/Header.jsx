import { useState, useEffect } from 'react'
import { useLocation } from 'react-router-dom'

import useContext from '../useContext'
import logic from '../../logic'

export default function Header({ onHomeClick,
    onLoggedOut,
    onViewProfile,
    onTrackerClick,
    onManagePacksClick,
    onManageCustomersClick,
    onManagePurchasedPacksClick,
    onTasksClick,
    onCalendarClick }) {
    const [name, setName] = useState(null)
    const [userDetails, setUserDetails] = useState(null)
    const [isMenuOpen, setIsMenuOpen] = useState(false)
    const location = useLocation()
    const { alert, confirm } = useContext()


    useEffect(() => {
        if (logic.isUserLoggedIn() && !userDetails) {
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
        } else {
            setName(null)
        }
    }, [location.pathname])

    // Cerrar el menú cuando se cambia de ruta
    useEffect(() => {
        setIsMenuOpen(false)
    }, [location.pathname])

    // Cerrar el menú cuando se hace clic fuera de él
    useEffect(() => {
        const handleClickOutside = (event) => {
            // Solo cerrar si el menú está abierto y el clic no fue en la imagen o en el menú
            if (isMenuOpen) {
                const menuContainer = document.getElementById('profile-menu-container')
                if (menuContainer && !menuContainer.contains(event.target)) {
                    setIsMenuOpen(false)
                }
            }
        }

        document.addEventListener('mousedown', handleClickOutside)
        return () => {
            document.removeEventListener('mousedown', handleClickOutside)
        }
    }, [isMenuOpen])


    //Navigate to home event
    const handleHomeClick = event => {
        event.preventDefault()
        onHomeClick()
    }

    //Handle to logout aplication
    const handleLogout = event => {
        event.preventDefault()
        confirm('Are you sure you want to logout?', accepted => {
            if (accepted) {
                logic.logoutUser()
                setUserDetails(null)
                onLoggedOut()
                localStorage.removeItem('token')
            }
        }, 'warn')
    }

    const handleProfileClick = event => {
        event.preventDefault()
        onViewProfile()
        setIsMenuOpen(false)
    }

    const handleTrackerClick = event => {
        event.preventDefault()
        onTrackerClick()
        setIsMenuOpen(false)
    }

    const handleManagePacks = event => {
        event.preventDefault()
        onManagePacksClick()
        setIsMenuOpen(false)
    };

    const handleManageCustomers = event => {
        event.preventDefault()
        onManageCustomersClick()
        setIsMenuOpen(false)
    };

    const handleManagePurchasedPacks = event => {
        event.preventDefault()
        onManagePurchasedPacksClick()
        setIsMenuOpen(false)
    };

    const handleTasksClick = event => {
        event.preventDefault()
        onTasksClick()
        setIsMenuOpen(false)
    }

    const handleCalendarClick = event => {
        event.preventDefault()
        onCalendarClick()
        setIsMenuOpen(false)
    }

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen)
    }

    const profileImageUrl = logic.getProfileImage(userDetails)

    const isActive = (path) => location.pathname === path ? 'text-color_green font-bold' : 'hover:underline';

    const isProvider = userDetails?.ownPacks.length !== 0 ? true : false
    const isCustomer = userDetails?.adquiredPacks.length !== 0 ? true : false

    // Verificar si el usuario tiene plan PRO (ajustar según la estructura de datos real)
    const isPro = userDetails?.plan === 'pro' || userDetails?.isPro === true

    return <header className="bg-color_darkBlue text-white p-4 flex justify-between items-center h-28">
        <h1 className="text-4xl font-bold">{location.pathname !== '/' ? <a href="" onClick={handleHomeClick}>Hourify</a> : 'Hourify'}</h1>

        <nav className="hidden sm:flex mx-6 space-x-6">
            {logic.isUserLoggedIn() && (
                <>
                    {isProvider && (
                        <>
                            <a href="#" className={`hover:underline ${location.pathname === '/tracker' ? 'text-color_green font-bold' : ''}`} onClick={handleTrackerClick}>Time Tracker</a>
                            <a href="#" className={`hover:underline ${location.pathname === '/manage-customers' ? 'text-color_green font-bold' : ''}`} onClick={handleManageCustomers}>My Customers</a>
                        </>
                    )}

                    <a href="#" className={`hover:underline ${location.pathname === '/manage-packs' ? 'text-color_green font-bold' : ''}`} onClick={handleManagePacks}>My Services</a>

                    {isCustomer && (
                        <>
                            <a href="#" className={`hover:underline ${location.pathname === '/manage-bought-packs' ? 'text-color_green font-bold' : ''}`} onClick={handleManagePurchasedPacks}>Bought Services</a>
                        </>
                    )}

                    <a href="#" className={`hover:underline ${location.pathname === '/tasks' ? 'text-color_green font-bold' : ''}`} onClick={handleTasksClick}>Tasks</a>
                    <a href="#" className={`hover:underline ${location.pathname === '/calendar' ? 'text-color_green font-bold' : ''}`} onClick={handleCalendarClick}>Calendar</a>
                </>
            )}
        </nav>

        <div className='flex justify-between'>

            {logic.isUserLoggedIn() && (
                <div id="profile-menu-container" className="relative">
                    <div className="relative">
                        <img
                            src={profileImageUrl}
                            alt="User profile"
                            className="w-10 h-10 rounded-full border-2 border-white cursor-pointer"
                            onClick={toggleMenu}
                        />
                        {/* Mostramos una etiqueta PRO si el usuario tiene un plan superior */}
                        {isPro && (
                            <div className="absolute -bottom-1 -right-1 bg-yellow-500 text-xs font-bold text-black px-1.5 py-0.5 rounded-full shadow-md">
                                PRO
                            </div>
                        )}
                    </div>
                    {isMenuOpen && (
                        <div className="absolute right-0 mt-2 w-40 bg-white text-black rounded-lg shadow-lg z-50">
                            {isProvider && (
                                <>
                                    <a href="#" className="block px-4 py-2 hover:bg-gray-100" onClick={handleTrackerClick}>⏱️ Time Tracker</a>
                                    <a href="#" className="block px-4 py-2 hover:bg-gray-100" onClick={handleManageCustomers}>👥 My Customers</a>
                                </>
                            )}
                            <a href="#" className="block px-4 py-2 hover:bg-gray-100" onClick={handleManagePacks}>📑 My Services</a>
                            {isCustomer && (
                                <>
                                    <a href="#" className="block px-4 py-2 hover:bg-gray-100" onClick={handleManagePurchasedPacks}>📑 Bought Services</a>
                                </>
                            )}
                            <a href="#" className="block px-4 py-2 hover:bg-gray-100" onClick={handleTasksClick}>📝 Tasks</a>
                            <a href="#" className="block px-4 py-2 hover:bg-gray-100" onClick={handleCalendarClick}>📅 Calendar</a>
                            <a href="#" className="block px-4 py-2 hover:bg-gray-100" onClick={handleProfileClick}>👤 User profile</a>
                            <a href="#" className="block px-4 py-2 hover:bg-gray-100" onClick={handleLogout}>👋 Logout</a>
                        </div>
                    )}
                </div>
            )}
        </div>
    </header>
}
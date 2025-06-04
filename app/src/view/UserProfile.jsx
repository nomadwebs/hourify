import { errors } from 'com'

import logic from '../logic'
import getFormattedDate from '../logic/helpers/getFormattedDate'

const { SystemError } = errors

import useContex from './useContext'

import { Button, Field, Input, Label, Image, Textarea } from '../library'
import { useEffect, useState, useRef } from 'react'
import ImageEditModal from './components/ImageEditModal'

export default function UserProfile(props) {
    const [userData, setUserData] = useState(null)
    const [isLoading, setIsLoading] = useState(true)
    const [formattedExpiryDate, setFormattedExpiryDate] = useState('N/A')
    const [isImageModalOpen, setIsImageModalOpen] = useState(false)

    // Formatear fecha de caducidad del plan
    const formatExpiryDate = (expiryDate) => {
        if (!expiryDate) {
            setFormattedExpiryDate('N/A');
            return;
        }

        // Verificar si es una fecha vitalicia (31/12/9999)
        if (expiryDate && (expiryDate.includes('9999') || expiryDate === '31/12/9999')) {
            setFormattedExpiryDate('Lifetime');
            return;
        }

        // Usar la función getFormattedDate para formatear la fecha
        getFormattedDate(new Date(expiryDate))
            .then(formatted => {
                setFormattedExpiryDate(formatted);
            })
            .catch(error => {
                console.error('Error formatting date:', error);
                setFormattedExpiryDate(expiryDate.toString()); // Usamos el string original como fallback
            });
    };

    const fetchData = () => {
        if (logic.isUserLoggedIn()) {
            logic.getUserDetails()
                .then((userData) => {
                    setUserData(userData)

                    // Formatear la fecha de caducidad del plan si existe
                    if (userData && userData.planExpiryDate) {
                        formatExpiryDate(userData.planExpiryDate);
                    }

                    setIsLoading(false) // Datos cargados
                })
                .catch((error) => {
                    alert(error.message)
                    setIsLoading(false) // Datos cargados
                })
        } else {
            setUserData(null)
            setIsLoading(false) // Datos cargados
        }
    }

    useEffect(() => {
        try {
            fetchData()
        } catch (error) {
            alert(error.message)
            console.error(error)
            setIsLoading(false)
        } finally {
            setIsLoading(false) // Fin de la carga
        }
    }, [location.pathname, logic.isUserLoggedIn()])

    const { alert, confirm } = useContex()

    const handleCancelButton = event => {
        event.preventDefault()

        confirm('Do you want to cancel editing?', accepted => {
            if (accepted) {
                props.onProfileCancel()
            }
        }, 'warn')
    }

    const handleUpdatePassword = event => {
        event.preventDefault()

        const { target: form } = event
        const {
            password: { value: oldPassword },
            'new-password': { value: newPassword },
            'new-repeat-password': { value: newPasswordRepeat }
        } = form

        try {
            logic.changePassword(oldPassword, newPassword, newPasswordRepeat)
                .then(result => {
                    alert(result.message || 'Password updated successfully!', 'success')
                    form.reset()
                })
                .catch(error => {
                    // Siempre mostrar el mensaje de error específico
                    alert(error.message, 'error')
                    console.error('Password change error:', error)
                })
        } catch (error) {
            alert(error.message, 'error')
            console.error('Validation error:', error)
        }
    }

    const handleUpdateClick = event => {
        event.preventDefault()

        const { target: form } = event
        const {
            username: { value: username },
            email: { value: email },
            name: { value: name },
            surname1: { value: surname1 },
            surname2: { value: surname2 },
            dni: { value: dni },
            biography: { value: biography },
            country: { value: country },
            province: { value: province },
            city: { value: city },
            postalCode: { value: postalCode },
            address1: { value: address1 },
            address2: { value: address2 },
            number: { value: number },
            flat: { value: flat },
            legalName: { value: legalName },
            website: { value: website },
        } = form

        try {
            logic.updateUser(userData.id, userData.id, username, email, name, surname1, surname2, dni, biography, country, province, city, postalCode, address1, address2, number, flat, legalName, website)
                .then(() => {
                    alert('User updated successfully!', 'success')
                    props.onProfileUpdated()
                })
                .catch(error => {
                    if (error instanceof SystemError)
                        alert('Sorry, there was a problem, try it again later')
                    else
                        alert(error.message)
                })

        } catch (error) {
            alert(error.message)
            console.error(error)
        }
    }

    const profileImageUrl = logic.getProfileImage(userData)

    const handleUpgradePlan = (event) => {
        event.preventDefault();
        alert('Upgrade to Premium plan will be available soon!', 'info');
    };

    const handleImageClick = (event) => {
        event.preventDefault()
        setIsImageModalOpen(true)
    }

    const handleImageUpdate = (newImageUrl) => {
        console.log('Updating image URL:', newImageUrl)
        setUserData(prev => ({
            ...prev,
            profileImage: newImageUrl
        }))
        console.log('Updated user data:', userData)
    }

    if (isLoading) {
        return <p>Loading...</p>
    }
    return <main className="flex justify-center items-center bg-gray-100 w-full h-full flex-grow py-8">

        {/* Container to center content */}
        <div className="bg-white shadow-md rounded-md p-8 w-full max-w-4xl">
            <div className="flex flex-col items-center">
                <h2 className="text-2xl font-bold text-color_darkBlue mb-4">User Profile</h2>
                <form className="flex flex-col gap-4 w-full" onSubmit={handleUpdateClick}>
                    {userData ? (
                        <>
                            <div className="flex flex-col md:flex-row items-center mb-6">
                                <div className="relative group">
                                    <div
                                        onClick={handleImageClick}
                                        className="cursor-pointer"
                                    >
                                        <img
                                            src={profileImageUrl}
                                            alt="User profile"
                                            className="w-40 h-40 rounded-full border-2 border-white transition-transform duration-300 group-hover:scale-105"
                                        />
                                        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                            <div className="bg-black bg-opacity-50 rounded-full p-2">
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                                                </svg>
                                            </div>
                                        </div>
                                    </div>
                                    {userData.plan === 'pro' && (
                                        <div className="absolute -bottom-1 -right-1 bg-yellow-500 text-xs font-bold text-black px-1.5 py-0.5 rounded-full shadow-md">
                                            PRO
                                        </div>
                                    )}
                                </div>
                                <div className="ml-0 md:ml-6 mt-4 md:mt-0 text-center md:text-left flex flex-col">
                                    <h3 className="text-xl font-bold text-gray-800">{userData.name} {userData.surname1}</h3>
                                    <div className="mt-2 space-y-1">
                                        <div className="flex flex-col md:flex-row md:items-center">
                                            <span className="font-semibold text-gray-700 mr-2">Plan:</span>
                                            <span className={`px-2 py-1 rounded-full text-xs font-bold ${userData.plan === 'pro' ? 'bg-yellow-100 text-yellow-800' :
                                                userData.plan === 'premium' ? 'bg-purple-100 text-purple-800' :
                                                    'bg-blue-100 text-blue-800'
                                                }`}>
                                                {userData.plan?.toUpperCase() || 'FREE'}
                                            </span>
                                        </div>
                                        <div className="flex flex-col md:flex-row md:items-center">
                                            <span className="font-semibold text-gray-700 mr-2">Expires:</span>
                                            <span className="text-gray-600">
                                                {formattedExpiryDate === 'Lifetime' ? 'Lifetime' :
                                                    formattedExpiryDate === 'N/A' ? 'N/A' :
                                                        new Date(userData.planExpiryDate).toLocaleDateString('es-ES', {
                                                            day: '2-digit',
                                                            month: '2-digit',
                                                            year: 'numeric'
                                                        })}
                                            </span>
                                        </div>

                                        {/* Botón de upgrade para usuarios con plan free */}
                                        {(!userData.plan || userData.plan === 'free') && (
                                            <button
                                                onClick={handleUpgradePlan}
                                                className="mt-3 bg-gradient-to-r from-indigo-500 to-purple-600 text-white px-4 py-2 rounded-md text-sm font-medium shadow-md hover:from-indigo-600 hover:to-purple-700 transition-all duration-300 transform hover:scale-105"
                                            >
                                                Upgrade to Premium
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </div>

                            <Field>
                                <Label htmlFor="username">Username</Label>
                                <Input type="text" id="username" defaultValue={userData.username} placeholder="Your username" className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-color_primary" />
                            </Field>
                            <Field>
                                <Label htmlFor="email">Email</Label>
                                <Input type="email" id="email" defaultValue={userData.email} placeholder="Your email" className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-color_primary" />
                            </Field>
                            <Field>
                                <Label htmlFor="name">Name</Label>
                                <Input type="text" id="name" defaultValue={userData.name} placeholder="Your name" className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-color_primary" />
                            </Field>
                            <Field>
                                <Label htmlFor="surname1">Surname</Label>
                                <Input type="text" id="surname1" defaultValue={userData.surname1} placeholder="Your surname 1" className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-color_primary" />
                            </Field>
                            <Field>
                                <Label htmlFor="surname2">Surname 2</Label>
                                <Input type="text" id="surname2" defaultValue={userData.surname2} placeholder="Your surname 2" className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-color_primary" />
                            </Field>
                            <Field>
                                <Label htmlFor="dni">DNI</Label>
                                <Input type="text" id="dni" defaultValue={userData.dni} placeholder="00000000H" className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-color_primary" />
                            </Field>
                            <Field>
                                <Label htmlFor="biography">Biography</Label>
                                <Textarea id="biography" defaultValue={userData.biography} placeholder="Show your best here"></Textarea>
                            </Field>
                            <Field>
                                <Label htmlFor="country">Country</Label>
                                <Input type="text" id="country" defaultValue={userData.country} placeholder="Your country" className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-color_primary" />
                            </Field>
                            <Field>
                                <Label htmlFor="province">Province</Label>
                                <Input type="text" id="province" defaultValue={userData.province} placeholder="Your province or state" className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-color_primary" />
                            </Field>
                            <Field>
                                <Label htmlFor="city">City</Label>
                                <Input type="text" id="city" defaultValue={userData.city} placeholder="Your city" className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-color_primary" />
                            </Field>
                            <Field>
                                <Label htmlFor="postalCode">Postal Code</Label>
                                <Input type="text" id="postalCode" defaultValue={userData.postalCode} placeholder="00000Y" className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-color_primary" />
                            </Field>
                            <Field>
                                <Label htmlFor="address1">Address 1</Label>
                                <Input type="text" id="address1" defaultValue={userData.address1} placeholder="street, square, ... " className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-color_primary" />
                            </Field>
                            <Field>
                                <Label htmlFor="address2">Address 2</Label>
                                <Input type="text" id="address2" defaultValue={userData.address2} placeholder="Stair, apartment, neighbourhood, studio...  " className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-color_primary" />
                            </Field>
                            <Field>
                                <Label htmlFor="number">number</Label>
                                <Input type="text" id="number" defaultValue={userData.number} placeholder="0" className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-color_primary" />
                            </Field>
                            <Field>
                                <Label htmlFor="flat">Flat</Label>
                                <Input type="number" id="flat" defaultValue={userData.flat} placeholder="0" className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-color_primary" />
                            </Field>
                            <Field>
                                <Label htmlFor="legalName">Legal Name</Label>
                                <Input type="text" id="legalName" defaultValue={userData.legalName} placeholder="Your company name" className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-color_primary" />
                            </Field>
                            <Field>
                                <Label htmlFor="website">Website</Label>
                                <Input type="url" id="website" defaultValue={userData.website} placeholder="Your company name" className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-color_primary" />
                            </Field>

                            {/* <Button type="submit" className="bg-color_primary text-white px-4 py-2 rounded-md hover:bg-color_primaryHover transition">Update profile</Button>
                            <Button className="bg-color_softRed text-white px-4 py-2 rounded-md hover:bg-red-800 transition" onClick={handleCancelButton}>Cancel</Button> */}

                            <div className="flex flex-col sm:flex-row justify-center items-center space-y-2 sm:space-y-0 sm:space-x-4">
                                <Button type="submit" className="btn m-2" >Update profile</Button>
                                <Button className="btn m-2 bg-color_softRed  hover:bg-red-800 transition" onClick={handleCancelButton}>Cancel</Button>
                            </div>
                        </>
                    ) : (
                        <p>Loading user data...</p>
                    )}
                </form>
                <form className="flex flex-col gap-4 w-full bg-red-50 p-2 rounded-b-md mt-10 border-red-200" onSubmit={handleUpdatePassword}>
                    <h2 className='text-2xl text-red-950'>Change password</h2>
                    <Field>
                        <Label htmlFor="password">Old Password</Label>
                        <Input
                            id="password"
                            type="password"
                            placeholder="Your old password"
                            required
                            className="w-full px-1 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-color_primary"
                        />
                    </Field>

                    <Field>
                        <Label htmlFor="password-repeat">New Password</Label>
                        <Input
                            id="new-password"
                            type="password"
                            placeholder="New password"
                            required
                            className="w-full px-1 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-color_primary"
                        />
                    </Field>

                    <Field>
                        <Label htmlFor="password-repeat">Repeat new Password</Label>
                        <Input
                            id="new-repeat-password"
                            type="password"
                            placeholder="Repeat your new password"
                            required
                            className="w-full px-1 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-color_primary"
                        />
                    </Field>
                    <Button type="submit" className="btn m-2" >Change password</Button>
                </form>
            </div>
        </div>

        {isImageModalOpen && (
            <ImageEditModal
                isOpen={isImageModalOpen}
                onClose={() => {
                    console.log('Closing modal')
                    setIsImageModalOpen(false)
                }}
                onSave={handleImageUpdate}
                currentImage={profileImageUrl}
            />
        )}
    </main>
}
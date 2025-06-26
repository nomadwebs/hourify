import { useState, useEffect } from 'react'
import logic from '../logic'
import { errors } from 'com'

const { SystemError, NotFoundError } = errors

import useContext from './useContext'

import { Button, Field, Input, InputOnChange, Label, Image, Textarea } from '../library'
import { getCurrencySymbol } from '../util'
import { assignPack } from '../logic/packs'
import { CreateUserByProvider } from './components'

export default function AssignPack(props) {
    const [basePacks, setPacks] = useState([])
    const [showCreateUser, setShowCreateUser] = useState(false)
    const { alert, confirm } = useContext()

    // Estados mejorados para manejar descuentos y precios
    const [discount, setDiscount] = useState('')
    const [promoPrice, setPromoPrice] = useState('')
    const [manualPromo, setManualPromo] = useState(false)
    const [selectedPackId, setSelectedPackId] = useState('') // Nuevo estado para el pack seleccionado

    // Estados para el dropdown interactivo de clientes
    const [customers, setCustomers] = useState([])
    const [customerSearch, setCustomerSearch] = useState('')
    const [showDropdown, setShowDropdown] = useState(false)
    const [selectedCustomer, setSelectedCustomer] = useState(null)

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Obtener packs
                const basePacks = await logic.getBasePacks()
                setPacks(basePacks)

                // Si hay packs disponibles, seleccionar el primero por defecto
                if (basePacks.length > 0) {
                    setSelectedPackId(basePacks[0].id)
                }

                // Obtener clientes
                const customersResponse = await logic.getCustomers()
                setCustomers(customersResponse)
            } catch (error) {
                if (error.message === 'jwt expired') {
                    error.message = 'Your session has expired.'
                    alert(error.message)
                    console.error(error.message)
                    localStorage.removeItem('token')
                    navigate('/login')
                } else {
                    alert(error.message)
                    console.error(error)
                }
            }
        }
        fetchData()
    }, [])

    // Efecto para calcular el precio promocional cuando cambia el pack o el descuento
    useEffect(() => {
        if (selectedPackId && discount && !manualPromo) {
            const pack = basePacks.find(p => p.id === selectedPackId)
            if (pack) {
                const percent = parseFloat(discount)
                if (!isNaN(percent)) {
                    const discounted = (pack.price * (1 - percent / 100)).toFixed(2)
                    setPromoPrice(discounted)
                }
            }
        }
    }, [selectedPackId, discount, manualPromo, basePacks])

    const handleSubmit = async (event) => {
        event.preventDefault()
        const { target: form } = event
        const selectedPack = basePacks.find(pack => pack.id === selectedPackId)

        // Usar el precio promocional si existe, de lo contrario no lo informamos, lo pillará del pack en la logica
        let finalPrice = promoPrice && !isNaN(promoPrice) ? promoPrice : undefined

        let {
            description: { value: description },
            payedAmount: { value: payedAmount },
            paymentMethod: { value: paymentMethod },
            paymentReference: { value: paymentReference }
        } = form

        // Usar el valor del customerSearch o el email/username del cliente seleccionado
        const customerSearchValue = selectedCustomer ? (selectedCustomer.email || selectedCustomer.username) : customerSearch

        // Formatear el monto pagado
        let formattedPayedAmount = payedAmount.replace(',', '.').replace('€', '')
        payedAmount = formattedPayedAmount

        try {
            await assignPack(customerSearchValue, selectedPackId, description, payedAmount, paymentMethod, paymentReference, finalPrice)
            alert('Pack successfully assigned to customer!', 'success')

            // Resetear el formulario
            setCustomerSearch('')
            setSelectedCustomer(null)
            setShowDropdown(false)
        } catch (error) {
            if (error instanceof NotFoundError && error.message === 'Customer not found') {
                handleCreateUser()
            } else {
                alert(error.message)
                console.error(error)
            }
        }
    }

    const handleDiscountChange = (e) => {
        let discountValue = e.target.value
        console.log(discountValue)

        setManualPromo(false)

        // Eliminar cualquier símbolo % que el usuario haya ingresado
        discountValue = discountValue.replace('%', '')

        // Permitir solo números y un punto decimal
        discountValue = discountValue.replace(/[^0-9.]/g, '')

        // Limitar a un solo punto decimal
        const parts = discountValue.split('.')
        if (parts.length > 2) {
            discountValue = parts[0] + '.' + parts[1]
        }

        // Limitar el descuento máximo a 100%
        if (parseFloat(discountValue) > 100) {
            discountValue = '100'
        }

        setDiscount(discountValue)
        // El precio promocional se actualiza automáticamente mediante el useEffect
    }

    const handlePromoPriceChange = (e) => {
        let value = e.target.value
        console.log(value)

        // Limpiar el valor y permitir solo números y punto decimal
        value = value.replace('€', '').replace(',', '.')
        value = value.replace(/[^0-9.]/g, '')

        // Limitar a un solo punto decimal
        const parts = value.split('.')
        if (parts.length > 2) {
            value = parts[0] + '.' + parts[1]
        }

        setPromoPrice(value)
        setManualPromo(true) // Indica que el usuario está ingresando el precio manualmente
    }

    const handlePackChange = (e) => {
        setSelectedPackId(e.target.value)
        setManualPromo(false) // Al cambiar el pack, volvemos al cálculo automático del descuento
    }

    const handleCreateUser = () => {
        confirm('User not found. Do you want to create a new user and let them access the platform?', accepted => {
            if (accepted) {
                setShowCreateUser(true)
            }
        }, 'warn')
    }

    const handleHomeClick = event => {
        event.preventDefault()
        props.onHomeClick()
    }

    // Nuevas funciones para manejar el dropdown de clientes
    const handleCustomerSearchChange = (e) => {
        const value = e.target.value
        setCustomerSearch(value)
        setSelectedCustomer(null)
        setShowDropdown(value.length > 0)
    }

    const handleCustomerSelect = (customer) => {
        if (customer.id === 'invite') {
            // Opción especial para invitar usuario
            setShowCreateUser(true)
            setShowDropdown(false)
        } else {
            setSelectedCustomer(customer)
            setCustomerSearch(customer.name)
            setShowDropdown(false)
        }
    }

    const handleCustomerInputFocus = () => {
        if (customerSearch.length > 0) {
            setShowDropdown(true)
        }
    }

    const handleCustomerInputBlur = () => {
        // Usar setTimeout para permitir que el click en el dropdown funcione
        setTimeout(() => {
            setShowDropdown(false)
        }, 150)
    }

    // Filtrar clientes basado en la búsqueda
    const filteredCustomers = customers.filter(customer =>
        customer.name.toLowerCase().includes(customerSearch.toLowerCase()) ||
        customer.email.toLowerCase().includes(customerSearch.toLowerCase()) ||
        (customer.username && customer.username.toLowerCase().includes(customerSearch.toLowerCase()))
    )

    return (
        <main className="flex flex-col items-center bg-color_backgroundGrey w-full flex-grow pt-12">
            {showCreateUser ? (
                <CreateUserByProvider onUserCreated={() => setShowCreateUser(false)} />
            ) : (
                <>
                    <h2 className="text-2xl font-bold mb-6">Assign pack to customer</h2>

                    <div className="bg-white shadow-md rounded p-6 w-full max-w-4xl">
                        <form className="grid grid-cols-1 md:grid-cols-2 gap-6" onSubmit={handleSubmit}>
                            {/* Columna Izquierda */}
                            <div className="space-y-4">
                                <Field>
                                    <Label htmlFor="customerSearch">Find customer</Label>
                                    <div className="relative">
                                        <InputOnChange
                                            id="customerSearch"
                                            personalClasses="border-2 rounded-lg w-full"
                                            type="text"
                                            placeholder="Use email or username"
                                            value={customerSearch}
                                            onChange={handleCustomerSearchChange}
                                            onFocus={handleCustomerInputFocus}
                                            onBlur={handleCustomerInputBlur}
                                        />

                                        {/* Dropdown de clientes */}
                                        {showDropdown && (
                                            <div className="absolute z-10 w-full bg-white border border-gray-300 rounded-lg shadow-lg mt-1 max-h-60 overflow-y-auto">
                                                {/* Opción para invitar usuario (siempre primera) */}
                                                <div
                                                    className="px-4 py-2 hover:bg-blue-50 cursor-pointer border-b border-gray-200 text-blue-600 font-medium"
                                                    onMouseDown={() => handleCustomerSelect({ id: 'invite' })}
                                                >
                                                    ➕ Invite user to application
                                                </div>

                                                {/* Lista de clientes filtrados */}
                                                {filteredCustomers.length > 0 ? (
                                                    filteredCustomers.map(customer => (
                                                        <div
                                                            key={customer.id}
                                                            className="px-4 py-2 hover:bg-gray-50 cursor-pointer"
                                                            onMouseDown={() => handleCustomerSelect(customer)}
                                                        >
                                                            <div className="font-medium text-gray-900">{customer.name}</div>
                                                            <div className="text-sm text-gray-500">{customer.email}</div>
                                                        </div>
                                                    ))
                                                ) : customerSearch.length > 0 ? (
                                                    <div className="px-4 py-2 text-gray-500 italic">
                                                        No customers found matching "{customerSearch}"
                                                    </div>
                                                ) : (
                                                    <div className="px-4 py-2 text-gray-500 italic">
                                                        Start typing to search customers...
                                                    </div>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                    <span className="text-sm hover:cursor-pointer text-gray-500 hover:text-gray-800 font-bold"
                                        type="button"
                                        onClick={() => setShowCreateUser(true)}
                                    >➕ Create customer</span>
                                </Field>

                                <Field>
                                    <Label htmlFor="selectPack">Select Pack</Label>
                                    <select
                                        id="selectPack"
                                        name="selectPack"
                                        className="border-2 rounded-lg w-full p-2"
                                        value={selectedPackId}
                                        onChange={handlePackChange} // Nuevo manejador para cambios en el select
                                    >
                                        {basePacks.map((basePack) => (
                                            <option key={basePack.id} value={basePack.id}>
                                                {basePack.packName} - {basePack.price}
                                                {getCurrencySymbol(basePack)}
                                            </option>
                                        ))}
                                    </select>
                                </Field>

                                <Field>
                                    <Label htmlFor="discount">Discount %</Label>
                                    <InputOnChange
                                        id="discount"
                                        onChange={handleDiscountChange}
                                        value={discount}
                                        personalClasses="border-2 rounded-lg w-full"
                                        type="text"
                                        placeholder="ex. 20"
                                    />
                                </Field>

                                <Field>
                                    <Label htmlFor="promoPrice">Promo price</Label>
                                    <InputOnChange
                                        id="promoPrice"
                                        onChange={handlePromoPriceChange}
                                        value={promoPrice}
                                        personalClasses="border-2 rounded-lg w-full"
                                        type="text"
                                        placeholder="0"
                                    />
                                </Field>

                                <Field>
                                    <Label htmlFor="description">Description</Label>
                                    <Textarea
                                        id="description"
                                        placeholder="Description about this pack for this customer"
                                        personalClasses="border-2 rounded-lg w-full"
                                    />
                                </Field>
                            </div>

                            {/* Columna Derecha */}
                            <div className="space-y-4">
                                <Field>
                                    <Label htmlFor="payedAmount">Payed Amount</Label>
                                    <Input
                                        id="payedAmount"
                                        personalClasses="border-2 rounded-lg w-full"
                                        type="text"
                                        placeholder="0"
                                    />
                                </Field>

                                <Field>
                                    <Label htmlFor="paymentReference">Reference</Label>
                                    <Input
                                        className="border-2 rounded-lg"
                                        type="text"
                                        id="paymentReference"
                                        placeholder="Payment reference"
                                        required={false}
                                    />
                                </Field>

                                <Field>
                                    <Label htmlFor="paymentMethod">Select Payment Method</Label>
                                    <select
                                        id="paymentMethod"
                                        name="paymentMethod"
                                        className="border-2 rounded-lg w-full p-2"
                                    >
                                        <option value="card">Card</option>
                                        <option value="cash">Cash</option>
                                        <option value="bankTransfer">Bank Transfer</option>
                                        <option value="paypal">Paypal</option>
                                        <option value="stripe">Stripe</option>
                                        <option value="others">Others</option>
                                    </select>
                                </Field>
                            </div>

                            {/* Botón al final ocupando el ancho de ambas columnas */}
                            <div className="md:col-span-2 flex justify-center">
                                <Button type="submit">Assign Pack</Button>
                            </div>
                        </form>
                    </div>
                    <a href="" title="Go back home" onClick={handleHomeClick} className="mt-4 hover:underline">Back to home</a>
                </>
            )}
        </main>
    )
}
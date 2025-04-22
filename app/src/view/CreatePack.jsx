import { errors } from 'com'

//import logic from '../logic'

import CreatePack from './../logic/packs/createPack.js'

const { SystemError, SubscriptionError } = errors

import useContex from './useContext'

import { Button, Field, Input, Label, Textarea } from '../library'

export default function Create(props) {

    const { alert } = useContex()

    const handleSubmit = event => {
        event.preventDefault()

        const { target: form } = event

        let {
            packName: { value: packName },
            packDescription: { value: packDescription },
            quantity: { value: quantity },
            unit: { value: unit },
            expiringTime: { value: expiringTime },
            price: { value: price },
            currency: { value: currency }
        } = form

        //Check correct format for price
        let formattedPrice = price.replace(',', '.')
        formattedPrice = formattedPrice.replace('€', '')
        price = formattedPrice

        try {
            CreatePack(packName, packDescription, quantity, unit, expiringTime, price, currency)
                .then(() => {
                    form.reset()
                    alert(' New pack was created successfully', 'success')
                    props.onPackCreated()

                })
                .catch(error => {
                    console.error('Pack creation error:', error)

                    if (error instanceof SubscriptionError) {
                        alert(error.message, 'error') // Mensaje específico para límites
                        // Opcional: mostrar UI especial para upgrade de plan
                    }
                    else if (error instanceof SystemError) {
                        alert('There was a system problem, please try again later', 'error')
                    }
                    else if (error instanceof Error && Object.values(errors).some(E => error instanceof E)) {
                        alert(error.message, 'error')
                    }
                    // Errores inesperados
                    else {
                        alert('An unexpected error occurred', 'error')
                    }
                })

        } catch (error) {
            alert('An unexpected error occurred during pack creation', 'error')
            console.error('Synchronous error in pack creation:', error)
        }
    }

    const handleHomeClick = event => {
        event.preventDefault()
        props.onHomeClick()
    }

    return <main className="flex flex-col items-center bg-color_backgroundGrey w-full flex-grow pt-12">
        <h2 className="text-2xl font-bold mb-6">Create new service</h2>

        <div className="bg-white shadow-md rounded p-6 w-full max-w-4xl">
            <form className="grid grid-cols-1 md:grid-cols-2 gap-6" onSubmit={handleSubmit}>

                <div className="space-y-4">
                    <Field>
                        <Label htmlFor="packName">Service name</Label>
                        <Input personalClasses="border-2 rounded-lg w-full" type="text" id="packName" placeholder="Pack name" />
                    </Field>

                    <Field>
                        <Label htmlFor="packDescription">Service description</Label>
                        <Textarea personalClasses="border-2 rounded-lg w-full h-28 p-2" id="packDescription" placeholder="Pack description goes here" />
                    </Field>

                    <Field>
                        <Label htmlFor="quantity">Quantity</Label>
                        <Input personalClasses="border-2 rounded-lg w-full" type="number" id="quantity" placeholder="Quantity" />
                    </Field>
                </div>

                <div className="space-y-4">
                    <Field>
                        <Label htmlFor="unit">Unit</Label>
                        <select id="unit" name="unit" className="border-2 rounded-lg w-full p-2">
                            <option value="hours">Hours</option>
                            <option value="units">Units</option>
                        </select>
                    </Field>

                    <Field>
                        <Label htmlFor="expiringTime">Expiring service time</Label>
                        <select id="expiringTime" name="expiringTime" className="border-2 rounded-lg w-full p-2">
                            <option value="-1">Unlimited</option>
                            <option value="1">1 Month</option>
                            <option value="2">2 Months</option>
                            <option value="3">3 Months</option>
                            <option value="4">4 Months</option>
                            <option value="5">5 Months</option>
                            <option value="6">6 Months</option>
                            <option value="7">7 Months</option>
                            <option value="8">8 Months</option>
                            <option value="9">9 Months</option>
                            <option value="10">10 Months</option>
                            <option value="11">11 Months</option>
                            <option value="12">12 Months</option>
                        </select>
                    </Field>

                    <Field>
                        <Label htmlFor="price">Price</Label>
                        <Input personalClasses="border-2 rounded-lg w-full" type="text" id="price" placeholder="50,00 €" required={true} />
                        <input type="hidden" id="currency" defaultValue="EUR" />
                    </Field>
                </div>

                <div className="md:col-span-2 flex justify-center">
                    <Button type="submit">Create Service</Button>
                </div>
            </form>
        </div>

        <a href="" title="Go back home" onClick={handleHomeClick} className="mt-4 hover:underline">Back to home</a>
    </main >
}
import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Field, Button, Input, Label, TagKO, TagOK, TagWARN, TagEXTRA, Card } from '../../library';
import { ActivityTable } from '../components'
import { errors } from 'com';

import useContext from '../useContext';
import logic from '../../logic';

const { SystemError } = errors

export default function UpdateCustomerPack({ onUpdated, onPaymentAdded, onPaymentDeleted, onCancelClick, pack }) {
    const { alert, confirm } = useContext()
    const [packActivities, setPackActivities] = useState([])
    const [payments, setPayments] = useState([])
    const [formattedTime, setFormattedTime] = useState('')

    useEffect(() => {
        const fetchData = async () => {
            try {
                const activities = await logic.getActivitiesByPackId(pack.id)
                setPackActivities(activities)

            } catch (error) {
                alert(error.message)
                console.error(error)
            }
        }
        fetchData()

        const getPayments = async () => {
            try {
                const payments = await logic.getPayments(pack.id)
                setPayments(payments)

            } catch (error) {
                alert(error.message)
                console.error(error)
            }
        }
        getPayments()
    }, [])

    useEffect(() => {
        if (pack.unit !== 'units') {
            try {
                const timeFormatted = logic.getDecimalToTimeFormat(pack.remainingQuantity)
                setFormattedTime(timeFormatted)
            } catch (error) {
                console.error(error)
                setFormattedTime('')
            }
        }
    }, [pack.unit, pack.remainingQuantity])

    const handleSubmit = event => {
        event.preventDefault()
        const { target: form } = event
        const {
            packDescription: { value: packDescription },
            remainingQuantity: { value: remainingQuantity },
            expiryDate: { value: expiryDate },
            packStatus: { value: packStatus }
        } = form

        try {
            logic.updatePack(pack.id, packDescription, remainingQuantity, new Date(expiryDate), packStatus)
                .then(() => {
                    alert('Pack updated successfully!', 'success')
                    onUpdated()
                })
                .catch((error) => {
                    alert(error.message)
                    console.error(error)
                })
        } catch (error) {
            alert(error.message)
            console.error(error)
        }
    }

    const handleCancelClick = event => {
        event.preventDefault()
        onCancelClick()
    }

    const handlePaymentSubmit = async (event) => {
        event.preventDefault()
        const { target: form } = event
        let {
            amount: { value: amount },
            paymentMethod: { value: paymentMethod },
            paymentReference: { value: paymentReference }
        } = form

        if (!amount || !paymentMethod) {
            alert('Please provide the required information')
            return
        }

        //Check correct format for price
        let formattedAmount = amount.replace(',', '.')
        formattedAmount = formattedAmount.replace('€', '')
        amount = formattedAmount

        try {
            await logic.addPayment(pack.id, amount, pack.currency, paymentMethod, paymentReference)
                .then(() => {
                    alert('Payment added successfully', 'success');
                    onPaymentAdded()
                    form.reset(); // Reinicia el formulario
                })
                .catch((error) => {
                    alert(error.message)
                    console.error(error)
                })
        } catch (error) {
            alert(error.message)
            console.error(error)
        }
    }

    const deletePaymentHandler = (event, paymentId) => {
        event.preventDefault()
        confirm('Do you want delete this item? -This action can\'t be reversed', accepted => {
            if (accepted) {
                try {
                    logic.deletePayment(paymentId)
                        .then(() => {
                            // Filtra el pago eliminado de la lista de pagos actual
                            setPayments((prevPayments) =>
                                prevPayments.filter((payment) => payment.id !== paymentId)
                            )
                            alert("Payment deleted successfully!", "success")
                            onPaymentDeleted()
                        })
                        .catch((error) => {
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

    if (!pack) {
        return <p>There was a problem loading customer pack</p>
    } else {
        return <main className="w-full bg-color_backgroundGrey flex-grow pt-5 pb-10">
            <div className="w-full max-w-6xl mx-auto px-4">
                <h2 className="text-2xl font-bold text-color_darkBlue mb-4 text-center">"{pack.description}"</h2>
                <div className="flex flex-col w-full space-y-6">
                    {/* Pack Status Cards */}
                    <div className="pack_statuses grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                        {pack.timerActivated !== null && (
                            <div className="col-span-full bg-white rounded-lg shadow-md overflow-hidden mb-2 border-l-4 border-green-500">
                                <div className="bg-gradient-to-r from-green-50 to-white p-4 animate-pulse">
                                    <div className="flex justify-between items-center">
                                        <div className="flex items-center">
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-500 mr-2 animate-spin" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                            </svg>
                                            <h3 className="text-lg font-bold text-green-800">Timer Active</h3>
                                        </div>
                                        <span className="text-sm text-green-600">Started: {new Date().toLocaleString()}</span>
                                    </div>
                                    {pack.descriptionActivityTemp && (
                                        <p className="mt-2 text-sm text-gray-700">
                                            <span className="font-medium">Current activity:</span> {pack.descriptionActivityTemp}
                                        </p>
                                    )}
                                </div>
                            </div>
                        )}

                        <Card
                            title="Pack Status"
                            value={pack.status}
                            valueClass={pack.status === 'Active' ? 'text-green-500' : 'text-red-500'}
                        />
                        <Card
                            title="Payment Status"
                            value={pack.paymentStatus}
                            valueClass={pack.paymentStatus === 'completed' ? 'text-green-500' : pack.paymentStatus === 'partially payed' ? 'text-yellow-500' : pack.paymentStatus === 'payment exceded' ? 'text-purple-500' : 'text-red-500'}
                        />
                        <Card
                            title="Price"
                            value={pack.price + ' ' + pack.currency || '0'}
                            valueClass="text-gray-800"
                        />
                        <Card
                            title="Payed Amount"
                            value={pack.totalPayments + ' ' + pack.currency || '0'}
                            valueClass="text-gray-800"
                        />
                        {parseFloat(pack.price) - parseFloat(pack.totalPayments) > 0 ? (
                            <Card
                                title="Pending Amount"
                                value={(parseFloat(pack.price) - parseFloat(pack.totalPayments)).toFixed(2) + ' ' + pack.currency || '0'}
                                valueClass="text-gray-800 text-red-500"
                            />) : null}
                        <Card
                            title="Original Quantity"
                            value={pack.formattedOriginal}
                            valueClass="text-gray-800"
                        />
                        <Card
                            title="Remaining Quantity"
                            value={pack.formattedRemaining}
                            valueClass="text-gray-800"
                        />
                    </div>

                    {/* Update Pack Form */}
                    <form className="flex flex-col justify-items-start bg-white shadow-md rounded-lg p-6" onSubmit={handleSubmit}>
                        <h3 className="text-xl font-bold text-gray-700 mb-4">Update Pack Details</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <Field>
                                <Label htmlFor="packDescription">Pack description</Label>
                                <Input className="border-2 rounded-lg w-full" type="text" id="packDescription" placeholder="Pack name" defaultValue={pack.description} />
                            </Field>

                            <Field>
                                <Label htmlFor="remainingQuantity">Remaining Quantity</Label>
                                <Input
                                    className="border-2 rounded-lg w-full"
                                    type={pack.unit === 'units' ? 'number' : 'text'}
                                    id="remainingQuantity"
                                    placeholder={pack.unit === 'units' ? '0' : '00:00:00'}
                                    defaultValue={pack.unit === 'units' ? pack.remainingQuantity : formattedTime}
                                />
                            </Field>

                            <Field>
                                <Label htmlFor="packStatus">Pack Status</Label>
                                <select id="packStatus" name="packStatus" className="border-2 rounded-lg w-full p-2" defaultValue={pack.status} required>
                                    <option value="Pending">Pending</option>
                                    <option value="Active">Active</option>
                                    <option value="Expired">Expired</option>
                                    <option value="Finished">Finished</option>
                                </select>
                            </Field>

                            <Field>
                                <Label htmlFor="expiryDate">Expire Date</Label>
                                <Input className="border-2 rounded-lg w-full"
                                    type="date"
                                    id="expiryDate"
                                    defaultValue={pack.expiryDate ? new Date(pack.expiryDate).toISOString().split('T')[0] : ''} />
                            </Field>
                        </div>

                        <div className="flex items-center justify-center mt-6 gap-4">
                            <Button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md transition-colors duration-300 flex items-center" type="submit">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                </svg>
                                Update
                            </Button>
                            <Button className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md transition-colors duration-300 flex items-center" onClick={handleCancelClick}>
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                                </svg>
                                Cancel
                            </Button>
                        </div>
                    </form>

                    {/* Activity Log Section */}
                    <div className="bg-white shadow-md rounded-lg p-6">
                        <h2 className='text-2xl font-bold text-color_darkBlue mb-4'>Activity Log</h2>
                        <ActivityTable activities={packActivities} packInfo={pack} />
                    </div>

                    {/* Payments History Section */}
                    <div className="bg-white shadow-md rounded-lg p-6">
                        <h2 className='text-2xl font-bold text-color_darkBlue mb-4'>Payments History</h2>

                        {payments.length === 0 ? (
                            <div className="text-center text-gray-500 py-4">
                                No payment records found for this pack.
                            </div>
                        ) : (
                            <div className="w-full">
                                {/* Table for medium and large screens */}
                                <div className="hidden md:block overflow-x-auto">
                                    <table className="min-w-full divide-y divide-gray-200 rounded-lg overflow-hidden">
                                        <thead className="bg-gray-100">
                                            <tr>
                                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Method</th>
                                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Reference</th>
                                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody className="bg-white divide-y divide-gray-200">
                                            {payments.slice().reverse().map((payment) => (
                                                <tr key={payment.id} className="hover:bg-gray-50">
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{new Date(payment.date).toLocaleString()}</td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{payment.amount} {payment.currency}</td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{payment.method}</td>
                                                    <td className="px-6 py-4 whitespace-normal text-sm text-gray-600 max-w-xs truncate">{payment.reference || '-'}</td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                                                        <button
                                                            onClick={(event) => deletePaymentHandler(event, payment.id)}
                                                            className="flex items-center text-red-600 hover:text-red-800 transition-colors duration-200"
                                                        >
                                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                            </svg>
                                                            Delete
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>

                                {/* Cards for small screens */}
                                <div className="md:hidden grid grid-cols-1 gap-4">
                                    {payments.slice().reverse().map(payment => (
                                        <div
                                            key={payment.id}
                                            className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-200"
                                        >
                                            <div className="bg-gray-700 text-white py-2 px-4 flex justify-between items-center">
                                                <h3 className="font-semibold text-sm">{payment.method}</h3>
                                                <span className="text-xs">{new Date(payment.date).toLocaleDateString()}</span>
                                            </div>
                                            <div className="p-4">
                                                <div className="mb-3">
                                                    <div className="flex justify-between items-center mb-2">
                                                        <span className="text-sm text-gray-600">Amount:</span>
                                                        <span className="font-bold">{payment.amount} {payment.currency}</span>
                                                    </div>

                                                    {payment.reference && (
                                                        <div className="text-sm">
                                                            <span className="text-gray-600">Reference:</span>
                                                            <p className="text-gray-800 break-words mt-1">{payment.reference}</p>
                                                        </div>
                                                    )}
                                                </div>

                                                <button
                                                    onClick={(event) => deletePaymentHandler(event, payment.id)}
                                                    className="w-full flex items-center justify-center bg-red-100 hover:bg-red-200 text-gray-800 py-2 px-3 rounded-md transition-colors duration-200 text-sm font-medium"
                                                >
                                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                    </svg>
                                                    Delete Payment
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Add Payment Section */}
                    {parseFloat(pack.price) - parseFloat(pack.totalPayments) > 0 ? (
                        <div className="bg-white shadow-md rounded-lg p-6">
                            <h2 className='text-2xl font-bold text-color_darkBlue mb-4'>Add Pending Payment</h2>
                            <form id='addPayment' onSubmit={handlePaymentSubmit} className='grid grid-cols-1 sm:grid-cols-3 gap-4'>
                                <Field>
                                    <Label htmlFor="amount">Amount</Label>
                                    <Input className="border-2 rounded-lg w-full" type="text" defaultValue={(parseFloat(pack.price) - parseFloat(pack.totalPayments)).toFixed(2)} id="amount" placeholder="0" required={true} />
                                </Field>
                                <Field>
                                    <Label htmlFor="paymentReference">Reference</Label>
                                    <Input className="border-2 rounded-lg w-full" type="text" id="paymentReference" placeholder="Payment reference" required={false} />
                                </Field>
                                <Field>
                                    <Label htmlFor="paymentMethod">Payment Method</Label>
                                    <select id="paymentMethod" name="paymentMethod" className="border-2 rounded-lg w-full p-2" required>
                                        <option value="card">Card</option>
                                        <option value="cash">Cash</option>
                                        <option value="bankTransfer">Bank Transfer</option>
                                        <option value="paypal">Paypal</option>
                                        <option value="stripe">Stripe</option>
                                        <option value="others">Others</option>
                                    </select>
                                </Field>
                                <div className="sm:col-span-3 flex justify-center mt-2">
                                    <Button className="bg-gray-700 hover:bg-gray-800 text-white px-6 py-2 rounded-md transition-colors duration-300 flex items-center">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                                            <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                                        </svg>
                                        Add Payment
                                    </Button>
                                </div>
                            </form>
                        </div>
                    ) : null}
                </div>
            </div>
        </main>
    }
}
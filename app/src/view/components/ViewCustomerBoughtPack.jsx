import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Field, Button, Input, Label, TagKO, TagOK, TagWARN, TagEXTRA, Card } from '../../library';
import { ActivityTable } from '.'
import { errors } from 'com';

import useContext from '../useContext';
import logic from '../../logic';

const { SystemError } = errors

export default function UpdateCustomerPack({ pack }) {
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
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </main>
    }
}
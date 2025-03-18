import { getDecimalToTimeFormat } from "../../logic/helpers";

export default function ActivityTable({ activities, packInfo }) {
    if (activities.length === 0) {
        return (
            <div className="text-center text-gray-500 py-4">
                No activity records found for this pack.
            </div>
        );
    }

    return (
        <div className="w-full">
            {/* Table for medium and large screens */}
            <div className="hidden md:block overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200 rounded-lg overflow-hidden">
                    <thead className="bg-gray-100">
                        <tr>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Operation</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Remaining</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {activities.slice().reverse().map((activity) => {
                            // Determine operation display text and color
                            let operationColor;
                            if (activity.operation === 'manual adjustment') {
                                operationColor = 'text-purple-800';
                            } else {
                                const isAddOperation = activity.operation === 'add';
                                operationColor = isAddOperation ? 'text-green-600' : 'text-red-600';
                            }

                            let operationText;
                            if (activity.operation === 'manual adjustment') {
                                operationText = 'Manual Adjustment';
                            } else if (packInfo.unit === 'hours') {
                                operationText = activity.operation === 'add'
                                    ? `+ ${getDecimalToTimeFormat(activity.quantity)} h`
                                    : `- ${getDecimalToTimeFormat(activity.quantity)} h`;
                            } else {
                                operationText = activity.operation === 'add'
                                    ? `+ ${activity.quantity} un.`
                                    : `- ${activity.quantity} un.`;
                            }

                            // Format the remaining quantity
                            const remainingText = packInfo.unit === 'hours'
                                ? `${getDecimalToTimeFormat(activity.remainingQuantity)} h`
                                : `${activity.remainingQuantity} un.`;

                            return (
                                <tr key={activity.id} className="hover:bg-gray-50">
                                    <td className="px-6 py-4 whitespace-normal text-sm text-gray-900">{activity.description}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{new Date(activity.date).toLocaleString()}</td>
                                    <td className={`px-6 py-4 whitespace-nowrap text-sm font-medium ${operationColor}`}>{operationText}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{remainingText}</td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>

            {/* Cards for small screens */}
            <div className="md:hidden grid grid-cols-1 gap-4">
                {activities.slice().reverse().map((activity) => {
                    // Determine operation display text and color
                    let operationColor;
                    if (activity.operation === 'manual adjustment') {
                        operationColor = 'text-purple-800';
                    } else {
                        const isAddOperation = activity.operation === 'add';
                        operationColor = isAddOperation ? 'text-green-600' : 'text-red-600';
                    }

                    let operationText;
                    if (activity.operation === 'manual adjustment') {
                        operationText = 'Manual Adjustment';
                    } else if (packInfo.unit === 'hours') {
                        operationText = activity.operation === 'add'
                            ? `+ ${getDecimalToTimeFormat(activity.quantity)} h`
                            : `- ${getDecimalToTimeFormat(activity.quantity)} h`;
                    } else {
                        operationText = activity.operation === 'add'
                            ? `+ ${activity.quantity} un.`
                            : `- ${activity.quantity} un.`;
                    }

                    // Format the remaining quantity
                    const remainingText = packInfo.unit === 'hours'
                        ? `${getDecimalToTimeFormat(activity.remainingQuantity)} h`
                        : `${activity.remainingQuantity} un.`;

                    return (
                        <div key={activity.id} className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-200">
                            <div className="bg-gray-700 text-white py-2 px-4 flex justify-between items-center">
                                <h3 className="font-semibold text-sm truncate">{new Date(activity.date).toLocaleDateString()}</h3>
                                <span className="text-xs">{new Date(activity.date).toLocaleTimeString()}</span>
                            </div>
                            <div className="p-4">
                                <p className="text-sm text-gray-600 mb-3">{activity.description}</p>

                                <div className="grid grid-cols-2 gap-x-2 gap-y-1 text-sm">
                                    <span className="text-gray-600 font-medium">Operation:</span>
                                    <span className={`text-right font-semibold ${operationColor}`}>{operationText}</span>

                                    <span className="text-gray-600 font-medium">Remaining:</span>
                                    <span className="text-right font-semibold">{remainingText}</span>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
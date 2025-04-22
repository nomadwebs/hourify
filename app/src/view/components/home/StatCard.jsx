export default function StatCard({ label, value, icon, borderColor, bgColor, iconColor }) {
    return (
        <div className={`bg-white rounded-lg shadow-md p-4 border-l-4 ${borderColor}`}>
            <div className="flex justify-between items-start">
                <div>
                    <p className="text-sm text-gray-500">{label}</p>
                    <p className="text-2xl font-bold">{value}</p>
                </div>
                <div className={`p-2 ${bgColor} rounded-full`}>
                    <div className={`h-6 w-6 ${iconColor}`}>
                        {icon}
                    </div>
                </div>
            </div>
        </div>
    )
}
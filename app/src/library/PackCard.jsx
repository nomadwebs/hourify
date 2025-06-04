import { TagKO, TagOK } from './index'

const lang = 'uk'

const i18n = {
    //España
    es: {
        timmerActive: 'Temporizador activo',
        remaining: 'Disponible',
    },

    //English
    uk: {
        timmerActive: 'Temporizador activo',
        remaining: 'Remaining',
    }
}

export default function PackCard({
    id,
    customerName,
    originalQuantity,
    remainingQuantity,
    formattedRemaining,
    description,
    descriptionActivityTemp,
    formattedPurchaseDate,
    formattedExpiryDate,
    status,
    timerActivated,

}) {
    return (
        <div
            key={id}
            className='bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300 cursor-pointer border border-transparent hover:border-color_primary'
        /* onClick={(event) => handleManageClick(event, pack)} */
        >
            <div className='bg-gray-700 text-white py-2 px-4'>
                <h3 className='font-semibold truncate'>{customerName}</h3>
            </div>
            <div className='p-4'>
                {timerActivated && (
                    <div className='flex items-center gap-1 bg-green-50 border-l-2 border-green-500 px-2 py-1 mb-2 rounded-sm animate-pulse'>
                        <svg xmlns='http://www.w3.org/2000/svg' className='h-3 w-3 text-green-600 animate-spin' fill='none' viewBox='0 0 24 24' stroke='currentColor'>
                            <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z' />
                        </svg>
                        {/* <span className='text-xs font-medium text-green-800'>Timer active</span> */}
                        <span className='text-xs font-medium text-green-800'>{i18n[lang].timmerActive}</span>
                    </div>
                )}

                <div className='flex justify-between items-center mb-1'>
                    {/* <span className='text-sm font-medium text-gray-600'>Remaining:</span> */}
                    <span className='text-sm font-medium text-gray-600'>{i18n[lang].remaining}:</span>
                    <span className='font-semibold'>{formattedRemaining}</span>
                </div>

                <div className='relative w-full h-2 bg-gray-200 rounded-full mb-3 overflow-hidden'>
                    <div
                        className={`absolute top-0 left-0 h-full transition-all duration-300 ${(remainingQuantity / originalQuantity) * 100 < 20
                            ? 'bg-red-500'
                            : 'bg-purple-500'
                            }`}
                        style={{
                            width: `${Math.max(0, Math.min(100, (remainingQuantity / originalQuantity) * 100))}%`,
                            minWidth: '2px'
                        }}
                    ></div>
                </div>

                <div className='mb-3 text-sm text-gray-600 line-clamp-2'>
                    {descriptionActivityTemp || description}
                </div>

                <div className='flex justify-between text-xs text-gray-500 mb-3'>
                    <div>
                        <div>Purchase: {formattedPurchaseDate}</div>
                        <div>Expires: {formattedExpiryDate}</div>
                    </div>
                    <div className='flex items-start'>
                        {status === 'Active' && (<TagOK>Active</TagOK>)}
                        {status === 'Pending' && (<TagKO>Pending</TagKO>)}
                        {status === 'Expired' && (<TagKO>Expired</TagKO>)}
                        {status === 'Finished' && (<TagKO>Finished</TagKO>)}
                    </div>
                </div>
            </div>
        </div>
    )
} 
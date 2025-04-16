import React from 'react'

export default function Error404({ onBackHome }) {
    return (
        <main className="flex flex-col items-center bg-color_backgroundGrey w-full flex-grow pt-12 px-4">
            <div className="text-center max-w-md bg-white p-8 rounded-lg shadow-md">
                <h1 className="text-3xl font-bold text-red-600 mb-2">Error 404</h1>
                <p className="text-gray-700 mb-4">
                    This page does not exist or it was removed.
                </p>
                <button
                    onClick={onBackHome}
                    className="mt-4 bg-color_primary text-color_strongGrey py-2 px-4 rounded-md hover:bg-color_primaryHover transition-colors duration-300"
                >
                    Back to Home
                </button>
            </div>
        </main>
    )
}

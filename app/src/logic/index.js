import {
    registerUser,
    isUserLoggedIn,
    loginUser,
    logoutUser,
    getUserId,
    getUserName,
    getCustomers,
    getUserDetails,
    updateUser,
    getCustomerPacks,
    createUserByProvider
} from './users'

import {
    createPack,
    getBasePacks,
    getBasePacksDetails,
    assignPack,
    deleteBasePack,
    updateBasePack,
    getAdquiredPacks,
    updatePack,
    getProviderSoldPacks,
    getCustomerBoughtPacks,
    getPackDetails
} from './packs'

import {
    getActivitiesByPackId,
} from './activities'


import {
    toggleTimeTracker,
    toggleManualTimeTracker,
    toggleManualUnitsTracker,
} from './tracker'


import {
    getPayments,
    addPayment,
    deletePayment
} from './payments'

import {
    addTask,
    getTasks,
    deleteTask,
    updateTask
} from './tasks'

import {
    getDecimalToTimeFormat,
    getTimeFormatFromDecimal,
    getProfileImage,
    formatCurrencyES
} from './helpers'

import {
    getUserStats,
    usePendingPayments
} from './home'

import {
    getMonthEarned,
    getMonthPayments,
    getMonthHoursTracked,
    getMonthUnitsTracked
} from './stats'

const logic = {
    //Users
    registerUser,
    isUserLoggedIn,
    loginUser,
    logoutUser,
    getUserId,
    getUserName,
    getCustomers,
    getUserDetails,
    updateUser,
    getCustomerPacks,
    createUserByProvider,

    //Packs
    createPack,
    getBasePacks,
    getBasePacksDetails,
    assignPack,
    deleteBasePack,
    updateBasePack,
    getAdquiredPacks,
    updatePack,
    getProviderSoldPacks,
    getCustomerBoughtPacks,
    getPackDetails,

    //Activities
    getActivitiesByPackId,

    //Helpers
    getDecimalToTimeFormat,
    getTimeFormatFromDecimal,
    getProfileImage,
    formatCurrencyES,


    //Tracker
    toggleTimeTracker,
    toggleManualTimeTracker,
    toggleManualUnitsTracker,


    //Payments
    getPayments,
    addPayment,
    deletePayment,

    //Tasks
    addTask,
    getTasks,
    deleteTask,
    updateTask,

    //Home
    getUserStats,
    usePendingPayments,

    //Stats
    getMonthEarned,
    getMonthHoursTracked,
    getMonthPayments,
    getMonthUnitsTracked
}

export default logic
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
    addTask
} from './tasks'

import {
    getDecimalToTimeFormat,
    getTimeFormatFromDecimal,
    getProfileImage,
} from './helpers'

import {
    getUserStats,
} from './home'

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

    //Activities
    getActivitiesByPackId,

    //Helpers
    getDecimalToTimeFormat,
    getTimeFormatFromDecimal,
    getProfileImage,

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

    //Home
    getUserStats
}

export default logic
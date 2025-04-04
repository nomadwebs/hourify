//USERS
import {
    registerUser,
    authenticateUser,
    getUserName,
    getCustomers,
    getUserDetails,
    updateUser,
    getCustomerPacks,
    createUserByProvider,
    updateUserPlan
} from './users/index.js'

//PACKS & BASEPACKS
import {
    createBasePack,
    assignPack,
    getBasePacks,
    getBasePackDetails,
    deleteBasePack,
    updateBasePack,
    getAdquiredPacks,
    checkPackAndUpdate,
    updatePack,
    getCustomerBoughtPacks,
    getProviderSoldPacks,
    getPackDetails
} from './packs/index.js'

//EMAILING
import {
    emailRegisterWelcome,
    sendEmail,
} from './emailing/index.js'

//TRACKER
import {
    toggleTimeTracker,
    toggleManualTimeTracker,
    toggleManualUnitsTracker
} from './tracker/index.js'

//ACTIVITY
import {
    getActivityByPackId,

} from './activity/index.js'

//TASKS
import {
    addTask,
    getTasks,
    deleteTask,
    updateTask
} from './tasks/index.js'

//PAYMENTS
import {
    addPayment,
    getPayments,
    deletePayment
} from './payments/index.js'

//STATS
import {
    getMonthEarned,
    getMonthPayments
} from './stats/index.js'

const logic = {
    //Users
    registerUser,
    authenticateUser,
    getUserName,
    getCustomers,
    getUserDetails,
    updateUser,
    getCustomerPacks,
    createUserByProvider,
    updateUserPlan,


    //Packs and basebacks
    createBasePack,
    assignPack,
    getBasePacks,
    getBasePackDetails,
    deleteBasePack,
    updateBasePack,
    getAdquiredPacks,
    checkPackAndUpdate,
    updatePack,
    getCustomerBoughtPacks,
    getProviderSoldPacks,
    getPackDetails,

    //emailing
    emailRegisterWelcome,
    sendEmail,

    //Tracker
    toggleTimeTracker,
    toggleManualTimeTracker,
    toggleManualUnitsTracker,

    //Activity
    getActivityByPackId,


    //Payments
    addPayment,
    getPayments,
    deletePayment,

    //Tasks
    addTask,
    getTasks,
    deleteTask,
    updateTask,

    //Stats
    getMonthEarned,
    getMonthPayments
}

export default logic
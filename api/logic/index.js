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
    updateUserPlan,
    changePassword,
    updateProfileImage,
    getCreatedUsers,
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
    addActivityComment,

} from './activity/index.js'

//TASKS
import {
    addTask,
    getTasks,
    deleteTask,
    updateTask
} from './tasks/index.js'

//CALENDAR
import {
    addEvent,
    getEvents,
    updateEvent,
    deleteEvent
} from './calendar/index.js'

//PAYMENTS
import {
    addPayment,
    getPayments,
    deletePayment
} from './payments/index.js'

//STATS
import {
    getMonthEarned,
    getMonthPayments,
    getMonthHoursTracked,
    getMonthUnitsTracked
} from './stats/index.js'

//CONTACTS
import {
    createContact,
    getContacts,
    deleteContact,
    updateContact
} from './contacts/index.js'

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
    changePassword,
    updateProfileImage,
    getCreatedUsers,

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
    addActivityComment,

    //Payments
    addPayment,
    getPayments,
    deletePayment,

    //Tasks
    addTask,
    getTasks,
    deleteTask,
    updateTask,

    //Calendar
    addEvent,
    getEvents,
    updateEvent,
    deleteEvent,

    //Stats
    getMonthEarned,
    getMonthPayments,
    getMonthHoursTracked,
    getMonthUnitsTracked,

    //Contacts
    createContact,
    getContacts,
    deleteContact,
    updateContact
}

export default logic
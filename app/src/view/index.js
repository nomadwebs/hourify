import Home from './Home'

//Packs Managing
import ManagePacks from './ManagePacks'
import ManagePurchasedPacks from './ManagePurchasedPacks'
import AssignPack from './AssignPack'
import CreatePack from './CreatePack'

//Customers Managing
import ManageCustomers from './ManageCustomers'
import CustomerPacks from './CustomerPacks'

//Users Managing
import Register from "./Register"
import Login from './Login'
import UserProfile from "./UserProfile"

//Tracker Managing
import Tracker from "./Tracker"

//Tasks Managing
import Tasks from "./Tasks"

import { Alert, Confirm } from "./components"


export {

    //Packs
    Register,
    Home,
    Login,

    //Users
    ManagePacks,
    ManageCustomers,
    ManagePurchasedPacks,
    AssignPack,
    CreatePack,
    UserProfile,
    CustomerPacks,


    //Tracker
    Tracker,

    //Tasks
    Tasks,

    //Others
    Alert,
    Confirm
}
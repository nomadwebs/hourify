import { connect, disconnect } from 'mongoose'

import { BasePack, User, Pack, Activity, Payment, Task, Event } from './model.js'

import './boost-mongoose.js'

const db = {
    connect,
    disconnect
}

export default db

export {
    BasePack,
    User,
    Pack,
    Activity,
    Payment,
    Task,
    Event,
}
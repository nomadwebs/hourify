import mongoose from 'mongoose'

const { Schema, model, Types: { ObjectId } } = mongoose

//Model for users master data
const user = new Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        minLength: 5,
        maxLength: 30
    },
    password: {
        type: String,
        required: true,
        minLength: 8,
        maxLength: 100
    },
    email: {
        type: String,
        required: true,
        unique: true,
        match: /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i,
        maxLength: 255,
    },
    plan: {
        type: String,
        required: true,
        enum: ['free', 'pro'],
        default: 'free'
    },
    reason: {
        type: String,
        required: false,
        enum: ['', 'earlyAdopterPromo']
    },
    planExpiryDate: {
        type: Date,
        required: false,
        default: null
    },
    role: {
        type: String,
        required: false, //WILL BE TRUE
        enum: ['standard', 'provider'],
        default: 'standard'
    },
    dni: {
        type: String,
        required: false,
        maxLength: 9,
        match: /^[0-9]{8}[A-Z]$/ // Valida el formato del DNI
    },
    name: {
        type: String,
        required: false,
        maxLength: 50
    },
    surname1: {
        type: String,
        required: false,
        maxLength: 50
    },
    surname2: {
        type: String,
        required: false,
        maxLength: 50
    },
    biography: {
        type: String,
        required: false,
        maxLength: 1000
    },
    country: {
        type: String,
        required: false,
        maxLength: 50,
    },
    province: {
        type: String,
        required: false,
        maxLength: 50,
    },
    city: {
        type: String,
        required: false,
        maxLength: 50,
    },
    postalCode: {
        type: String,
        required: false,
        maxLength: 10
    },
    address1: {
        type: String,
        required: false,
        maxLength: 255,
    },
    address2: {
        type: String,
        required: false,
        maxLength: 255,
    },
    number: {
        type: String,
        required: false,
        maxLength: 3
    },
    flat: {
        type: Number,
        required: false,
        maxLength: 3
    },
    legalName: {
        type: String,
        required: false,
        maxLength: 255
    },
    website: {
        type: String,
        required: false,
        maxLength: 255
    },
    creationStatus: {
        type: String,
        required: true,
        enum: ['true', 'false', 'confirm account'],
        default: 'true'
    },
    customers: [{
        type: ObjectId, // Esto debe ser correcto
        ref: 'User',    // Esto debe coincidir con el modelo de usuario
        required: false // Este campo es opcional
    }],
    ownPacks: [{
        type: ObjectId,
        ref: 'Pack',
        required: false
    }],
    adquiredPacks: [{
        type: ObjectId,
        ref: 'Pack',
        required: false
    }],
    profileImage: {
        type: String,
        required: false,
        default: '',
        maxLength: 512,
    },
    createdDate: {
        type: Date,
        required: true,
        default: Date.now
    },
    createdBy: {
        type: ObjectId,
        required: false,
        ref: 'User'
    },
    lastLogin: {
        type: Date,
        required: false,
        default: null
    },
}, { versionKey: false })


//Model for packs configuration
const basePack = new Schema({
    user: {
        type: ObjectId,
        required: true,
        ref: 'User'
    },

    packName: {
        type: String,
        maxLength: 50,
        required: true
    },

    description: {
        type: String,
        maxLength: 255,
        required: false
    },

    quantity: {
        type: Number,
        required: true,
    },

    unit: {
        type: String,
        required: true,
        enum: ['hours', 'units'],
        default: 'hours'
    },

    expiringTime: {
        type: Number,
        required: false,
        validate: {
            validator: function (value) {
                return value === -1 || (value >= 1 && value <= 12) //-1 means than don't have limit
            },
            message: 'expiringTime must be -1 (to unlimited) or number of month between 1 and 12'
        },
        default: -1
    },

    price: {
        type: Number,
        required: true
    },

    currency: {
        type: String,
        required: true,
        enum: ['EUR', 'USD'],
        default: 'EUR'
    },

    vat: {
        type: Number,
        required: false, //TODO: Ready to add Prices with VAT
    },

    priceWithVat: {
        type: Number,
        required: false,
    },

    archived: {
        type: Boolean,
        required: false,
        default: false
    }

}, { versionKey: false })




//Model por pack/customer/provider relationship
const pack = new Schema({

    refPack: {
        type: ObjectId,
        ref: 'BasePack',
        required: true
    },

    provider: {
        type: ObjectId,
        ref: 'User',
        required: true
    },

    customer: {
        type: ObjectId,
        ref: 'User',
        required: true
    },

    description: {
        type: String,
        required: false,
        maxLength: 255
    },

    timerActivated: {
        type: Date,
        required: false,
        default: null
    },

    descriptionActivityTemp: {
        type: String,
        required: false,
        maxLength: 255
    },

    originalQuantity: {
        type: Number,
        required: true,
    },

    remainingQuantity: {
        type: Number,
        required: true,
    },

    unit: {
        type: String,
        required: true,
        enum: ['hours', 'units'],
        //default: 'hours'
    },

    price: {
        type: Number,
        required: true
    },

    currency: {
        type: String,
        required: true,
        enum: ['EUR', 'USD'],
        default: 'EUR'
    },

    purchaseDate: {
        type: Date,
        required: true,
        default: Date.now
    },

    expiryDate: {
        type: Date,
        required: false,
        default: null
    },

    status: {
        type: String,
        required: true,
        enum: ['Pending', 'Active', 'Expired', 'Finished'],
        default: 'Pending'
    },

    archived: {
        type: Boolean,
        required: false,
        default: false
    }
}, { versionKey: false })



//Model activity to follow up projects and repporting 
const activity = new Schema({
    pack: {
        type: String,
        required: true,
        ref: 'Pack'
    },

    date: {
        type: Date,
        required: true,
        default: null
    },

    description: {
        type: String,
        maxLength: 255,
        required: false
    },

    operation: {
        type: String,
        required: true,
        enum: ['add', 'substract', 'manual adjustment'],
    },

    quantity: {
        type: Number,
        required: true,
    },

    remainingQuantity: {
        type: Number,
        required: false, //TODO: Modificar a true cuando cambie de base de datos
    }

}, { versionKey: false })



//Model to payment control. 
const payment = new Schema({
    pack: {
        type: String,
        required: true,
        ref: 'Pack'
    },

    amount: {
        type: Number,
        required: true
    },

    currency: {
        type: String,
        required: true,
        enum: ['EUR', 'USD'],
        default: 'EUR'
    },

    date: {
        type: Date,
        required: true,
        default: null
    },

    method: {
        type: String,
        required: true,
        enum: ['card', 'bankTransfer', 'paypal', 'stripe', 'cash', 'bizum', 'others'],
    },

    reference: {
        type: String,
        required: false,
        maxLength: 255,
    }

}, { versionKey: false })


//Model for task management
const task = new Schema({
    description: {
        type: String,
        required: true,
        maxLength: 500
    },

    createdDate: {
        type: Date,
        required: true,
        default: Date.now
    },

    dueDate: {
        type: Date,
        required: false
    },

    userOwner: {
        type: ObjectId,
        ref: 'User',
        required: true
    },

    // Customer can be optionally assigned to a task, regardless of pack relationship
    customer: {
        type: ObjectId,
        ref: 'User',
        required: false
    },

    relatedPack: {
        type: ObjectId,
        ref: 'Pack',
        required: false
    },

    completed: {
        type: Boolean,
        required: true,
        default: false
    },

    completedDate: {
        type: Date,
        required: false
    },

    priority: {
        type: String,
        required: true,
        enum: ['Low', 'Medium', 'High', 'Urgent'],
        default: 'Medium'
    },

    status: {
        type: String,
        required: true,
        enum: ['Pending', 'In Progress', 'On Hold', 'Completed', 'Cancelled'],
        default: 'Pending'
    },

    notes: {
        type: String,
        required: false,
        maxLength: 1000
    },

    lastModified: {
        type: Date,
        default: Date.now
    }

    /* Fields for future implementation */
    /*
    estimatedHours: {
        type: Number,
        required: false
    },

    actualHours: {
        type: Number,
        required: false
    },
    */

    /* Additional fields for future implementation */
    /*
    tags: [{
        type: String,
        maxLength: 30
    }],

    attachments: [{
        name: String,
        path: String,
        uploadDate: {
            type: Date,
            default: Date.now
        }
    }],
    */
}, { versionKey: false })

const event = new Schema({
    title: {
        type: String,
        required: true
    },

    description: {
        type: String,
        required: false
    },

    location: {
        type: String,
        required: false
    },

    creator: {
        type: ObjectId,
        ref: 'User',
        required: true
    },

    attendees: [{
        type: ObjectId,
        ref: 'User'
    }],

    startDateTime: {
        type: Date,
        required: true
    },

    endDateTime: {
        type: Date,
        required: true
    },

    typeEvent: {
        type: String,
        required: false,
        enum: ['Meeting', 'Call', 'Delivery', 'Training', 'Others']
    },

    createdAt: {
        type: Date,
        default: Date.now
    }
}, { versionKey: false })


const message = new Schema({
    sender: {
        type: ObjectId,
        ref: 'User',
        required: true
    },
    recipient: {
        type: ObjectId,
        ref: 'User',
        required: true
    },
    content: {
        type: String,
        required: true,
        maxLength: 2000
    },
    sentAt: {
        type: Date,
        default: Date.now,
        required: true
    },
    read: {
        type: Boolean,
        default: false,
        required: true
    },
    readAt: {
        type: Date,
        default: null
    },
    archived: {
        type: Boolean,
        default: false
    }
}, { versionKey: false })



const User = model('User', user)
const BasePack = model('BasePack', basePack)
const Pack = model('Pack', pack)
const Activity = model('Activity', activity)
const Payment = model('Payment', payment)
const Task = model('Task', task)
const Event = model('Event', event)
const Message = model('Message', message)


export {
    User,
    BasePack,
    Pack,
    Activity,
    Payment,
    Task,
    Event,
    Message
}
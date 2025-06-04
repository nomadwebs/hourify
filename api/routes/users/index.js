import { Router, json } from 'express'
import multer from 'multer'
import path from 'path'

// Define el storage de Multer
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        // Aquí guardas las imágenes en la carpeta deseada
        cb(null, path.resolve('public/images/profile'))
    },
    filename: function (req, file, cb) {
        // Nombra el archivo, por ejemplo, usando el ID del usuario y la fecha
        const ext = path.extname(file.originalname)
        cb(null, `${req.userId}-${Date.now()}${ext}`)
    }
})

// Filtros para solo aceptar imágenes (opcional pero recomendado)
const fileFilter = (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
        cb(null, true)
    } else {
        cb(new Error('Only image files are allowed!'), false)
    }
}

// Crea el middleware de Multer
const upload = multer({ storage, fileFilter })

import { authorizationHandler, jsonBodyParser } from '../helpers/index.js'
import {
    authenticateUserHandler,
    registerUserHandler,
    getUserNameHandler,
    getCustomersHandler,
    getUserDetailsHandler,
    updateUserHandler,
    getCustomerPacksHandler,
    createUserByProviderHandler,
    changePasswordHandler,
    updateProfileImageHandler,
    uploadProfileImageHandler,
    getCreatedUsersHandler
} from './handlers/index.js'

const usersRouter = Router()

usersRouter.post('/auth', jsonBodyParser, authenticateUserHandler)
usersRouter.post('/register', jsonBodyParser, registerUserHandler)
usersRouter.get('/:targetUserId/name', authorizationHandler, getUserNameHandler)
usersRouter.get('/customers', authorizationHandler, getCustomersHandler)
usersRouter.get('/created-users', authorizationHandler, getCreatedUsersHandler)
usersRouter.get('/customerpacks/:customerId', authorizationHandler, getCustomerPacksHandler)
usersRouter.get('/user/:targetUserId', authorizationHandler, getUserDetailsHandler)
usersRouter.put('/update/:targetUserId', authorizationHandler, jsonBodyParser, updateUserHandler)
usersRouter.post('/createByProvider', authorizationHandler, jsonBodyParser, createUserByProviderHandler)
usersRouter.put('/changePassword', authorizationHandler, jsonBodyParser, changePasswordHandler)
usersRouter.put('/updateProfileImage/:targetUserId', authorizationHandler, jsonBodyParser, updateProfileImageHandler)
//usersRouter.post('/uploadProfileImage', authorizationHandler, jsonBodyParser, uploadProfileImageHandler)
usersRouter.post('/uploadProfileImage', authorizationHandler, upload.single('image'), uploadProfileImageHandler)
export default usersRouter  
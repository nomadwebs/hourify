import 'dotenv/config'
import db from 'dat'
import express, { json } from 'express'
import cors from 'cors'
import './cron/downgradePlansJob.js';
import multer from 'multer'

import { errorHandler } from './routes/helpers/index.js'
import { usersRouter, packsRouter, trackerRouter, activitiesRouter, paymentsRouter, tasksRouter, calendarRouter, statsRouter } from './routes/index.js'

db.connect(process.env.MONGO_URL).then(() => {
    //console.log('database connected')

    const server = express()

    // Configuración de límites para JSON y URL-encoded
    server.use(json({ limit: '10mb' }))
    server.use(express.urlencoded({ limit: '10mb', extended: true }))

    server.use(cors())

    // Configuración básica de multer
    const upload = multer({
        limits: {
            fileSize: 2 * 1024 * 1024 // límite de 2MB
        }
    })

    server.get('/', (_, res) => res.send('API is Up Ready to go'))

    //Here will be all the endpoints of the API. 
    server.use('/users', usersRouter)
    server.use('/packs', packsRouter)
    server.use('/tracker', trackerRouter)
    server.use('/activities', activitiesRouter)
    server.use('/payments', paymentsRouter)
    server.use('/tasks', tasksRouter)
    server.use('/calendar', calendarRouter)
    server.use('/stats', statsRouter)
    server.use('/images/profile', express.static('public/images/profile'))

    server.use(errorHandler)

    server.listen(process.env.PORT, () => console.log(`api is up and listening on port ${process.env.PORT}`))
})
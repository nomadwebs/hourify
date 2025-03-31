import { Router, json } from "express"

import { jsonBodyParser, authorizationHandler } from "../helpers/index.js"

import {
    createBasePackHandlers,
    assingPackHandlers,
    getBasePacks,
    getBasePacksDetailsHandler,
    deleteBasePackHandler,
    updateBasePackHandler,
    getAdquiredPacksHandler,
    updatePackHandler,
    getProviderSoldPacksHandler,
    getCustomerBoughtPacksHandler,
    getPackDetailsHandler,
} from './handlers/index.js'
import getCustomerBoughtPacks from "../../logic/packs/getCustomerBoughtPacks.js"

const packsRouter = Router()

packsRouter.post('/create-pack', authorizationHandler, jsonBodyParser, createBasePackHandlers)
packsRouter.post('/assign-pack', authorizationHandler, jsonBodyParser, assingPackHandlers)
packsRouter.get('/get-basepack', authorizationHandler, getBasePacks)
packsRouter.get('/get-basepack-details/:basePackId', getBasePacksDetailsHandler)
packsRouter.get('/get-pack-details/:packId', authorizationHandler, getPackDetailsHandler)
packsRouter.delete('/delete/:basePackId', authorizationHandler, deleteBasePackHandler)
packsRouter.put('/update/:basePackId', authorizationHandler, jsonBodyParser, updateBasePackHandler)
packsRouter.put('/updatepack/:packId', authorizationHandler, jsonBodyParser, updatePackHandler)
packsRouter.get('/get-adquired-packs/:targetUserId', authorizationHandler, getAdquiredPacksHandler)
packsRouter.get('/get-prov-sold-packs/:userId', authorizationHandler, getProviderSoldPacksHandler)
packsRouter.get('/get-cust-bought-packs/:userId', authorizationHandler, getCustomerBoughtPacksHandler)

export default packsRouter
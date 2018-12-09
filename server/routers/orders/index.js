const express = require('express')
const userMiddleware = require('../../middleware/userMiddleware')
const getOrders = require('./controllers/getOrders')
const createOrder = require('./controllers/createOrder')

const router = express.Router()

router.get('/', userMiddleware, getOrders)
router.post('/', userMiddleware, createOrder)

module.exports = router

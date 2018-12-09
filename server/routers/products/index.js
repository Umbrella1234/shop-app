const express = require('express')
const getProducts = require('./controllers/getProducts')
const userMiddleware = require('../../middleware/userMiddleware')

const router = express.Router()

router.get('/', userMiddleware, getProducts)

module.exports = router

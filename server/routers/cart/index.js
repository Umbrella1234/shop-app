const express = require('express')
const userMiddleware = require('../../middleware/userMiddleware')
const getCart = require('./controllers/getCart')
const updateCart = require('./controllers/updateCart')
const deleteCartProduct = require('./controllers/deleteCartProduct')
const addProductToCart = require('./controllers/addProductToCart')

const router = express.Router()

router.get('/get', userMiddleware, getCart)
router.post('/update', userMiddleware, updateCart)
router.post('/delete', userMiddleware, deleteCartProduct)
router.post('/add', userMiddleware, addProductToCart)

module.exports = router

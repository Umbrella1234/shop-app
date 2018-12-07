const express = require('express')
const userMiddleware = require('../../middleware/userMiddleware')
const {
  getCartData,
  getCalcPriceArguments
} = require('../../utils/cartPriceCalculators')
const {
  getErrorMessage,
  getSuccessMessage
} = require('../../contstants/messages')
const router = express.Router()

router.get('/', userMiddleware, (req, res) => {
  const { db } = req.app.locals
  const orders = db.get('orders').value()

  res.send({ orders })
})

router.post('/', userMiddleware, (req, res) => {
  const { db } = req.app.locals
  const { userId } = res.locals

  const cart = db
    .get('carts')
    .find({ userId })
    .value()

  if (!cart) {
    res.send(getErrorMessage('user has no cart'))
    return
  }

  const calcPriceArguments = getCalcPriceArguments(db, userId)
  const { priceWithoutDiscount, discount } = getCartData(calcPriceArguments)

  const order = {
    userId,
    timeStamp: +new Date(),
    productIds: cart.products.map(product => product.id),
    productCount: cart.products.length,
    price: priceWithoutDiscount,
    discount
  }

  db.get('orders')
    .push(order)
    .write()
  db.get('carts')
    .remove({ userId })
    .write()

  res.send(getSuccessMessage({ order }))
})

module.exports = router

const moment = require('moment')
const {
  getCartData,
  getCartDataArgs
} = require('../../../utils/cartPriceCalculators')
const {
  getErrorMessage,
  getSuccessMessage
} = require('../../../contstants/messages')

module.exports = function (req, res) {
  const { db } = req.app.locals
  const { userId } = res.locals

  const cart = db
    .get('carts')
    .find({ userId })
    .value()

  if (!cart) {
    res.send(getErrorMessage.status(400)('user has no cart'))
    return
  }

  const calcPriceArguments = getCartDataArgs(db, userId)
  const { priceWithDiscount, discount } = getCartData(calcPriceArguments)

  const order = {
    userId,
    timeStamp: moment.utc(),
    products: cart.products,
    productsCount: cart.products.length,
    price: priceWithDiscount,
    discount
  }

  db.get('orders')
    .push(order)
    .write()
  db.get('carts')
    .remove({ userId })
    .write()

  res.send(getSuccessMessage({ order }))
}

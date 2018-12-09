const {
  getCartData,
  getCartDataArgs
} = require('../../../utils/cartPriceCalculators')
const {
  getErrorMessage,
  getSuccessMessage
} = require('../../../contstants/messages')

module.exports = function (req, res) {
  const { userId } = res.locals
  const { db } = req.app.locals
  let { productId } = req.query

  const carts = db.get('carts')
  const cart = carts.find({ userId })
  const cartData = cart.value()

  // delete all products from a cart
  if (!productId) {
    carts.remove({ userId }).write()
    const calcPriceArguments = getCartDataArgs(db, userId)
    const prices = getCartData(calcPriceArguments)
    res.send(getSuccessMessage(prices))
    return
  }

  productId = +productId

  if (!cartData) {
    res.status(400).send(getErrorMessage('User has no cart, nothing to delete from'))
    return
  }

  const productsInCart = cart.get('products')
  const productInCart = productsInCart.find({ id: productId })
  const productInCartValue = productInCart.value()

  if (!productInCartValue) {
    res.send(getErrorMessage('User doenst have this product in his cart'))
    return
  }

  productsInCart.remove({ id: productId }).write()

  const calcPriceArguments = getCartDataArgs(db, userId)
  const prices = getCartData(calcPriceArguments)

  res.send(getSuccessMessage(prices))
}

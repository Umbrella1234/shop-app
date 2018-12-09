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

  if (!productId) {
    return res.send(getErrorMessage('Product id is not provided'))
  }

  productId = +productId

  const newProduct = { id: productId, quantity: 1 }

  const carts = db.get('carts')
  const cart = carts.find({ userId })
  const cartData = cart.value()

  if (cartData) {
    const products = cart.get('products')
    const productInCart = products.find({ id: productId })
    const productInCartValue = productInCart.value()

    if (productInCartValue) {
      productInCart.set('quantity', productInCartValue.quantity + 1).write()
    } else {
      products.push(newProduct).write()
    }
  } else {
    carts.push({ userId, products: [newProduct] }).write()
  }

  const calcPriceArguments = getCartDataArgs(db, userId)
  const prices = getCartData(calcPriceArguments)

  res.send(getSuccessMessage(prices))
}

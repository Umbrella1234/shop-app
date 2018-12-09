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
  const { product } = req.body

  const carts = db.get('carts')
  let cart = carts.find({ userId })
  let cartData = cart.value()

  if (!cartData) {
    res.send(getErrorMessage('User has no cart'))
    return
  }

  const productId = +Object.keys(product)[0]
  const productQuantity = Object.values(product)[0]
  const isZeroQuantity = productQuantity === 0

  if (productQuantity < 0) {
    res.status(400).send(getErrorMessage('Cant set product quantity to less than zero'))
    return
  }

  // create cart if user doesnt have it
  if (!cartData) {
    cartData = { userId, products: [] }
    carts.push(cartData).write()
    cart = carts.find({ userId })
  }

  const userProducts = cart.get('products')
  const userProductsData = userProducts.value()

  const productInCart = userProducts.find({ id: productId })
  const productInCartData = productInCart.value()

  if (isZeroQuantity) {
    if (!productInCartData) {
      res.status(400).send(getErrorMessage('Product is not in cart'))
      return
    }

    const isOnlyItemInCart =
      userProductsData.length === 1 && userProductsData.quantity === 1

    if (isOnlyItemInCart) {
      carts.remove({ userId }).write()
    } else {
      userProducts.remove({ id: productId }).write()
    }
  } else {
    if (productInCartData) {
      productInCart.set('quantity', productQuantity).write()
    } else {
      userProducts.push({ id: productId, quantity: productQuantity }).write()
    }
  }

  const calcPriceArguments = getCartDataArgs(db, userId)
  const prices = getCartData(calcPriceArguments)

  res.send(getSuccessMessage(prices))
}

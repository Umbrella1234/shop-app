const express = require('express')
const {
  getCartData,
  getCalcPriceArguments
} = require('../../utils/cartPriceCalculators')
const {
  getErrorMessage,
  getSuccessMessage
} = require('../../contstants/messages')
const userMiddleware = require('../../middleware/userMiddleware')

const router = express.Router()

router.get('/get', userMiddleware, function (req, res) {
  const { userId } = res.locals
  const { db } = req.app.locals

  const calcPriceArguments = getCalcPriceArguments(db, userId)
  const prices = getCartData(calcPriceArguments)

  res.send(prices)
})

router.post('/update', userMiddleware, function (req, res) {
  const { userId } = res.locals
  const { db } = req.app.locals
  const { product } = req.body

  const productId = +Object.keys(product)[0]
  const productQuantity = Object.values(product)[0]
  const shouldDeleteProduct = productQuantity === 0

  const carts = db.get('carts')
  let cart = carts.find({ userId })
  let cartData = cart.value()

  // if user has no cart there is nothing to delete
  if (!cartData && shouldDeleteProduct) {
    res.send(getErrorMessage('User has no cart'))
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

  if (shouldDeleteProduct) {
    if (!productInCartData) {
      res.send(
        getErrorMessage('Product is not in cart, so there is nothing to delete')
      )
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
      productInCart
        .set('quantity', productInCartData.quantity + productQuantity)
        .write()
    } else {
      userProducts.push({ id: productId, quantity: productQuantity }).write()
    }
  }

  const calcPriceArguments = getCalcPriceArguments(db, userId)
  const prices = getCartData(calcPriceArguments)

  res.send(getSuccessMessage(prices))
})

router.post('/add', userMiddleware, function (req, res) {
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

  const calcPriceArguments = getCalcPriceArguments(db, userId)
  const prices = getCartData(calcPriceArguments)

  res.send(getSuccessMessage(prices))
})

router.post('/delete', userMiddleware, function (req, res) {
  const { userId } = res.locals
  const { db } = req.app.locals
  let { productId } = req.query

  const carts = db.get('carts')
  const cart = carts.find({ userId })
  const cartData = cart.value()

  // delete all products from a cart
  if (!productId) {
    carts.remove({ userId }).write()
    const calcPriceArguments = getCalcPriceArguments(db, userId)
    const prices = getCartData(calcPriceArguments)
    res.send(getSuccessMessage(prices))
    return
  }

  productId = +productId

  if (!cartData) {
    res.send(getErrorMessage('User has no cart, nothing to delete from'))
    return
  }

  const products = cart.get('products')
  const productsData = products.value()
  const productInCart = products.find({ id: productId })
  const productInCartValue = productInCart.value()

  if (!productInCartValue) {
    res.send(getErrorMessage('User doenst have this product in his cart'))
    return
  }

  const isOneProduct = productInCartValue.quantity === 1
  const shouldRemoveCart = isOneProduct && productsData.length === 1

  if (shouldRemoveCart) {
    carts.remove({ userId }).write()
  } else {
    if (isOneProduct) {
      products.remove({ id: productId }).write()
    } else {
      productInCart.set('quantity', productInCartValue.quantity - 1).write()
    }
  }

  const calcPriceArguments = getCalcPriceArguments(db, userId)
  const prices = getCartData(calcPriceArguments)

  res.send(getSuccessMessage(prices))
})

module.exports = router

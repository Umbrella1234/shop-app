const path = require('path')
const express = require('express')
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')
const low = require('lowdb')
const FileAsync = require('lowdb/adapters/FileAsync')

const app = express()

app.use(bodyParser.json())
app.use(cookieParser())
app.use(express.static(path.join(__dirname, 'public')))

const router = express.Router()
app.use('/api/v1/cart', router)

const getSuccessMessage = data => {
  const msg = { result: 'OK' }
  if (data) msg.data = data

  return msg
}

const getErrorMessage = message => ({
  result: 'ERROR',
  message
})

function calcPriceWithDiscount (sumDiscounts, priceWithoutDiscount) {
  const discountSums = sumDiscounts
    .map(discountObj => discountObj.sum)
    .concat(priceWithoutDiscount)
  const discountIndex =
    discountSums
      .sort((a, b) => a - b)
      .findIndex(discountSum => discountSum === priceWithoutDiscount) - 1
  const hasDiscount = discountIndex !== -1

  if (hasDiscount) {
    const discountPercent = sumDiscounts[discountIndex].discountPercent / 100
    return priceWithoutDiscount * (1 - discountPercent)
  }

  return priceWithoutDiscount
}

function calcCartPrice (
  cartProducts,
  products,
  sumDiscounts,
  orderDiscounts,
  amountOfOrders
) {
  const priceWithoutDiscount = cartProducts.reduce((sum, cartProduct) => {
    const { price } = products.find(product => product.id === cartProduct.id)
    sum += price * cartProduct.quantity
    return sum
  }, 0)

  const priceWithDiscount = calcPriceWithDiscount(
    sumDiscounts,
    priceWithoutDiscount
  )
  
  // abstract me
  const orderQuantities = orderDiscounts
    .map(orderObj => orderObj.quantity)
    .concat(amountOfOrders)
  const orderDiscountIndex =
    orderQuantities
      .sort((a, b) => a - b)
      .findIndex(orderQuantity => orderQuantity === amountOfOrders) - 1
  const hasOrderDiscount = orderDiscountIndex !== -1
  if (hasOrderDiscount) {
    const discountPercent =
      orderDiscounts[orderDiscountIndex].discountPercent / 100
    return priceWithDiscount * (1 - discountPercent)
  }
  return priceWithDiscount
}

low(new FileAsync('./server/db.json')).then(db => {
  const userMiddleware = (req, res, next) => {
    let { userId } = req.cookies

    if (!userId) {
      res.send(getErrorMessage('UserId cookie is missing'))
      return
    }

    userId = +userId

    const users = db.get('users')
    let userData = users.find({ id: userId }).value()

    // create anonymous user
    if (!userData) {
      userData = {
        id: userId,
        firstname: null,
        lastname: null,
        middlename: null,
        isAnonymous: true
      }
      users.push(userData).write()
    }

    res.locals.userData = userData
    res.locals.userId = +userId

    next()
  }

  router.get('/get', userMiddleware, function (req, res) {
    const { userId } = res.locals

    const cart = db.get('carts').find({ userId })
    const cartData = cart.value()
    const products = cartData ? cart.get('products') : []

    res.send({ products })
  })

  router.post('/update', userMiddleware, function (req, res) {
    const { userId } = res.locals
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
          getErrorMessage(
            'Product is not in cart, so there is nothing to delete'
          )
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

    res.send(getSuccessMessage())
  })

  router.post('/add', userMiddleware, function (req, res) {
    const { userId } = res.locals
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

    res.send(getSuccessMessage())
  })

  router.post('/delete', userMiddleware, function (req, res) {
    const { userId } = res.locals
    let { productId } = req.query

    const carts = db.get('carts')
    const cart = carts.find({ userId })
    const cartData = cart.value()

    // delete all products from a cart
    if (!productId) {
      carts.remove({ userId }).write()
      res.send(getSuccessMessage())
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

    res.send(getSuccessMessage())
  })

  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'public', 'index.html'))
  })

  app.listen(process.env.PORT || 8080, () =>
    console.log('server has started started')
  )
})

/*
Todo:
товарам добавить кол-во, прик адом добавлении/удалении выдавать
endpoint for orders

- Кнопка “Удалить” удаляет 1 строку из таблицы, стоимость пересчитывается
- Кнопка “Удалить все” очищает всю таблицу
- Предусмотреть функционал скидок, зашитых в код и не изменяемых пользователем. Для примера должны быть заполнены следующие скидки:
    - до 9999 рублей - 0%
    - от 10 000 рублей - 5%
    - от 15 000 рублей - 10%
    - от 20 000 рублей и более - 15%
- Если итоговая стоимость не попадает под скидку, то визуально в блоке “Итого”, только 1 строчка - Цена.
- Если итоговая стоимость попадает под скидку, то внешний вид как на прототипе, не забыть изменить значение скидки в строке
- Стоимость для строки считается на скрипте когда товаров больше 0, товаров меньше 0 быть не может, но строку удалять не надо
*/

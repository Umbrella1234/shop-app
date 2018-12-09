const { roundNumber } = require('./helpers')

function getCartDataArgs (db, userId) {
  const cart = db.get('carts').find({ userId })
  const cartData = cart.value()
  const cartProducts = cartData ? cart.get('products').value() : []

  const allProducts = db.get('products').value()
  const sumDiscounts = db.get('sumDiscounts').value()
  const orderDiscounts = db.get('orderDiscounts').value()
  const ordersOfUser = db
    .get('orders')
    .filter({ userId })
    .value()

  const amountOfOrders = ordersOfUser ? ordersOfUser.length : 0

  return {
    cartProducts,
    allProducts,
    sumDiscounts,
    orderDiscounts,
    amountOfOrders
  }
}

function getSumDiscountPercent (sumDiscounts, priceWithoutDiscount) {
  const discountSums = sumDiscounts
    .map(discountObj => discountObj.sum)
    .concat(priceWithoutDiscount)
  const discountIndex =
    discountSums
      .sort((a, b) => a - b)
      .findIndex(discountSum => discountSum === priceWithoutDiscount) - 1
  const hasDiscount = discountIndex !== -1

  return hasDiscount ? sumDiscounts[discountIndex].discountPercent : 0
}

function getOrderDiscountPercent (orderDiscounts, amountOfOrders) {
  const orderQuantities = orderDiscounts
    .map(orderObj => orderObj.quantity)
    .concat(amountOfOrders)
  const orderDiscount = orderDiscounts.find(
    orderDiscount => orderDiscount.quantity === amountOfOrders
  )
  let discountPercent = !!orderDiscount && orderDiscount.discountPercent

  if (!discountPercent) {
    const orderDiscountIndex =
      orderQuantities
        .sort((a, b) => a - b)
        .findIndex(orderQuantity => orderQuantity === amountOfOrders) - 1
    const hasOrderDiscount = orderDiscountIndex !== -1

    discountPercent = hasOrderDiscount
      ? orderDiscounts[orderDiscountIndex].discountPercent
      : 0
  }

  return discountPercent
}

function getCartData ({
  cartProducts,
  allProducts,
  sumDiscounts,
  orderDiscounts,
  amountOfOrders
}) {
  if (!cartProducts.length) {
    return {
      cartProducts,
      priceWithoutDiscount: 0,
      priceWithDiscount: 0,
      discount: 0,
      discountPercent: 0,
      productsInCart: 0
    }
  }

  const priceWithoutDiscount = cartProducts.reduce((sum, cartProduct) => {
    const { price } = allProducts.find(product => product.id === cartProduct.id)
    sum += price * cartProduct.quantity
    return sum
  }, 0)

  const sumDiscountPercent = getSumDiscountPercent(
    sumDiscounts,
    priceWithoutDiscount
  )

  const ordersDiscountPercent = getOrderDiscountPercent(
    orderDiscounts,
    amountOfOrders
  )

  const discountPercent = sumDiscountPercent + ordersDiscountPercent

  const priceWithDiscount = roundNumber(
    priceWithoutDiscount * (1 - discountPercent / 100)
  )

  const discount = priceWithoutDiscount - priceWithDiscount

  return {
    cartProducts,
    priceWithoutDiscount,
    priceWithDiscount,
    discount,
    discountPercent,
    productsInCart: cartProducts.reduce(
      (res, product) => res + product.quantity,
      0
    )
  }
}

module.exports = {
  getCartData,
  getCartDataArgs
}

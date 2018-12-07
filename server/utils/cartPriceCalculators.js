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

function getCalcPriceArguments (db, userId) {
  const cart = db.get('carts').find({ userId })
  const cartData = cart.value()
  const cartProducts = cartData ? cart.get('products').value() : []

  const allProducts = db.get('products').value()
  const sumDiscounts = db.get('sumDiscounts').value()
  const orderDiscounts = db.get('orderDiscounts').value()
  const ordersOfUser = db
    .get('orders')
    .find({ userId })
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

  let priceWithDiscount = calcPriceWithDiscount(
    sumDiscounts,
    priceWithoutDiscount
  )

  // с ордером неправильно расчитывается скидка
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

  const discount = priceWithoutDiscount - priceWithDiscount

  return {
    cartProducts,
    priceWithoutDiscount,
    priceWithDiscount,
    discount,
    discountPercent: (discount / priceWithoutDiscount) * 100,
    productsInCart: cartProducts.reduce((res, product) => res + product.quantity, 0)
  }
}

module.exports = {
  getCartData,
  getCalcPriceArguments
}

module.exports = function (req, res) {
  const { userId } = res.locals
  const { db } = req.app.locals
  const orders = db
    .get('orders')
    .filter({ userId })
    .value()

  if (!orders) {
    res.send({ orders: [] })
  }

  const products = db.get('products').value()
  const ordersWithProductData = orders.map(order => {
    order.products = order.products.map(orderedProduct => {
      const orderedProductData = products.find(
        product => product.id === orderedProduct.id
      )
      return { ...orderedProduct, ...orderedProductData }
    })

    return order
  })

  const userData = db
    .get('users')
    .find({ id: userId })
    .value()

  res.send({ orders: ordersWithProductData, userData })
}

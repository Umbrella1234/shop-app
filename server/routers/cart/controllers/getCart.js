const {
  getCartData,
  getCartDataArgs
} = require('../../../utils/cartPriceCalculators')

module.exports = function (req, res) {
  const { userId } = res.locals
  const { db } = req.app.locals

  const calcPriceArguments = getCartDataArgs(db, userId)
  const prices = getCartData(calcPriceArguments)

  res.send(prices)
}

module.exports = function (req, res) {
  const { db } = req.app.locals
  const products = db.get('products').value()

  res.send({ products })
}

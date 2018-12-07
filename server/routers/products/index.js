const express = require('express')
const userMiddleware = require('../../middleware/userMiddleware')

const router = express.Router()

router.get('/', userMiddleware, (req, res) => {
  const { db } = req.app.locals
  const products = db.get('products').value()

  res.send({ products })
})

module.exports = router

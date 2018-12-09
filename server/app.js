// const path = require('path')
const express = require('express')
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')
const low = require('lowdb')
const FileAsync = require('lowdb/adapters/FileAsync')

async function setupServer () {
  const app = express()
  let db

  try {
    db = await low(new FileAsync('./server/db.json'))
  } catch (e) {
    console.error(e)
  }

  app.locals.db = db

  app.use(bodyParser.json())
  app.use(cookieParser())

  app.use('/api/v1/cart', require('./routers/cart'))
  app.use('/api/v1/products', require('./routers/products'))
  app.use('/api/v1/orders', require('./routers/orders'))

  app.listen(process.env.PORT || 8080, () =>
    console.log('server has started started')
  )
}

setupServer()

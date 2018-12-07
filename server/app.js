// const path = require('path')
const express = require('express')
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')
const low = require('lowdb')
const FileAsync = require('lowdb/adapters/FileAsync')

// const publicPath = path.join(__dirname, '..', 'public')

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
  // app.use('public', express.static(publicPath))

  app.use('/api/v1/cart', require('./routers/cart'))
  app.use('/api/v1/products', require('./routers/products'))
  app.use('/api/v1/orders', require('./routers/orders'))

  app.listen(process.env.PORT || 8080, () =>
    console.log('server has started started')
  )
}

setupServer()

 /*  app.get('*', (req, res) => {
    res.sendFile(path.join(publicPath, 'index.html'))
  }) */

/*   app.listen(process.env.PORT || 8080, () =>
    console.log('server has started started')
  ) */

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

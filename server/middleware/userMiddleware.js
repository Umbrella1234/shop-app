const { getErrorMessage } = require('../contstants/messages')

module.exports = (req, res, next) => {
  let { userId } = req.cookies
  const { db } = req.app.locals

  if (!userId) {
    res.status(401).send(getErrorMessage('UserId cookie is missing'))
    return
  }

  userId = +userId

  const users = db.get('users')
  let userData = users.find({ id: userId }).value()

  // create anonymous user if user isn't present in db
  if (!userData) {
    userData = {
      id: userId,
      firstname: null,
      lastname: null,
      middlename: null,
      email: null,
      isAnonymous: true
    }
    users.push(userData).write()
  }

  res.locals.userData = userData
  res.locals.userId = userId

  next()
}

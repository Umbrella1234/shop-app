const getSuccessMessage = data => {
  const msg = { result: 'OK' }
  if (data) msg.data = data

  return msg
}

const getErrorMessage = message => ({
  result: 'ERROR',
  message
})

module.exports = {
  getSuccessMessage,
  getErrorMessage
}

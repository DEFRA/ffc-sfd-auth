const { STATE } = require('../../constants/cache-keys')

const validateState = (request, state) => {
  const cachedState = request.yar.get(STATE)

  if (cachedState !== state) {
    throw new Error('Invalid state, possible CSRF attack detected')
  }
}

module.exports = {
  validateState
}

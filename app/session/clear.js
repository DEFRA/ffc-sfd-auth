const { STATE, INITIALISATION_VECTOR, REFRESH_TOKEN } = require('../constants/cache-keys')

const clear = (request) => {
  request.yar.clear(STATE)
  request.yar.clear(INITIALISATION_VECTOR)
  request.yar.clear(REFRESH_TOKEN)
}

module.exports = {
  clear
}

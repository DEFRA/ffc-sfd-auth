const { set } = require('./set')
const { clear } = require('./clear')
const { exists } = require('./exists')

module.exports = {
  setSession: set,
  clearSession: clear,
  existsInSession: exists
}

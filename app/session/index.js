const { get } = require('./get')
const { set } = require('./set')
const { clear } = require('./clear')
const { exists } = require('./exists')
const { attach } = require('./attach')
const { reset } = require('./reset')

module.exports = {
  getSession: get,
  setSession: set,
  clearSession: clear,
  existsInSession: exists,
  attachSession: attach,
  resetSession: reset
}

const { get } = require('./get')
const { set } = require('./set')
const { clear } = require('./clear')
const { exists } = require('./exists')

module.exports = {
  getSession: get,
  setSession: set,
  clearSession: clear,
  existsInSession: exists
}

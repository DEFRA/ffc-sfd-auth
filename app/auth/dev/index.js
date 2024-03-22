const { getAccessToken } = require('./get-access-token')
const { validateToken } = require('./validate-token')
const { getKeys } = require('./get-keys')
const { setPermissions } = require('./set-permissions')

module.exports = {
  getAccessToken,
  validateToken,
  getKeys,
  setPermissions
}

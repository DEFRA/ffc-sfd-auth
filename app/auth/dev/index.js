const { getAccessToken } = require('./get-access-token')
const { validateToken } = require('./validate-token')
const { getKeys } = require('./get-keys')
const { refreshAccessToken } = require('./refresh-access-token')
const { setPermissions } = require('./set-permissions')

module.exports = {
  getAccessToken,
  validateToken,
  getKeys,
  refreshAccessToken,
  setPermissions
}

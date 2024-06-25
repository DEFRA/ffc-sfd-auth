const { getAccessToken } = require('./get-access-token')
const { getAuthorizationUrl } = require('./get-authorization-url')
const { getKeys } = require('./get-keys')
const { getSignOutUrl } = require('./get-sign-out-url')
const { refreshAccessToken } = require('./refresh-access-token')
const { setPermissions } = require('./set-permissions')
const { validateToken } = require('./validate-token')

module.exports = {
  getAccessToken,
  getAuthorizationUrl,
  getKeys,
  getSignOutUrl,
  refreshAccessToken,
  setPermissions,
  validateToken
}

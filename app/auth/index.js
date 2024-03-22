const { authConfig } = require('../config')
const auth = authConfig.defraIdEnabled ? require('./defra-id') : require('./dev')
const { decodeState } = require('./decode-state')
const { getRedirectPath } = require('./get-redirect-path')
const { mapAuth } = require('./map-auth')

module.exports = {
  ...auth,
  decodeState,
  getRedirectPath,
  mapAuth
}

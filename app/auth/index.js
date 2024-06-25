const { authConfig } = require('../config')
const activeDirectory = require('./active-directory')
const auth = authConfig.defraIdEnabled ? require('./defra-id') : require('./dev')
const { createState } = require('./create-state')
const { createInitialisationVector } = require('./create-initialisation-vector')
const { decodeState } = require('./decode-state')
const { getRedirectPath } = require('./get-redirect-path')
const { mapAuth } = require('./map-auth')
const { parseJwt } = require('./parse-jwt')

module.exports = {
  activeDirectory,
  ...auth,
  createState,
  createInitialisationVector,
  decodeState,
  getRedirectPath,
  mapAuth,
  parseJwt
}

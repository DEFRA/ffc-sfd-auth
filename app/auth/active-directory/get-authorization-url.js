const { getClient } = require('./get-client')
const { authConfig } = require('../../config')
const { createState } = require('../create-state')
const { createInitialisationVector } = require('../create-initialisation-vector')

const getAuthorizationUrl = async (request, options) => {
  const client = getClient()

  const state = createState(request, options.redirect)
  const initialisationVector = createInitialisationVector(request)

  const parameters = {
    prompt: 'select_account',
    redirectUri: authConfig.activeDirectory.redirectUrl,
    state,
    nonce: initialisationVector
  }

  return client.getAuthCodeUrl(parameters)
}

module.exports = {
  getAuthorizationUrl
}

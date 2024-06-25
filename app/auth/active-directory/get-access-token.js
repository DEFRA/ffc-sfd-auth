const { getClient } = require('./get-client')
const { authConfig } = require('../../config')

const getAccessToken = async (tokenRequest, state, initialisationVector) => {
  const client = getClient()

  return client.acquireTokenByCode({
    code: tokenRequest.code,
    state: tokenRequest.state,
    redirectUri: authConfig.redirectUrl
  }, {
    code: tokenRequest.code,
    state,
    nonce: initialisationVector
  })
}

module.exports = {
  getAccessToken
}

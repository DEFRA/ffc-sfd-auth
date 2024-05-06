const { authConfig } = require('../../config')
const { createState } = require('./create-state')
const { createInitialisationVector } = require('./create-initialisation-vector')
const { getWellKnown } = require('./get-well-known')

const getAuthorizationUrl = async (request, options) => {
  const { authorization_endpoint: url } = await getWellKnown()

  const state = createState(request, options.redirect)
  const initialisationVector = createInitialisationVector(request)

  const query = [
    `p=${authConfig.policy}`,
    `client_id=${authConfig.clientId}`,
    `serviceId=${authConfig.serviceId}`,
    `state=${state}`,
    `nonce=${initialisationVector}`,
    `redirect_uri=${authConfig.redirectUrl}`,
    `scope=openid offline_access ${authConfig.clientId}`,
    'response_type=code',
    'response_mode=query'
  ]

  if (options.forceReselection) {
    query.push('forceReselection=true')
  }

  if (options.organisationId) {
    query.push(`relationshipId=${options.organisationId}`)
  }

  return encodeURI(`${url}?${query.join('&')}`)
}

module.exports = {
  getAuthorizationUrl
}

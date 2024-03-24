const { ROLE } = require('../../constants/cache-keys')
const { getSession } = require('../../session')
const { getScopes } = require('../get-scopes')

const validateToken = (decoded, request, _h) => {
  const role = getSession(request, ROLE)
  const scope = getScopes(request)

  return {
    isValid: true,
    credentials: {
      role,
      scope,
      name: 'Andrew Farmer',
      crn: decoded.contactId,
      personId: 1,
      organisationId: 1
    }
  }
}

module.exports = {
  validateToken
}

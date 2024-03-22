const { ROLE } = require('../../constants/cache-keys')
const { getSession } = require('../../session')
const { getScopes } = require('../get-scopes')

const validateToken = (decoded, request, _h) => {
  return {
    isValid: true,
    credentials: {
      role: getSession(request, ROLE),
      scope: getScopes(request),
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

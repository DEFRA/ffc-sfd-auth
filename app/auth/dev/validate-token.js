const { ROLE, IS_VALID } = require('../../constants/cache-keys')
const { getSession } = require('../../session')
const { getScopes } = require('../get-scopes')

const validateToken = (decoded, request, _h) => {
  const isValidSession = getSession(request, IS_VALID) === true

  if (!isValidSession) {
    return {
      isValid: false,
      errorMessage: 'Invalid session'
    }
  }

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

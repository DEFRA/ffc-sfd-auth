const { getScopes } = require('../get-scopes')
const { getSession } = require('../../session')
const { ROLE, ORGANISATION_ID, PERSON_ID, IS_VALID } = require('../../constants/cache-keys')

const validateToken = async (decoded, request, _h) => {
  const isValidSession = getSession(request, IS_VALID) === true

  if (!isValidSession) {
    return {
      isValid: false,
      errorMessage: 'Invalid session'
    }
  }

  const role = getSession(request, ROLE)
  const scope = getScopes(request)
  const personId = getSession(request, PERSON_ID)
  const organisationId = getSession(request, ORGANISATION_ID)

  return {
    isValid: true,
    credentials: {
      role,
      scope,
      name: `${decoded.firstName} ${decoded.lastName}`,
      crn: decoded.contactId,
      personId,
      organisationId
    }
  }
}

module.exports = {
  validateToken
}

const { getScopes } = require('../get-scopes')
const { getSession } = require('../session')
const { ROLE, ORGANISATION_ID, PERSON_ID } = require('../../constants/cache-keys')

const validateToken = (decoded, request, _h) => {
  return {
    isValid: true,
    credentials: {
      role: getSession(request, ROLE),
      scope: getScopes(request),
      name: `${decoded.firstName} ${decoded.lastName}`,
      crn: decoded.contactId,
      personId: getSession(request, PERSON_ID),
      organisationId: getSession(request, ORGANISATION_ID)
    }
  }
}

module.exports = {
  validateToken
}

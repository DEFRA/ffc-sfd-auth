const { getScopes } = require('../get-scopes')
const { getSession } = require('../session')
const { ROLE } = require('../../constants/cache-keys')

const validateToken = (decoded, request, _h) => {
  return {
    isValid: true,
    credentials: {
      role: getSession(request, ROLE),
      scope: getScopes(request),
      name: `${decoded.firstName} ${decoded.lastName}`,
      crn: decoded.contactId
    }
  }
}

module.exports = {
  validateToken
}

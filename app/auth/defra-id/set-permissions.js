const { setSession } = require('../../session')
const { ROLE, SCOPES, PERSON_ID } = require('../../constants/cache-keys')
const { mapScopes } = require('./map-scopes')
const { getPersonId, getPermissions } = require('../../api')

const setPermissions = async (request, organisationId) => {
  const personId = await getPersonId(request)
  const permissions = await getPermissions(request, organisationId, personId)
  const scopes = mapScopes(permissions.privileges)
  setSession(request, PERSON_ID, personId)
  setSession(request, ROLE, permissions.role)
  setSession(request, SCOPES, scopes)
}

module.exports = {
  setPermissions
}

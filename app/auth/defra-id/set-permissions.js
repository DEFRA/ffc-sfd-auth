const Wreck = require('@hapi/wreck')
const { AUTH_COOKIE_NAME } = require('../../constants/cookies')
const { serverConfig } = require('../../config')
const { setSession } = require('../../session')
const { PERMISSIONS, ROLES } = require('../../constants/cache-keys')

const setPermissions = async (request, organisationId) => {
  const personId = await getPersonId(request)
  const permissions = await getPermissions(personId, organisationId)
  // map permissions to scopes
  // save scopes to cache
  setSession(request, ROLES, permissions.roles.join('|'))
  setSession(request, PERMISSIONS, permissions.privileges.join('|'))
}

const getPersonId = async (request) => {
  const query = `query {
          person {
            id
          }
        }`
  const { payload } = await Wreck.post(serverConfig.dataHost, {
    headers: {
      crn: request.auth.credentials.crn,
      Authorization: request.state[AUTH_COOKIE_NAME],
      'Content-Type': 'application/json'
    },
    payload: JSON.stringify({ query }),
    json: true
  })
  return payload.data.person.id
}

const getPermissions = async (request) => {
  const query = `query {
          permissions {
            roles,
            permissions
          }
        }`
  const { payload } = await Wreck.post(serverConfig.dataHost, {
    headers: {
      crn: request.auth.credentials.crn,
      Authorization: request.state[AUTH_COOKIE_NAME],
      'Content-Type': 'application/json'
    },
    payload: JSON.stringify({ query }),
    json: true
  })
  return payload.data
}

module.exports = {
  setPermissions
}

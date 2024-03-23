const Wreck = require('@hapi/wreck')
const { AUTH_COOKIE_NAME } = require('../../constants/cookies')
const { serverConfig } = require('../../config')
const { setSession } = require('../../session')
const { ROLE, SCOPES, PERSON_ID } = require('../../constants/cache-keys')

const setPermissions = async (request, organisationId) => {
  const personId = await getPersonId(request)
  const permissions = await getPermissions(request, organisationId, personId)
  const scopes = mapScopes(permissions.privileges)
  setSession(request, PERSON_ID, personId)
  setSession(request, ROLE, permissions.role)
  setSession(request, SCOPES, scopes)
}

const {
  USER,
  SFD_VIEW,
  ORGANISATION_AMEND,
  ORGANISATION_VIEW,
  AHWP_SUBMIT,
  AHWP_AMEND,
  AHWP_VIEW
} = require('../scopes')

const {
  BUSINESS_AMEND,
  BPS_SUBMIT
} = require('../privileges')

const mapScopes = (privileges) => {
  const scopes = [USER, SFD_VIEW]
  if (privileges.includes(BUSINESS_AMEND)) {
    scopes.push(ORGANISATION_AMEND)
    scopes.push(ORGANISATION_VIEW)
    scopes.push(AHWP_SUBMIT)
    scopes.push(AHWP_AMEND)
    scopes.push(AHWP_VIEW)
  }
  if (privileges.includes(BPS_SUBMIT)) {
    scopes.push(AHWP_SUBMIT)
    scopes.push(AHWP_AMEND)
    scopes.push(AHWP_VIEW)
  }
  return [...new Set(scopes)]
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

const getPermissions = async (request, organisationId, personId) => {
  const query = `query {
          permissions(organisationId: ${organisationId}, personId: ${personId}) {
            role,
            privileges
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
  return payload.data.permissions
}

module.exports = {
  setPermissions
}

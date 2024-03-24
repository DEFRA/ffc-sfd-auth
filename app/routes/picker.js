const Joi = require('joi')
const Wreck = require('@hapi/wreck')
const { GET, POST } = require('../constants/http-verbs')
const { ORGANISATION_ID } = require('../constants/cache-keys')
const { AUTH_COOKIE_NAME } = require('../constants/cookies')
const { getRedirectPath, setPermissions } = require('../auth')
const { serverConfig } = require('../config')
const { setSession } = require('../session')

module.exports = [{
  method: GET,
  path: '/picker',
  options: {
    auth: {
      mode: 'required'
    }
  },
  handler: async (request, h) => {
    console.log('credentials: ', request.auth.credentials)
    const query = `query {
          personOrganisations {
            crn
            organisations {
              id
              sbi
              name
            }
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

    const redirect = getRedirectPath(request.query.redirect)

    if (payload.data.personOrganisations.length === 0) {
      return h.view('no-organisations')
    }

    if (payload.data.personOrganisations.length === 1) {
      setSession(request, ORGANISATION_ID, payload.data.personOrganisations[0].organisation.id)
      await setPermissions(request, request.payload.organisationId)
      return h.redirect(redirect)
    }

    return h.view('picker', { redirect, organisations: payload.data.personOrganisations.organisations })
  }
}, {
  method: POST,
  path: '/picker',
  options: {
    validate: {
      payload: Joi.object({
        organisationId: Joi.number().integer().required(),
        redirect: Joi.string().optional().allow('')
      }),
      failAction: async (request, h, _error) => {
        return h.view('sign-in', {
          message: 'Organisation must be selected',
          redirect: request.payload.redirect
        }).takeover()
      }
    }
  },
  handler: async (request, h) => {
    setSession(request, ORGANISATION_ID, request.payload.organisationId)
    await setPermissions(request, request.payload.organisationId)
    return h.redirect(getRedirectPath(request.payload.redirect))
  }
}]

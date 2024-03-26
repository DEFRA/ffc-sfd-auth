const Joi = require('joi')
const Wreck = require('@hapi/wreck')
const { Boom } = require('@hapi/boom')
const { GET, POST } = require('../constants/http-verbs')
const { ORGANISATION_ID } = require('../constants/cache-keys')
const { AUTH_COOKIE_NAME } = require('../constants/cookies')
const { getRedirectPath, setPermissions } = require('../auth')
const { serverConfig } = require('../config')
const { setSession } = require('../session')

module.exports = [{
  method: GET,
  path: '/picker',
  options: { auth: { strategy: 'jwt' } },
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
      await setPermissions(request, request.payload.organisationId)
      setSession(request, ORGANISATION_ID, payload.data.personOrganisations[0].organisation.id)
      return h.redirect(redirect)
    }

    return h.view('picker', { redirect, organisations: payload.data.personOrganisations.organisations })
  }
}, {
  method: POST,
  path: '/picker',
  options: {
    auth: { strategy: 'jwt' },
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
    await setPermissions(request, request.payload.organisationId)
    setSession(request, ORGANISATION_ID, request.payload.organisationId)
    return h.redirect(getRedirectPath(request.payload.redirect))
  }
}, {
  method: GET,
  path: '/picker/external',
  options: {
    validate: {
      query: Joi.object({
        organisationId: Joi.number().integer().required(),
        redirect: Joi.string().optional().allow('')
      }),
      failAction: async (request, h, _error) => {
        return Boom.badRequest('Organisation must be selected')
      }
    }
  },
  handler: async (request, h) => {
    const redirect = getRedirectPath(request.query.redirect)

    if (!request.auth.isAuthenticated) {
      return h.redirect(`/auth/sign-in?redirect=${redirect}&organisationId=${request.query.organisationId}`)
    }

    try {
      await setPermissions(request, request.query.organisationId)
      setSession(request, ORGANISATION_ID, request.query.organisationId)
      return h.redirect(getRedirectPath(redirect))
    } catch (error) {
      console.log(error)
      return h.redirect(`/auth/picker?redirect=${redirect}`)
    }
  }
}]

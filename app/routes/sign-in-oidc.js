const Joi = require('joi')
const { authConfig } = require('../config')
const { AUTH_COOKIE_NAME } = require('../constants/cookies')
const { REFRESH_TOKEN, INITIALISATION_VECTOR, STATE, IS_VALID } = require('../constants/cache-keys')
const { GET } = require('../constants/http-verbs')
const { validateState, decodeState, validateInitialisationVector, getAccessToken, getRedirectPath, parseJwt } = require('../auth')
const { clearSession, setSession } = require('../session')

module.exports = [{
  method: GET,
  path: '/sign-in-oidc',
  options: {
    validate: {
      query: Joi.object({
        code: Joi.string().required(),
        state: Joi.string().required()
      }).options({ stripUnknown: true }),
      failAction (request, h, err) {
        console.log(`Login failed: ${err}`)
        return h.redirect('/auth/sign-in-oidc/invalid').takeover()
      }
    }
  },
  handler: async (request, h) => {
    if (request.auth.isAuthenticated) {
      return h.redirect(getRedirectPath())
    }

    try {
      validateState(request, request.query.state)
    } catch (error) {
      console.log(`Login failed: ${error}`)
      return h.redirect('/auth/sign-in-oidc/invalid')
    }

    const { access_token: accessToken, refresh_token: refreshToken } = await getAccessToken(request.query.code)

    try {
      validateInitialisationVector(request, accessToken)
    } catch (error) {
      console.log(`Login failed: ${error}`)
      return h.redirect('/auth/sign-in-oidc/invalid')
    }

    const state = decodeState(request.query.state)
    const redirect = getRedirectPath(state.redirect)
    clearSession(request, INITIALISATION_VECTOR)
    clearSession(request, STATE)
    setSession(request, REFRESH_TOKEN, refreshToken)
    setSession(request, IS_VALID, true)

    const organisationId = parseJwt(accessToken).currentRelationshipId

    return h.redirect(`/auth/picker/defra-id?redirect=${redirect}&organisationId=${organisationId}`)
      .state(AUTH_COOKIE_NAME, accessToken, authConfig.cookieOptions)
  }
}, {
  method: GET,
  path: '/sign-in-oidc/invalid',
  handler: (request, h) => {
    clearSession(request, INITIALISATION_VECTOR)
    clearSession(request, STATE)
    clearSession(request, REFRESH_TOKEN)
    clearSession(request, IS_VALID)
    return h.view('sign-in-invalid')
  }
}]

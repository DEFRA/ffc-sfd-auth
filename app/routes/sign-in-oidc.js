const Joi = require('joi')
const { authConfig } = require('../config')
const { AUTH_COOKIE_NAME } = require('../constants/cookies')
const { REFRESH_TOKEN, INITIALISATION_VECTOR, STATE, IS_VALID } = require('../constants/cache-keys')
const { GET } = require('../constants/http-verbs')
const { validateState, decodeState, validateInitialisationVector, getAccessToken, getRedirectPath } = require('../auth')
const { clearSession, setSession } = require('../session')
const { parseJwt } = require('../auth/defra-id/parse-jwt')

module.exports = {
  method: GET,
  path: '/sign-in-oidc',
  options: {
    auth: false,
    plugins: {
      crumb: false
    },
    validate: {
      query: Joi.object({
        code: Joi.string().required(),
        state: Joi.string().required()
      }).options({ stripUnknown: true }),
      failAction (request, h, err) {
        console.log(`Defra ID login failed: ${err}`)
        return h.view('500').takeover()
      }
    }
  },
  handler: async (request, h) => {
    if (request.auth.isAuthenticated) {
      return h.redirect(getRedirectPath())
    }

    validateState(request, request.query.state)
    const state = decodeState(request.query.state)
    const { access_token: accessToken, refresh_token: refreshToken } = await getAccessToken(request.query.code)
    validateInitialisationVector(request, accessToken)
    const redirect = getRedirectPath(state.redirect)
    clearSession(request, INITIALISATION_VECTOR)
    clearSession(request, STATE)
    setSession(request, REFRESH_TOKEN, refreshToken)
    setSession(request, IS_VALID, true)

    const organisationId = parseJwt(accessToken).currentRelationshipId

    return h.redirect(`/auth/picker/defra-id?redirect=${redirect}&organisationId=${organisationId}`)
      .state(AUTH_COOKIE_NAME, accessToken, authConfig.cookieOptions)
  }
}

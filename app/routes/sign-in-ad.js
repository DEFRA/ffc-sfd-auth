const Joi = require('joi')
const { authConfig } = require('../config')
const { AUTH_INTERNAL_COOKIE_NAME } = require('../constants/cookies')
const { INITIALISATION_VECTOR, STATE, IS_VALID, REFRESH_TOKEN } = require('../constants/cache-keys')
const { GET } = require('../constants/http-verbs')
const { getRedirectPath, activeDirectory, decodeState } = require('../auth')
const { getAccessToken } = activeDirectory
const { clearSession, setSession, getSession } = require('../session')

module.exports = {
  method: GET,
  path: '/sign-in-ad',
  options: {
    auth: { mode: 'try' },
    validate: {
      query: Joi.object({
        // nonce: Joi.string().required(),
        state: Joi.string().required(),
        code: Joi.string().required()
      }).options({ stripUnknown: true }),
      failAction (request, h, err) {
        console.log(`Active Directory login failed: ${err}`)
        return h.view('500').takeover()
      }
    }
  },
  handler: async (request, h) => {
    if (request.auth.isAuthenticated) {
      return h.redirect(getRedirectPath())
    }

    const sessionState = getSession(request, STATE)
    const sessionInitialisationVector = getSession(request, INITIALISATION_VECTOR)
    const { accessToken, refreshToken } = await getAccessToken(request.query, sessionState, sessionInitialisationVector)
    const state = decodeState(request.query.state)
    const redirect = getRedirectPath(state.redirect)
    clearSession(request, INITIALISATION_VECTOR)
    clearSession(request, STATE)
    setSession(request, REFRESH_TOKEN, refreshToken)
    setSession(request, IS_VALID, true)

    // return h.redirect(`/auth/picker/active-directory?redirect=${redirect}`)
    //   .state(AUTH_INTERNAL_COOKIE_NAME, accessToken, authConfig.cookieOptions)

    return h.redirect('/auth/test')
      .state(AUTH_INTERNAL_COOKIE_NAME, accessToken, authConfig.cookieOptions)
  }
}

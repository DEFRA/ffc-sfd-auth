const { GET } = require('../constants/http-verbs')
const { AUTH_COOKIE_NAME } = require('../constants/cookies')
const { authConfig } = require('../config')
const { decodeState, getRedirectPath, validateState } = require('../auth')
const { clearSession } = require('../session')

module.exports = [{
  method: GET,
  path: '/sign-out-oidc',
  handler: async (request, h) => {
    let redirect = '/landing-page'

    if (authConfig.defraIdEnabled && authConfig.defraIdSignOutEnabled) {
      validateState(request, request.query.state)
      const state = decodeState(request.query.state)
      redirect = getRedirectPath(state.redirect)
    }

    clearSession(request)

    return h.view('sign-out', { redirect: request.query.redirect ?? redirect })
      .unstate(AUTH_COOKIE_NAME, authConfig.cookieOptions)
  }
}]

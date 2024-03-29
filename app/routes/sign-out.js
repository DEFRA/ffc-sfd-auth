const { GET } = require('../constants/http-verbs')
const { AUTH_COOKIE_NAME } = require('../constants/cookies')
const { authConfig } = require('../config')
const { getSignOutUrl } = require('../auth')
const { resetSession } = require('../session')

module.exports = [{
  method: GET,
  path: '/sign-out',
  handler: async (request, h) => {
    const redirect = request.query.redirect ?? '/landing-page'

    if (authConfig.defraIdEnabled && authConfig.defraIdSignOutEnabled) {
      resetSession(request)
      return h.redirect(await getSignOutUrl(request, redirect, request.state[AUTH_COOKIE_NAME]))
        .unstate(AUTH_COOKIE_NAME, authConfig.cookieOptions)
    }

    return h.redirect(`/auth/sign-out-oidc?redirect=${redirect}`)
  }
}]

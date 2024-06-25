const { GET } = require('../constants/http-verbs')
const { REFRESH_TOKEN } = require('../constants/cache-keys')
const { refreshAccessToken, getRedirectPath } = require('../auth')
const { getSession, setSession, resetSession } = require('../session')
const { AUTH_EXTERNAL_COOKIE_NAME } = require('../constants/cookies')
const { authConfig } = require('../config')

module.exports = {
  method: GET,
  path: '/refresh',
  options: {
    auth: false
  },
  handler: async (request, h) => {
    const redirect = getRedirectPath(request.query.redirect)
    const refreshToken = getSession(request, REFRESH_TOKEN)

    if (refreshToken) {
      const { access_token: accessToken, refresh_token: newRefreshToken } = await refreshAccessToken(refreshToken)
      setSession(request, REFRESH_TOKEN, newRefreshToken)
      return h.redirect(redirect)
        .state(AUTH_EXTERNAL_COOKIE_NAME, accessToken, authConfig.cookieOptions)
    }

    resetSession(request)

    return h.redirect(`/sign-in?redirect=${redirect}`)
      .unstate(AUTH_EXTERNAL_COOKIE_NAME, authConfig.cookieOptions)
  }
}

const { parseJwt } = require('../auth/defra-id/parse-jwt')
const { AUTH_COOKIE_NAME } = require('../constants/cookies')

module.exports = {
  plugin: {
    name: 'auth-refresh',
    register: (server, options) => {
      server.ext('onPreAuth', async (request, h) => {
        if (request.path.includes('/assets/')) {
          return h.continue
        }

        const token = request.state[AUTH_COOKIE_NAME]

        if (!token) {
          return h.continue
        }

        const decoded = parseJwt(token)

        if (decoded.exp * 1000 - Date.now() <= 600 * 1000) {
          return h.redirect(`/auth/refresh?redirect=${request.url.pathname}`).takeover()
        }

        return h.continue
      })
    }
  }
}

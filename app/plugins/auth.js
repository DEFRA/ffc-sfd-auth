const { getKeys, validateToken } = require('../auth')
const { RS256 } = require('../constants/algorithms')
const { AUTH_EXTERNAL_COOKIE_NAME, AUTH_INTERNAL_COOKIE_NAME } = require('../constants/cookies')
const { EXTERNAL, INTERNAL } = require('../constants/strategies')
const { authConfig } = require('../config')

module.exports = {
  plugin: {
    name: 'auth',
    register: async (server, _options) => {
      server.auth.strategy(EXTERNAL, 'jwt', {
        key: async () => {
          const { publicKey } = await getKeys()
          return { key: publicKey }
        },
        cookieKey: AUTH_EXTERNAL_COOKIE_NAME,
        validate: validateToken,
        verifyOptions: {
          algorithms: [RS256],
          ignoreExpiration: true
        }
      })

      // TODO: sort this out
      server.auth.strategy(INTERNAL, 'cookie', {
        cookie: {
          name: AUTH_INTERNAL_COOKIE_NAME,
          password: 'password-should-be-32-characters-long-or-more-please-change',
          ttl: authConfig.cookieOptions.ttl,
          path: '/',
          isSecure: authConfig.cookieOptions.isSecure,
          isSameSite: 'Lax'
        },
        // keepAlive: true,
        redirectTo: '/auth/sign-in/internal'
      })

      server.auth.default({ strategy: EXTERNAL, mode: 'try' })
    }
  }
}

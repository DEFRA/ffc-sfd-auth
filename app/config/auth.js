const Joi = require('joi')
const { PRODUCTION } = require('../constants/environments')

const schema = Joi.object().keys({
  defraIdEnabled: Joi.bool().default(false),
  defraIdSignOutEnabled: Joi.bool().default(false),
  wellKnownUrl: Joi.alternatives().conditional('defraIdEnabled', { is: true, then: Joi.string().uri().required(), otherwise: Joi.string().allow('') }),
  clientId: Joi.alternatives().conditional('defraIdEnabled', { is: true, then: Joi.string().required(), otherwise: Joi.string().allow('') }),
  clientSecret: Joi.alternatives().conditional('defraIdEnabled', { is: true, then: Joi.string().required(), otherwise: Joi.string().allow('') }),
  serviceId: Joi.alternatives().conditional('defraIdEnabled', { is: true, then: Joi.string().required(), otherwise: Joi.string().allow('') }),
  policy: Joi.alternatives().conditional('defraIdEnabled', { is: true, then: Joi.string().required(), otherwise: Joi.string().allow('') }),
  refreshTokens: Joi.boolean().default(true),
  redirectUrl: Joi.string().default('http://localhost:3000/auth/sign-in-oidc'),
  postLogoutRedirectUrl: Joi.string().default('http://localhost:3000/auth/sign-out-oidc'),
  adEnabled: Joi.bool().default(true),
  activeDirectory: Joi.object({
    tenantId: Joi.alternatives().conditional('adEnabled', { is: true, then: Joi.string().required(), otherwise: Joi.string().allow('') }),
    clientId: Joi.alternatives().conditional('adEnabled', { is: true, then: Joi.string().required(), otherwise: Joi.string().allow('') }),
    clientSecret: Joi.alternatives().conditional('adEnabled', { is: true, then: Joi.string().required(), otherwise: Joi.string().allow('') }),
    redirectUrl: Joi.string().default('http://localhost:3000/auth/sign-in-ad')
  }),
  devAuthPrivateKey: Joi.string().optional().allow(''),
  devAuthPublicKey: Joi.string().optional().allow(''),
  jwtConfig: Joi.object({
    expiryInMinutes: Joi.number().default(60)
  }),
  cookieOptions: Joi.object({
    ttl: Joi.number().default(null),
    encoding: Joi.string().default('none'),
    isSameSite: Joi.string().valid('Lax').default('Lax'),
    isSecure: Joi.bool().default(true),
    isHttpOnly: Joi.bool().default(true),
    clearInvalid: Joi.bool().default(false),
    strictHeader: Joi.bool().default(true),
    path: Joi.string().default('/')
  })
})

const config = {
  defraIdEnabled: process.env.DEFRA_ID_ENABLED,
  defraIdSignOutEnabled: process.env.DEFRA_ID_SIGN_OUT_ENABLED,
  wellKnownUrl: process.env.DEFRA_ID_WELL_KNOWN_URL,
  clientId: process.env.DEFRA_ID_CLIENT_ID,
  clientSecret: process.env.DEFRA_ID_CLIENT_SECRET,
  serviceId: process.env.DEFRA_ID_SERVICE_ID,
  redirectUrl: process.env.DEFRA_ID_REDIRECT_URL,
  postLogoutRedirectUrl: process.env.DEFRA_ID_POST_LOGOUT_REDIRECT_URL,
  policy: process.env.DEFRA_ID_POLICY,
  refreshTokens: process.env.DEFRA_ID_REFRESH_TOKENS,
  adEnabled: process.env.AD_ENABLED,
  activeDirectory: {
    tenantId: process.env.AD_TENANT_ID,
    clientId: process.env.AD_CLIENT_ID,
    clientSecret: process.env.AD_CLIENT_SECRET,
    redirectUrl: process.env.AD_REDIRECT_URL
  },
  devAuthPrivateKey: process.env.DEV_AUTH_PRIVATE_KEY,
  devAuthPublicKey: process.env.DEV_AUTH_PUBLIC_KEY,
  jwtConfig: {
    expiryInMinutes: process.env.JWT_EXPIRY_IN_MINUTES
  },
  cookieOptions: {
    ttl: process.env.AUTH_COOKIE_TTL,
    encoding: process.env.AUTH_COOKIE_ENCODING,
    isSameSite: process.env.AUTH_COOKIE_SAME_SITE,
    isSecure: process.env.NODE_ENV === PRODUCTION,
    isHttpOnly: process.env.AUTH_COOKIE_HTTP_ONLY,
    clearInvalid: process.env.AUTH_COOKIE_CLEAR_INVALID,
    strictHeader: process.env.AUTH_COOKIE_STRICT_HEADER
  }
}

const { error, value } = schema.validate(config)

if (error) {
  throw new Error(`The authentication config is invalid. ${error.message}`)
}

console.log(`Authentication mode: ${value.defraIdEnabled ? 'Defra ID' : 'Local'}`)

module.exports = value

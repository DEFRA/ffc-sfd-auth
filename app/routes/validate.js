const Joi = require('joi')
const Boom = require('@hapi/boom')
const Iron = require('@hapi/iron')
const { POST } = require('../constants/http-verbs')
const { validateToken } = require('../auth')
const { serverConfig } = require('../config')

module.exports = [{
  method: POST,
  path: '/validate',
  options: {
    auth: false,
    plugins: {
      crumb: false
    },
    validate: {
      payload: Joi.object({
        sessionId: Joi.string().optional(),
        token: Joi.object().required()
      }),
      failAction: (_request, _h, error) => {
        return Boom.badRequest(error)
      }
    },
    handler: async (request, h) => {
      if (request.payload.sessionId) {
        request.yar.id = await Iron.unseal(request.payload.sessionId, serverConfig.cookiePassword, Iron.defaults)
        request.yar._store = await request.yar._cache.get(request.yar.id)
      }
      const result = validateToken(request.payload.token, request)
      return h.response(result)
    }
  }
}]

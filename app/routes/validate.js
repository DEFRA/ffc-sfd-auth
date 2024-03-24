const Joi = require('joi')
const Boom = require('@hapi/boom')
const { POST } = require('../constants/http-verbs')
const { validateToken } = require('../auth')
const { attachSession } = require('../session')

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
        session: Joi.string().optional(),
        token: Joi.object().required()
      }),
      failAction: (_request, _h, error) => {
        return Boom.badRequest(error)
      }
    },
    handler: async (request, h) => {
      if (request.payload.session) {
        await attachSession(request, request.payload.session)
        const result = validateToken(request.payload.token, request)
        return h.response(result)
      }
      return h.response({ isValid: false, errorMessage: 'Invalid session' })
    }
  }
}]

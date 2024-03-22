const Joi = require('joi')
const Boom = require('@hapi/boom')
const { POST } = require('../constants/http-verbs')
const { validateToken } = require('../auth')

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
        request: Joi.object().optional(),
        token: Joi.object().required()
      }),
      failAction: (_request, _h, error) => {
        return Boom.badRequest(error)
      }
    },
    handler: (request, h) => {
      const result = validateToken(request.payload.token, request.payload.request)
      return h.response(result)
    }
  }
}]

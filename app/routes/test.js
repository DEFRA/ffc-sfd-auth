const { GET } = require('../constants/http-verbs')
const { INTERNAL } = require('../constants/strategies')

module.exports = [{
  method: GET,
  path: '/test',
  options: { auth: { strategy: INTERNAL } },
  handler: async (request, h) => {
    return h.view('test')
  }
}]

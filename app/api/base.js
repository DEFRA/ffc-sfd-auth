const Wreck = require('@hapi/wreck')
const { AUTH_COOKIE_NAME } = require('../../constants/cookies')
const { serverConfig } = require('../../config')

const base = async (request, query) => {
  const { payload } = await Wreck.post(serverConfig.dataHost, {
    headers: {
      crn: request.auth.credentials.crn,
      Authorization: request.state[AUTH_COOKIE_NAME],
      'Content-Type': 'application/json'
    },
    payload: JSON.stringify({ query }),
    json: true
  })
  return payload.data
}

module.exports = {
  base
}
